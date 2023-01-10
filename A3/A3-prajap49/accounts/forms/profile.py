from cProfile import Profile
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session


class ProfileEditForm(forms.Form):
    def __init__(self, *args, **kwargs):
        self.email = kwargs.pop("email") if "email" in kwargs else None
        self.first_name = kwargs.pop("first_name") if "first_name" in kwargs else None
        self.last_name = kwargs.pop("last_name") if "last_name" in kwargs else None

        super(ProfileEditForm, self).__init__(*args, **kwargs)

        self.fields["password"] = forms.CharField(
            required=False, widget=forms.PasswordInput, max_length=200
        )
        self.fields["password2"] = forms.CharField(
            required=False, widget=forms.PasswordInput, max_length=200
        )
        self.fields["email"] = forms.EmailField(
            required=False, max_length=200, initial=self.email
        )
        self.fields["first_name"] = forms.CharField(
            required=False, max_length=200, initial=self.first_name
        )
        self.fields["last_name"] = forms.CharField(
            required=False, max_length=200, initial=self.last_name
        )

    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data.get("password") and len(cleaned_data.get("password")) < 8:
            self.add_error(
                "password",
                ValidationError(
                    "This password is too short. It must contain at least 8 characters"
                ),
            )
        if cleaned_data.get("password") != cleaned_data.get("password2"):
            self.add_error(
                "password2", ValidationError("The two password fields didn't match")
            )

        return cleaned_data
