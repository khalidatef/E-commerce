var emailInput = document.getElementById("userEmail");
var passwordInput = document.getElementById("userPassword");
var loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  var email = emailInput.value.trim();
  var password = passwordInput.value.trim();

  if (email === "" || password === "") {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await window.appApi.request("/auth/login.php", {
      method: "POST",
      body: { email, password },
    });

    window.appApi.setCurrentUser(response.user);
    alert(response.message);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

