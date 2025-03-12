const API_URL = window.location.origin;


// when html is load
document.addEventListener("DOMContentLoaded", ()=>{
    let currentPath = window.location.pathname;

    document.querySelectorAll(".nav-item").forEach(element =>{
        if (element.getAttribute("data-url")===currentPath){element.classList.add('nav-selected');}
    })

    document.querySelectorAll('.nav-left-item').forEach(element =>{
        console.log(currentPath);

        if(element.getAttribute('data-url')===currentPath){element.classList.add("nav-left-item-active"); console.log(element.getAttribute("data-url"))}
    })

    // Add logout btn event
    btn_logout = document.getElementById('btn-logout')
    if(btn_logout){
        btn_logout.addEventListener("click", function(){
            window.location.href = 'logout';
            current_user = null;
        })
    }

    document.addEventListener("click", ()=>{
        let dropdowns = document.querySelectorAll(".dropdown-menu");
        if(dropdowns.length > 0){
            dropdowns.forEach(element =>{
                element.classList.remove('d-flex');
                element.classList.add('d-none');
            })
        }
    })
    
})

// options : {method}
async function sendRequest(url, method="GET" ,data=null, json=true) {
    
    try{
        
        let options = {
            method:method
        }
        // add data
        if (data && json){
            options.body = JSON.stringify(data);
            options.headers =  {
                "Content-Type": "application/json"
            }

            console.log(`Données envoyé à '${url} : ${data}' 1`);
        }
    
        // if not use json
        else if (!json){
            options.body = data;

            console.log(`Données envoyé à '${url} : ${data}' 2`);
        }
        console.log(`Options: ${options}`);
        
        let response = await fetch(url, options);
        return await response.json(); // return json response
            
    }catch (error){
        console.error("Erreur AJAX : ", error);
        return null;
    }   
}

// Add links to btn with url
let navItems = document.querySelectorAll('.btn-url');
navItems.forEach(element =>{
    element.addEventListener("click", function(){
        window.location.href = this.getAttribute('data-url')
    })
});

// #region NAVBAR

// Handle left bar in phone mode
function hideSideBar(){
    let sideBar = document.getElementById('navbarLeft');
    let btnSideBar = document.getElementById('btn-open-sidebar');
    let hideScreen = document.getElementById('hide-screen');

    if (sideBar && btnSideBar){
        sideBar.classList.add('navbar-left-closing');
        
        btnSideBar.classList.remove("svg-on");
        hideScreen.style.display = "none";

        setTimeout(() => {
            sideBar.classList.remove('navbar-left-closing');
            sideBar.style.display = "none";
        }, 300);
    }
}

function showSideBar(){
    let sideBar = document.getElementById('navbarLeft');
    let btnSideBar = document.getElementById('btn-open-sidebar');
    let hideScreen = document.getElementById('hide-screen');
    if (sideBar && btnSideBar){
        sideBar.classList.add('navbar-left-opening');
        sideBar.style.display = "flex";
        btnSideBar.classList.add("svg-on");
        hideScreen.style.display = "block";

        setTimeout(() => {
            sideBar.classList.remove('navbar-left-opening');
        }, 300);
    }
}

// function for the click of the btn side bar
function handleSideBar(){
    let sideBar = document.getElementById('navbarLeft');
    if(getComputedStyle(sideBar).display === "none"){
        showSideBar();
        console.log("1")
    }
    else{
        hideSideBar();
        console.log("2")
    }
}


// #endregion


// #region graphics features

// FORM INPUT FLOATING ANIMATION
function reloadFloatingLabels(){
    let floatingInputs = document.querySelectorAll('.floating-input-container');
    if(floatingInputs.length > 0){
        console.log("Yes");

        floatingInputs.forEach(parent =>{
            // get the input
            let input = parent.querySelector('.floating-input');

            // get the floating labe
            let floatingLabel = parent.querySelector('.floating-label');


            //change floating label background
            floatingLabel.style.backgroundColor = parent.style.backgroundColor;

            // Apply events
            input.addEventListener("focus", ()=>{
                // Enter input while input is empty
                if(input.value === ""){floatingLabel.classList.add("floating-label-move", "floating-label-top");}
                
                // Enter input while input is not empty
                else{floatingLabel.classList.add("floating-label-top");}
            })

            input.addEventListener("blur", ()=>{
                // Enter input while input is empty
                if(input.value === ""){floatingLabel.classList.remove("floating-label-move", "floating-label-top");}
                
                // Enter input while input is not empty
                else{floatingLabel.classList.remove("floating-label-top");}
            })
        })
    }
}
reloadFloatingLabels();

// Change error label
function setInputError(message, input_container_id){
    
    let inputContainer = document.getElementById(input_container_id);

    if(inputContainer){
        // set label visible
        inputContainer.querySelector('.floating-label-info').style.display = "block";
        // set message
        inputContainer.querySelector('.floating-label-info').textContent = message;
        // set border color to red
        inputContainer.querySelector('.floating-input').classList.add('floating-input-error');
        // set floating label to red
        inputContainer.querySelector('.floating-label').classList.add('floating-label-error');
    }
    

}

function removeInputError(input_container_id){
    // set label visible
    let inputContainer = document.getElementById(input_container_id);

    if(inputContainer){
        // set label invisible
        inputContainer.querySelector('.floating-label-info').style.display = "none";
        // set border color to normal
        inputContainer.querySelector('.floating-input').classList.remove('floating-input-error');
        // set floating label to normal
        inputContainer.querySelector('.floating-label').classList.remove('floating-label-error');
    }
}

// dropdown handling

function dropdownHandler(event){
    event.stopPropagation();
    let dropdown = document.getElementById('dropdown-menu-user');
    if(dropdown){
        dropdown.classList.replace('d-none', 'd-flex');

    }
}
// #endregion