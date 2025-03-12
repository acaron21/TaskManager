// get current user
let current_user = null;
async function fetchCurrentUser(){
    const response = await fetch('/get_current_user');
    const data = await response.json();

    if(data.error){
        console.log("User is not loged in")
        
    }
    else{
        current_user = data;
    }
}


// async function leftNavbarState(display){
//     if(!display){
//         // hide left bar
//         let navLeft = document.getElementById('navbarLeft');
//         if(navLeft){
//             navLeft.style.display = "none";
//         }
//         // arrange diplay of top bar/main content
//         let navTop = document.getElementById('navbarTop');
//         let mainContent = document.getElementById('main-content');
//         if(navTop && mainContent){
//             navTop.style.left = 0;
//             navTop.style.width = "100%";
//             mainContent.style.paddingLeft = "0px";
//         }
//     }
// }

