


// Login request
let loginForm = document.getElementById('loginForm');
if(loginForm){
    
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // dont reload the page
        // Login Input containers
        let username_id ="input-container-username";
        let password_id = "input-container-password";

        // reset username and passowrd label errors
        removeInputError(username_id);
        removeInputError(password_id);

        const formData = new FormData(this); // get all form inputs (need to use name="")
    
        const response = await fetch("/login_submit", {
            method: "POST",
            body: formData //form envoyer direct sans JSON.stringify()
        });
    
        const data = await response.json();
        console.log(data);
    
        if (data.success){
            window.location.href = data.redirect_url;
            // check for sidebar btn display
            // checkLoginAndMobileForSideBar();
        }
        else{
            // username error
            if(data.username_error !== ""){setInputError(data.username_error, username_id);}
             // password error
            if(data.password_error !== ""){setInputError(data.password_error, password_id);}
        }
    
    })
}

//Register request
let registerForm = document.getElementById('registerForm');
if(registerForm){
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Register Input containers
        let username_id ="input-container-username";
        let password_id = "input-container-password";
        let password_id2 = "input-container-password2";

        // reset username and passowrd label errors
        removeInputError(username_id);
        removeInputError(password_id);
        removeInputError(password_id2);

        const formData = new FormData(this);

        // First validation
        if(formData.get('username') === ""){
            setInputError("Has to be filled", username_id);
        }
        if(formData.get('password1') === ""){
            setInputError("Has to be filled", password_id);
        }
        if(formData.get('password2') === ""){
            setInputError("Has to be filled", password_id2);
        }
        else if(formData.get('password1')===formData.get('password2') &&
            formData.get('password1').length > 2 ){

            const response = await fetch("/register_submit", {
                method:"POST",
                body: formData
            });
    
            const data = await response.json();

            if(data.success){
                window.location.href = data.redirect_url;

            }
            else{
                console.log("Error : ", data.username_error);
                setInputError(data.username_error, username_id);

            }
        }
        else{
            console.log("Les mots de passes ne sont pas conformes !");
            setInputError("Not same password", password_id2);
        }

        
    })
}
