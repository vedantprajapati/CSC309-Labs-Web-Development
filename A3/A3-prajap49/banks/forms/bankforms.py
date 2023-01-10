from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


class BankAddForm(forms.Form):
    name = forms.CharField(required=True, max_length=200)
    description = forms.CharField(required=True, max_length=200)
    inst_num = forms.CharField(required=True, max_length=200)
    swift_code = forms.CharField(required=True, max_length=200)

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data
