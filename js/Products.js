// declarations
let items = [];
let products = document.getElementById("products");
let searchProduct = document.getElementById("Search");
let category = document.getElementById("Categories");

document.addEventListener("DOMContentLoaded", () => {
  const navbarUser = document.getElementById("navbarUser");
  const user = JSON.parse(localStorage.getItem("currentUser"));

});

async function getProducts() {
  let response = await fetch("https://fakestoreapi.com/products", {
    method: "GET",
  });
  let data = await response.json();
  items = data;
  displayProducts();
}
getProducts();
function displayProducts() {
  var cartona = "";
  for (let i = 0; i < items.length; i++) {
    cartona += `          <div class="col-md-3">
            <div class="card product-card h-100">
              <img
                src="${items[i].image}"
                class="card-img-top product-image"
                alt="..."
              />
              <div class="card-body">
                <h6 class="card-title">
                ${items[i].title}
                </h6>
                <p class="card-text text-secondary">
                ${items[i].description}
                </p>
                <div class="mt-auto">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="product-price">$ ${items[i].price}</span>
                    <div class="product-rating">
                      <i class="fa fa-star"></i>
                      <small>${items[i].rating.rate}</small>
                    </div>
                  </div>
                  <button class="btn background-color text-white w-100 add-to-cart-btn" data-product-id="${i}" style="background-color: #346180;" > 
                    <i class="fa-solid fa-cart-plus"></i>
                    Add to Cart</button>
                </div>
              </div>
            </div>
          </div>`;
  }
  products.innerHTML = cartona;
  addCartEventListeners()
}
function search() {
  var cartona = "";
  for (let i = 0; i < items.length; i++) {
    if (
      items[i].title.toLowerCase().includes(searchProduct.value.toLowerCase())
    ) {
      cartona += `<div class="col-md-3">
    <div class="card product-card h-100">
      <img
        src="${items[i].image}"
        class="card-img-top product-image"
        alt="..."
      />
      <div class="card-body">
        <h6 class="card-title">
        ${items[i].title}
        </h6>
        <p class="card-text text-secondary">
        ${items[i].description}
        </p>
        <div class="mt-auto">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="product-price">$ ${items[i].price}</span>
            <div class="product-rating">
              <i class="fa fa-star"></i>
              <small>${items[i].rating.rate}</small>
            </div>
          </div>
          <button class="btn background-color text-white w-100 add-to-cart-btn" data-product-id="${i}" style="background-color: #346180;" > 
            <i class="fa-solid fa-cart-plus"></i>
            Add to Cart</button>
        </div>
      </div>
    </div>
  </div>`;
    }
  }
  products.innerHTML = cartona;
  addCartEventListeners()
}
function showCategory() {
  var cartona = "";
  const selectedCategory = category.value;

  // Check if "All Categories" is selected
  if (selectedCategory === "All Categories") {
    // Show all products
    for (let i = 0; i < items.length; i++) {
      cartona += `<div class="col-md-3">
            <div class="card product-card h-100">
              <img
                src="${items[i].image}"
                class="card-img-top product-image"
                alt="..."
              />
              <div class="card-body">
                <h6 class="card-title">
                ${items[i].title}
                </h6>
                <p class="card-text text-secondary">
                ${items[i].description}
                </p>
                <div class="mt-auto">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="product-price">$ ${items[i].price}</span>
                    <div class="product-rating">
                      <i class="fa fa-star"></i>
                      <small>${items[i].rating.rate}</small>
                    </div>
                  </div>
                  <button class="btn background-color text-white w-100 add-to-cart-btn" data-product-id="${i}" style="background-color: #346180;" > 
                    <i class="fa-solid fa-cart-plus"></i>
                    Add to Cart</button>
                </div>
              </div>
            </div>
          </div>`;
    }
  } else {
    // Create regex pattern for category matching
    let categoryRegex;
    if (selectedCategory.startsWith("/") && selectedCategory.endsWith("/")) {
      // Custom regex pattern: /pattern/
      const pattern = selectedCategory.slice(1, -1);
      try {
        categoryRegex = new RegExp(pattern, "i");
      } catch (e) {
        // If invalid regex, fall back to exact match
        categoryRegex = new RegExp("^" + selectedCategory + "$", "i");
      }
    } else if (selectedCategory.includes("*")) {
      // Wildcard pattern: * matches any characters
      const pattern = selectedCategory.replace(/\*/g, ".*");
      categoryRegex = new RegExp(pattern, "i");
    } else if (selectedCategory.includes("?")) {
      // Single character wildcard: ? matches one character
      const pattern = selectedCategory.replace(/\?/g, ".");
      categoryRegex = new RegExp(pattern, "i");
    } else {
      // Exact match (case insensitive)
      categoryRegex = new RegExp("^" + selectedCategory + "$", "i");
    }

    for (let i = 0; i < items.length; i++) {
      if (categoryRegex.test(items[i].category)) {
        cartona += `<div class="col-md-3">
              <div class="card product-card h-100">
                <img
                  src="${items[i].image}"
                  class="card-img-top product-image"
                  alt="..."
                />
                <div class="card-body">
                  <h6 class="card-title">
                  ${items[i].title}
                  </h6>
                  <p class="card-text text-secondary">
                  ${items[i].description}
                  </p>
                  <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="product-price">$ ${items[i].price}</span>
                      <div class="product-rating">
                        <i class="fa fa-star"></i>
                        <small>${items[i].rating.rate}</small>
                      </div>
                    </div>
                    <button class="btn background-color text-white w-100 add-to-cart-btn" data-product-id="${i}" style="background-color: #346180;" > 
                      <i class="fa-solid fa-cart-plus"></i>
                      Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>`;
      }
    }
  }

  products.innerHTML = cartona;
  addCartEventListeners()
}
document.addEventListener("DOMContentLoaded", () => {
  const navbarUser = document.getElementById("navbarUser");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user && user.email) {
    navbarUser.innerHTML = `
      <span class="fw-bold white">Hi, ${user.email}</span>
      <button class="btn btn-outline-light btn-sm" id="logoutBtn">Logout</button>
      <a class="white" href="cart.html">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
      </a>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
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

function addCartEventListeners() {
  const cartButtons = document.querySelectorAll('.add-to-cart-btn');
  cartButtons.forEach(button => {
    button.addEventListener('click', function () {
      const productId = parseInt(this.getAttribute('data-product-id'));
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  const product = items[productId];
  if (product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    showCartNotification();

    if (window.cartFunctions && window.cartFunctions.updateCartCount) {
      window.cartFunctions.updateCartCount();
    }

    console.log('Cart updated:', cart);
  }
}

function showCartNotification() {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show position-fixed" 
         style="top: 20px; right: 20px; z-index: 1050; min-width: 300px;">
      <i class="fa-solid fa-check-circle me-2"></i>
      Item added to cart successfully!
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 1000);
}
