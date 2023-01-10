from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


class RegisterForm(forms.Form):
    username = forms.CharField(required=True, max_length=200)
    password1 = forms.CharField(
        required=True, widget=forms.PasswordInput, max_length=200
    )
    
    password2 = forms.CharField(
        required=True, widget=forms.PasswordInput, max_length=200
    )
    
    email = forms.EmailField(required=False, max_length=200)
    first_name = forms.CharField(required=False, max_length=200)
    last_name = forms.CharField(required=False, max_length=200)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        if (
            cleaned_data.get("username")
            and User.objects.filter(username=cleaned_data["username"]).exists()
        ):
            self.add_error(
                "username", ValidationError("A user with that username already exists")
            )
        if cleaned_data.get("password") and len(cleaned_data.get("password")) < 8:
            self.add_error(
                "password",
                ValidationError(
                    "This password is too short. It must contain at least 8 characters"
                ),
            )
        if cleaned_data.get("password1") != cleaned_data.get("password2"):
            self.add_error(
                "password2", ValidationError("The two password fields didn't match")
            )
        self.cleaned_data['password'] = cleaned_data.get("password1")
        self.cleaned_data.pop('password1')
        return cleaned_data
