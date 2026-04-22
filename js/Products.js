// declarations
let items = [];
let products = document.getElementById("products");
let searchProduct = document.getElementById("Search");
let category = document.getElementById("Categories");

async function getProducts() {
  try {
    let response = await window.appApi.request("/products.php", {
      method: "GET",
    });
    items = response.products || [];
    displayProducts();
  } catch (error) {
    products.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">${error.message}</div>
      </div>
    `;
  }
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
function addCartEventListeners() {
  const cartButtons = document.querySelectorAll('.add-to-cart-btn');
  cartButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const productId = parseInt(this.getAttribute('data-product-id'));
      await addToCart(productId);
    });
  });
}

async function addToCart(productId) {
  const product = items[productId];
  if (product) {
    const currentUser = window.appApi.getCurrentUser();

    if (!currentUser) {
      alert("Please log in before adding items to your cart.");
      window.location.href = "login.html";
      return;
    }

    try {
      await window.appApi.request("/cart.php", {
        method: "POST",
        body: {
          product_id: product.id,
          quantity: 1
        }
      });

      showCartNotification();

      if (window.cartFunctions && window.cartFunctions.updateCartCount) {
        window.cartFunctions.updateCartCount();
      } else {
        window.appApi.refreshCartCount();
      }
    } catch (error) {
      if (error.status === 401) {
        window.appApi.clearCurrentUser();
        alert("Your session has expired. Please log in again.");
        window.location.href = "login.html";
        return;
      }

      alert(error.message);
    }
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
