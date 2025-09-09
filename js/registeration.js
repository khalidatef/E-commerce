var signupForm = document.getElementById("signupForm");
var nameInput = document.getElementById("userName");
var emailInput = document.getElementById("userEmail");
var passwordInput = document.getElementById("userPassword");
var isAdmin = document.getElementById("isAdmin");

var usersList = [];

if (localStorage.getItem("users") != null) {
    usersList = JSON.parse(localStorage.getItem("users"));
}
//regular expression for email validation
function validateEmail(email) {
   

    let emailRegex = /^\w+@(gmail|yahoo|hotmail)\.com$/;
    let emailValue = emailInput.value.trim();
      if (emailValue === "") {
    emailInput.classList.remove("is-invalid", "is-valid");
    return;
  }
    if (emailRegex.test(emailValue)) {
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");

    } else {
        emailInput.classList.remove("is-valid");
        emailInput.classList.add("is-invalid");

    }
}


//regular expression for password validation
function validatePassword(password) {
    let passwordRegex = /^\w{6,20}$/;
    let passwordValue = passwordInput.value.trim();
    if (passwordRegex.test(passwordValue)) {
        passwordInput.classList.remove("is-invalid");
        passwordInput.classList.add("is-valid");
    }


    else {
        passwordInput.classList.remove("is-valid");
        passwordInput.classList.add("is-invalid");

    }
}
//regular expression for name validation
function validateName() {
  let nameRegex = /^\w{3,20}$/;
  let nameValue = nameInput.value.trim();

  if (nameRegex.test(nameValue)) {
    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");
  } else {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
  }
}


signupForm.addEventListener("submit", function (e) {

    e.preventDefault();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();

    if (name == "" || email == "" || password == "") {
        alert("Please fill all fields");
        return;
    }


    //check if email already exists
    var emailExists = false;
    for (var i = 0; i < usersList.length; i++) {
        if (usersList[i].email == email) {
            emailExists = true;
            break;
        }
    }

    if (emailExists) {
        alert("Email already exists");
        return;
    }
    //add new user to the list
    var newUser = {
        name: name,
        email: email,
        password: password,
        role: isAdmin.checked 
    
    };

    usersList.push(newUser);
    localStorage.setItem("users", JSON.stringify(usersList));

    alert("Account created successfully");

    // Clear the form fields after successful registration
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";

    // Redirect to login page after successful registration
    window.location.href = "login.html";
});
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);

nameInput.addEventListener("input", validateName);


