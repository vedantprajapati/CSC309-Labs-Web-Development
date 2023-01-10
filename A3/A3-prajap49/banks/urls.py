from django.urls import path
from banks.views import BankListView, BankDetailView, BankAddView, BranchesAddView, branch_details, branches_all
app_name = 'banks'

urlpatterns = [
    path('add/', BankAddView.as_view(), name='bank_add'),
    path('<int:pk>/details/', BankDetailView.as_view(), name='bank_details'),
    path('<int:pk>/branches/add/', BranchesAddView.as_view(), name='branch_add'),
    path('branch/<int:pk>/details/', branch_details, name='branch_details'),
    path('all/', BankListView.as_view(), name='bank_list'),
    path('<int:pk>/branches/all/', branches_all, name='branches_all'),
]
