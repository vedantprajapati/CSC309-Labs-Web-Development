python -m pip install virtualenv

python -m virtualenv venv

source ./venv/bin/activate;

echo "Installing requirements.txt"
pip install -r requirements.txt;

echo "making and applying migrations"

./TorontoFitnessClub/manage.py makemigrations;
./TorontoFitnessClub/manage.py migrate;

echo "Creating superuser, press Ctrl+C to skip"
./TorontoFitnessClub/manage.py createsuperuser;

