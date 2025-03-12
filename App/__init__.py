from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager




#Flask app configuration
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:danakil21@localhost:5432/task_manager_db'
app.config['SECRET_KEY'] ='f056bd2cca7fec0312af2e63'

#db creation
db = SQLAlchemy(app)
migrate = Migrate(app, db)

#bcrypt
bcrypt = Bcrypt(app)

#login manager
login_manager = LoginManager(app)
login_manager.login_view = 'login_page'

from App import routes
from App import models