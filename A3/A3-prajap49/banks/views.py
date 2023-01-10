from django.shortcuts import render
from django.views.generic import FormView, DetailView, ListView
from django.http import HttpResponse, JsonResponse
from django.core.serializers import serialize

from django.urls import reverse
from banks.models import Bank, Branch
from banks.forms.bankforms import BankAddForm
from banks.forms.branchforms import BranchesAddForm

# Create your views here.


class BankAddView(FormView):
    template_name = "banks/bank_add.html"
    form_class = BankAddForm

    def get(self, request):
        if self.request.user.is_authenticated:
            return super().get(request)
        else:
            return HttpResponse("Unauthorized", status=401)

    def get_success_url(self):
        return reverse(
            "banks:bank_details", kwargs={"pk": Bank.objects.get(id=self.bank_id).id}
        )

    def form_valid(self, form):
        if self.request.user.is_authenticated:
            form.cleaned_data["institution_number"] = form.cleaned_data["inst_num"]
            form.cleaned_data.pop("inst_num")
            bank_args = form.cleaned_data
            bank_args["owner"] = self.request.user
            new_bank = Bank(**form.cleaned_data)
            new_bank.save()
            self.bank_id = new_bank.id
            return super().form_valid(form)


class BankDetailView(DetailView):

    model = Bank
    template_name = "banks/bank_details.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class BankListView(ListView):
    model = Bank
    template_name = "banks/bank_list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class BranchesAddView(FormView):
    template_name = "branches/branch_add.html"
    form_class = BranchesAddForm

    def get(self, request, pk):
        if self.request.user.is_authenticated:
            if self.request.user == Bank.objects.get(id=self.kwargs.get("pk")).owner:
                return super().get(request, pk)
            else:
                return HttpResponse("Forbidden", status=403)
        else:
            return HttpResponse("Unauthorized", status=401)

    def get_success_url(self):
        return reverse(
            "banks:branch_details",
            kwargs={"pk": Branch.objects.get(id=self.branch_id).id},
        )

    def form_valid(self, form):
        if not form.cleaned_data["capacity"]:
            form.cleaned_data.pop("capacity")
        new_branch = Branch(**form.cleaned_data)
        new_branch.save()

        Bank.objects.get(id=self.kwargs.get("pk")).branches.add(new_branch)
        Bank.objects.get(id=self.kwargs.get("pk")).save()
        self.branch_id = new_branch.id

        return super().form_valid(form)


def branch_details(request, pk):
    if request.method == "GET":
        branch = Branch.objects.get(id=pk)

        return JsonResponse(
            {
                "id": branch.id,
                "name": branch.name,
                "transit_num": branch.transit_num,
                "address": branch.address,
                "email": branch.email,
                "capacity": branch.capacity,
                "last_modified": branch.last_modified,
            }
        )


def branches_all(request, pk):
    if request.method == "GET":
        data = [
            {
                "id": branch.id,
                "name": branch.name,
                "transit_num": branch.transit_num,
                "address": branch.address,
                "email": branch.email,
                "capacity": branch.capacity,
                "last_modified": branch.last_modified,
            }
            for branch in Bank.objects.get(id=pk).branches.all()
        ]
        return JsonResponse(data, safe=False)
