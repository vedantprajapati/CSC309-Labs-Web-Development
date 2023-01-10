from django.db import models
from django.contrib.auth.models import User


class Subscription(models.Model):
    """
    A model to represent a TFC subscription plan

    Fields:
    cost : positive int
        the cost per term for the subscription in CAD
    term_length : positive int
        the length of a term in months
    """
    cost = models.PositiveIntegerField(help_text="Cost of Subscription in CAD")
    term_length = models.PositiveIntegerField(help_text="Length of a single term in months")

    def __str__(self):
        return f"{self.cost} {self.term_length}"

class Payment(models.Model):
    user = models.ForeignKey('users.TFCUser', related_name="payments", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=7, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    DEBIT = "DB"
    CREDIT = "CR"
    CARD_TYPE_CHOICES = [
        (DEBIT, "Debit"),
        (CREDIT, "Credit")
    ]
    card_type = models.CharField(max_length=2, choices=CARD_TYPE_CHOICES)
    card_number = models.CharField(max_length=16)
    card_holder_name = models.CharField(max_length=150)
    expiry_date = models.DateTimeField()
    security_code = models.CharField(max_length=4)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.user} {self.amount} {self.date}"