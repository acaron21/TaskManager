from App import app, db
from functools import wraps
from flask import render_template, redirect, url_for, request, jsonify
from App.forms import LoginForm, RegisterForm
from App.models import User, Task
from flask_login import login_user, logout_user, login_required, current_user


#region Custom Decorators

def logout_required(route_function):
    @wraps(route_function)
    def decorated_function(*args, **kwargs):
        if current_user.is_authenticated:  # Si l'utilisateur est connecté
            return redirect(url_for("tasks_page"))  # Rediriger vers le dashboard
        return route_function(*args, **kwargs)
    return decorated_function
#endregion

# ! ------------- HOME PAGE
@app.route("/")
@app.route("/home")
@logout_required
def home_page():
    return render_template('home.html')

#region LOGIN / REGISTER routes


# ! ------------- LOGIN PAGE
@app.route('/login', methods=["GET", "POST"])
@logout_required
def login_page():
    
    return render_template('login.html')

@app.route('/login_submit', methods=['POST', 'GET'])
@logout_required
def login_submit():
    
    response = {
        "success": False,
        "username_error": "",
        "password_error": "",
        "redirect_url": ""
    }

    #get form datas
    username = request.form.get('username')
    password = request.form.get('password')
    print(f"username submited : {username} | password submited : {password}")

    user = User.query.filter_by(username=username).first()

    #check if user exists
    if user:
        #if user exists, check password match
        if user.check_password_match(_password=password):
            response["success"] = True
            #Username and Password are correct, then connect user
            login_user(user)
            response["redirect_url"] = url_for('tasks_page')
            
        else:
            response["password_error"] = "Wrong password"
    else:
        response["success"] = False
        response["username_error"] = "Username not found !"

    return jsonify(response)

# ! ------------ REGISTER
@app.route('/register', methods=["POST", "GET"])
@logout_required
def register_page():
    return render_template('register.html')

@app.route('/register_submit', methods=["POST", "GET"])
@logout_required
def register_submit():
    
    response = {
        "success": False,
        "username_error": "",
        "redirect_url" : ""
    }

    username = request.form.get('username')
    password1 = request.form.get('password1')

    print("Username entré : ", username)

    # verify if username already exists
    user = User.query.filter_by(username=username).first()

    if not user:
        #this username is not already used : OK !
        
        #create user
        user_to_create = User(
            username=username,
            password=password1
        )

        db.session.add(user_to_create)
        db.session.commit()

        #login the user
        login_user(user_to_create)

        #change response
        response["success"] = True
        response["redirect_url"] = url_for('tasks_page')

        print(f"User {username} is created ! ")

    else:
        #this username is already used !
        response["success"] = False
        response["username_error"] = "Username not available"

        print(f"'{username}' already used !")


    return jsonify(response)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login_page'))




#endregion


#region TASKS

# ! ------------- TASK PAGE
@app.route('/tasks')
@login_required
def tasks_page():
    return render_template('tasks.html')

@app.route('/create_task', methods=["POST"])
@login_required
def create_task():

    
    #get data
    # data = request.get_json()

    task_name = request.form.get('name')
    task_desc = request.form.get('description')

    print(f"Task to create (name : {task_name}, description: {task_desc})")
    
    #create new task for connected user
    if current_user.is_authenticated:
        new_task = Task(name=task_name, user_id=current_user.id, description=task_desc)

        

        #save
        db.session.add(new_task)
        db.session.commit()

        print("New task ID : ", new_task.id)

        print(f"task '{task_name}' for the user '{current_user.username}' (id:{current_user.id}) created !")
        
        new_task_json = {
            "id": new_task.id,
            "name": new_task.name,
            "description": new_task.description
        }

        return jsonify({"success":True, "new_task":new_task_json})

    return jsonify({"success":False})

@app.route('/delete_task', methods = ["DELETE"])
@login_required
def delete_task():

    data = request.get_json()
    task_id = int(data["row_id"].split("-")[1])

    print("Task to delete : ", task_id)

    # get the task to delete
    task_to_delete = Task.query.get(task_id)
    if task_to_delete:
        db.session.delete(task_to_delete)
        db.session.commit()
    
    else:
        return jsonify({"success":False})

    return jsonify({"success":True})




@app.route('/get_all_tasks', methods=["GET"])
@login_required
def get_all_tasks():

    tasks = Task.query.filter_by(user_id=current_user.id).all()

    tasks_json = []
    for task in tasks[::-1]:
        tasks_json.append({"id":task.id, "name": task.name, "description": task.description})


    return jsonify(tasks_json)


#endregion

#region CATEGORIES

# ! ------------- CATEGORIES PAGE
@app.route('/categories')
@login_required
def categories_page():
    return render_template('categories.html')

#endregion

#region USER DATA

@app.route('/get_current_user', methods=["GET"])
@login_required
def get_current_user():

    if current_user.is_authenticated:
        return jsonify({
            "id": current_user.id,
            "username" : current_user.username
        })
    
    else:
        return jsonify({"error" : "Need to login"}), 401

@app.route('/is_authenticated')
def is_authenticated():
    response = {
        "is_authenticated": current_user.is_authenticated
    }
    return jsonify(response)
    
#endregion