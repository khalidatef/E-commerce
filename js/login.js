var emailInput = document.getElementById("userEmail");
var passwordInput = document.getElementById("userPassword");
var loginForm = document.getElementById("loginForm");
var usersList = [];
if (localStorage.getItem("users") != null) {
    usersList = JSON.parse(localStorage.getItem("users"));
}
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
    if (email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }
    let currentUser = "";
    for (let i = 0; i < usersList.length; i++) {
        if (usersList[i].email === email && usersList[i].password === password) {
            currentUser = usersList[i];
            break;
        }
    }
    if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert("Login successful!");
         if (currentUser.role === true) {
        window.location.href = "admin.html";
    } else {
        window.location.href = "index.html";
    }
    }
    else {
        alert("Invalid email or password. Please try again.");

    }
});



