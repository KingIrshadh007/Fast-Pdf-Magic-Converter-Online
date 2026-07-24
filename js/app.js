// ===============================
// DARK MODE
// ===============================

const themeToggle = document.getElementById("themeToggle");


if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark-mode");

    if(themeToggle){
        themeToggle.innerHTML="☀️ Light Mode";
    }

}



if(themeToggle){

themeToggle.addEventListener("click",()=>{


document.body.classList.toggle("dark-mode");


if(document.body.classList.contains("dark-mode")){


localStorage.setItem("theme","dark");

themeToggle.innerHTML="☀️ Light Mode";


}
else{


localStorage.setItem("theme","light");

themeToggle.innerHTML="🌙 Dark Mode";


}



});


}
