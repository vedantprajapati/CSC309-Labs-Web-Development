from django.db import models
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model

User = get_user_model()


class Class(models.Model):
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=150, null=True, blank=True)
    coach = models.ForeignKey('users.Coach', on_delete=models.PROTECT, related_name="classes", null=True, blank=True)
    keywords = models.JSONField(null=True, blank=True, help_text="(JSON Field)")
    capacity = models.PositiveIntegerField()
    studio = models.ForeignKey(
        "studios.Studio", related_name="classes", on_delete=models.CASCADE
    )

    # Sessions occur weekly after start date
    start_date = models.DateTimeField()
    session_length = models.DurationField(help_text="i.e., 00:01:00 for a one-hour session")
    end_date = models.DateField(
        default=date.today() + relativedelta(months=1)
    )
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    is_cancelled = models.BooleanField(default=False, help_text="Note: cancelling a class cancels all future sessions")

    def save(self, *args, **kwargs):
        is_creating = False
        if not self.pk:
            is_creating = True

        if is_creating:
            super(Class, self).save(*args, **kwargs)
            session_date = self.start_date
            while session_date.date() < self.end_date:
                ClassSession.objects.create(
                    time=session_date,
                    session_length=self.session_length,
                    tfc_class=self,
                )
                session_date = session_date + timedelta(days=7)
        else:
            old_cancel = Class.objects.get(id=self.id).is_cancelled
            if self.is_cancelled != old_cancel:
                for session in self.class_sessions.filter(time__gte=date.today()):

                    session.is_cancelled = self.is_cancelled
                    session.save()
            super(Class, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} {self.coach} {self.end_date}"

    class Meta:
        verbose_name = "Class"
        verbose_name_plural = "Classes"


class ClassSession(models.Model):
    time = models.DateTimeField()
    session_length = models.DurationField(help_text="i.e., 00:01:00 for a one-hour session")
    is_cancelled = models.BooleanField(default=False)
    tfc_class = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name="class_sessions"
    )
    participants = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return f"{self.id} {self.tfc_class} {self.time} {self.session_length}"

    class Meta:
        verbose_name = "ClassSession"
        verbose_name_plural = "ClassSessions"
