from App import db, bcrypt, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    
    __tablename__ = 'user'

    id = db.Column(db.Integer(), primary_key=True, unique=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    password_hash = db.Column(db.String(60), nullable=False)

    #relationship with tasks
    tasks = db.relationship('Task', backref="user", lazy=True, cascade="all, delete-orphan")
    
    @property
    def password(self):
        raise AttributeError("Impossible to get Password")

    @password.setter
    def password(self, plain_text_password):
        
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode("utf-8")
        print(self.password_hash)

    def check_password_match(self, _password):
        return bcrypt.check_password_hash(self.password_hash, _password)


class Task(db.Model):

    __tablename__ = "task"

    id = db.Column(db.Integer(), primary_key=True, unique=True)
    name = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(200))

    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)
