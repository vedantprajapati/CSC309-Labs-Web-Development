from django import forms
class BranchesAddForm(forms.Form):
    name = forms.CharField(required=True, max_length=200)
    transit_num = forms.CharField(required=True, max_length=200)
    address = forms.CharField(required=True, max_length=200)
    email = forms.EmailField(required=True)
    capacity = forms.IntegerField(required=False)

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data
