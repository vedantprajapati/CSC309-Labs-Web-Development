from accounts.forms.profile import ProfileEditForm
from accounts.forms.register import RegisterForm
from django.urls import reverse
from django.views.generic import FormView
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse

# Create your views here.


class Register(FormView):
    template_name = "accounts/register.html"
    form_class = RegisterForm

    def get_success_url(self):
        return reverse("accounts:login")

    def form_valid(self, form):
        form.cleaned_data.pop("password2")
        User.objects.create_user(**form.cleaned_data)
        return super().form_valid(form)
    

def login_view(request):
    if request.method == "GET":
        return TemplateResponse(request, "accounts/login.html")
    elif request.method == "POST":
        user = authenticate(
            username=request.POST["username"], password=request.POST["password"]
        )
        if user:
            login(request, user)
            return HttpResponseRedirect(reverse("accounts:profile"), status=302)
        else:
            error = "Username or password invalid"
            return TemplateResponse(request, "accounts/login.html", context={"error":error}, status=302)



def logout_view(request):
    if request.method == "GET":
        logout(request)
        return HttpResponseRedirect(reverse("accounts:login"), status=302)


def profile_view(request):
    if request.user.is_authenticated:
        if request.method == "GET":
            user = User.objects.get(id=request.user.id)

            return JsonResponse(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                }
            )
    else:
        return HttpResponse("Unauthorized", status=401)


def profile_edit_view(request):
    if request.user.is_authenticated:
        if request.method == "GET":
            user = User.objects.get(id=request.user.id)

            form = ProfileEditForm(
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
            )
            return TemplateResponse(
                request, "accounts/profile_edit.html", context={"form": form}
            )
        else:
            form = ProfileEditForm(request.POST)
            if form.is_valid():
                user = User.objects.get(id=request.user.id)
                if form.cleaned_data.get("password"):
                    user.password = form.cleaned_data["password"]
                user.first_name = form.cleaned_data["first_name"]
                user.last_name = form.cleaned_data["last_name"]
                user.email = form.cleaned_data["email"]
                user.save()
                login(request, user)
                return HttpResponseRedirect(reverse("accounts:profile"), status=302)
            else:
                return TemplateResponse(
                    request, "accounts/profile_edit.html", context={"form": form}, status=302
                )
    else:
        return HttpResponse("Unauthorized", status=401)
