from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, PasswordField, SubmitField
from wtforms.validators import Length, EqualTo, Email, DataRequired, ValidationError
from App.models import User


class LoginForm(FlaskForm):
    username = StringField(label="Username")
    password = PasswordField(label="Password")

    submit = SubmitField(label="Login")


class RegisterForm(FlaskForm):

    # Validation on the db users
    def validate_username(self, user_to_check):
        print("User to check : ", user_to_check.data)
        

    username = StringField(validators=[DataRequired()])
    password = PasswordField(validators=[DataRequired()])
    password2 = PasswordField(validators=[DataRequired(), EqualTo('password', message="Password not match")])
    
    submit = SubmitField()