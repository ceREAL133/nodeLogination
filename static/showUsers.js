let allUsers = document.getElementById("allUsers");
let button = document.getElementById("button");
let user = document.getElementById("user");

function showUsers(){
    if(allUsers.style.visibility === "hidden"){
        allUsers.style.visibility = "visible";
        allUsers.style.height = "auto";
        
        user.style.visibility = "hidden";
        user.style.height = "0";

        button.textContent = "Hide Users";
    } else{
        allUsers.style.visibility = "hidden";
        allUsers.style.height = "0";

        user.style.visibility = "visible";
        user.style.height = "auto";

        button.textContent = "Show All Users";
    }
}