const images = document.querySelectorAll('.slider-img');
let currentIndex = 0;

// Image slider logic
setInterval(() => {
  images[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add('active');
}, 3000); // Change image every 3 seconds

// navbar after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const navbarUser = document.getElementById("navbarUser");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user && user.email) {
    navbarUser.innerHTML = `
      <span class="fw-bold white">Hi, ${user.name}</span>
      <button class="btn btn-outline-light btn-sm" id="logoutBtn">Logout</button>
      <a class="white" href="cart.html">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
      </a>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "../index.html";
    });
  } else {
    navbarUser.innerHTML = `
      <a class="white" href="login.html">
        <i class="fa-solid fa-user"></i>
        <span>Login</span>
      </a>
      <a class="white" href="cart.html">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
      </a>
    `;
  }
});
