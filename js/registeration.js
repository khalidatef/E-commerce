var signupForm = document.getElementById("signupForm");
var nameInput = document.getElementById("userName");
var emailInput = document.getElementById("userEmail");
var passwordInput = document.getElementById("userPassword");
var isAdmin = document.getElementById("isAdmin");
//regular expression for email validation
function validateEmail() {
   

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
function validatePassword() {
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
  let nameRegex = /^[A-Za-z\s]{3,30}$/;
  let nameValue = nameInput.value.trim();

  if (nameRegex.test(nameValue)) {
    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");
  } else {
    nameInput.classList.remove("is-valid");
    nameInput.classList.add("is-invalid");
  }
}


signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();

    if (name == "" || email == "" || password == "") {
        alert("Please fill all fields");
        return;
    }

    if (
      !nameInput.classList.contains("is-valid") ||
      !emailInput.classList.contains("is-valid") ||
      !passwordInput.classList.contains("is-valid")
    ) {
      alert("Please enter valid account details.");
      return;
    }

    try {
      const response = await window.appApi.request("/auth/register.php", {
        method: "POST",
        body: {
          name: name,
          email: email,
          password: password,
          is_admin: isAdmin.checked,
        },
      });

      alert(response.message);
      nameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      isAdmin.checked = false;
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
    }
});
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);

nameInput.addEventListener("input", validateName);


