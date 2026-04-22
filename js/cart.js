const cartContainer = document.getElementById("cartContainer");
const totalPriceDiv = document.getElementById("totalPrice");

let cart = [];

async function fetchCart() {
  try {
    const response = await window.appApi.request("/cart.php");
    cart = response.cart || [];
    displayCart();
    updateCartCount();
  } catch (error) {
    if (error.status === 401) {
      cart = [];
      cartContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center py-4">
            Please <a href="login.html" class="alert-link">log in</a> to view your cart.
          </div>
        </div>
      `;
      totalPriceDiv.innerHTML = "";
      updateCartCount();
      return;
    }

    showNotification(error.message, "danger");
  }
}

function displayCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart text-center py-5">
        <i class="fa-solid fa-shopping-cart fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">Your cart is empty</h4>
        <p class="text-muted">Add some products to get started!</p>
                 <a href="products.html" class="btn cart-btn">Continue Shopping</a>
      </div>
    `;
    updateCheckoutSection(0);
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = Number(item.price) * (item.quantity || 1);
    total += itemTotal;

    let productDiv = document.createElement("div");
    productDiv.classList.add("col-md-3", "mb-4");

    productDiv.innerHTML = `
      <div class="card">
        <img src="${item.image}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">$${item.price}</p>
                     <div class="d-flex align-items-center gap-2 mb-2">
             <button class="btn btn-sm cart-btn" onclick="decreaseQuantity(${index})" ${(item.quantity || 1) <= 1 ? 'disabled' : ''}>-</button>
             <span class="fw-bold">${item.quantity || 1}</span>
             <button class="btn btn-sm cart-btn" onclick="increaseQuantity(${index})">+</button>
           </div>
           <button class="btn btn-sm w-100 cart-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;

    cartContainer.appendChild(productDiv);
  });

  // Update the checkout section with dynamic data
  updateCheckoutSection(total);
}

// Function to update the checkout section
function updateCheckoutSection(subtotal) {
  // Get selected shipping option
  const selectedShipping = document.querySelector('input[name="shippingOption"]:checked');
  const shippingCost = selectedShipping ? parseFloat(selectedShipping.value) : 0;
  
  // Calculate final total
  const finalTotal = subtotal + shippingCost;
  
  // Generate the complete checkout section HTML
  totalPriceDiv.innerHTML = `
    <hr class="my-4">
    <div class="row">
      <div class="col-md-8">
        <h5 class="mb-3">Shipping Options:</h5>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="shippingOption" id="pickupOption" value="0" ${shippingCost === 0 ? 'checked' : ''}>
          <label class="form-check-label" for="pickupOption">
            Store pickup (20 min) - <span class="text-success">FREE</span>
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="shippingOption" id="deliveryOption" value="9.90" ${shippingCost === 9.90 ? 'checked' : ''}>
          <label class="form-check-label" for="deliveryOption">
            Home delivery (2-4 days) - $9.90
          </label>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">Order Summary</h6>
            <div class="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Shipping:</span>
              <span>${shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-3">
              <strong>Total:</strong>
              <strong>$${finalTotal.toFixed(2)}</strong>
            </div>
                         <button class="btn w-100 cart-btn" onclick="processCheckout(${finalTotal})">
               Checkout
             </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners for shipping options
  const shippingOptions = totalPriceDiv.querySelectorAll('input[name="shippingOption"]');
  shippingOptions.forEach(option => {
    option.addEventListener('change', handleShippingChange);
  });
}

function increaseQuantity(index) {
  if (cart[index]) {
    updateQuantity(cart[index].id, (cart[index].quantity || 1) + 1);
  }
}

function decreaseQuantity(index) {
  if (cart[index] && (cart[index].quantity || 1) > 1) {
    updateQuantity(cart[index].id, (cart[index].quantity || 1) - 1);
  }
}

async function updateQuantity(productId, newQuantity) {
  const quantity = parseInt(newQuantity);

  if (quantity > 0 && quantity <= 99) {
    try {
      await window.appApi.request("/cart.php", {
        method: "PATCH",
        body: {
          product_id: productId,
          quantity: quantity,
        },
      });
      await fetchCart();
    } catch (error) {
      showNotification(error.message, "danger");
    }
  } else if (quantity <= 0) {
    removeFromCartByProductId(productId);
  }
}

function removeFromCart(index) {
  const item = cart[index];
  if (!item) {
    return;
  }

  removeFromCartByProductId(item.id);
}

async function removeFromCartByProductId(productId) {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    try {
      await window.appApi.request("/cart.php", {
        method: "DELETE",
        body: { product_id: productId },
      });
      await fetchCart();
    } catch (error) {
      showNotification(error.message, "danger");
    }
  }
}

function clearCart() {
  if (cart.length === 0) {
    return;
  }
  
  if (confirm('Are you sure you want to clear your entire cart?')) {
    Promise.all(
      cart.map((item) =>
        window.appApi.request("/cart.php", {
          method: "DELETE",
          body: { product_id: item.id },
        })
      )
    )
      .then(fetchCart)
      .catch((error) => showNotification(error.message, "danger"));
  }
}

async function processCheckout(finalTotal) {
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'warning');
    return;
  }
  
  const selectedShipping = document.querySelector('input[name="shippingOption"]:checked');
  const shippingMethod = selectedShipping && selectedShipping.value === "9.90" ? "delivery" : "pickup";

  try {
    const response = await window.appApi.request("/checkout.php", {
      method: "POST",
      body: { shipping_method: shippingMethod },
    });

    showNotification(`Order #${response.order.id} placed successfully! Total: $${response.order.total.toFixed(2)}`, 'success');
    await fetchCart();
  } catch (error) {
    if (error.status === 401) {
      window.appApi.clearCurrentUser();
      window.location.href = "login.html";
      return;
    }

    showNotification(error.message, "danger");
  }
}

// Function to handle shipping option changes
function handleShippingChange() {
  // Recalculate totals when shipping option changes
  const total = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  updateCheckoutSection(total);
}

function  showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
         style="top: 20px; right: 20px; z-index: 1050; min-width: 300px;">
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 1000);
}

function getCartCount() {
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

function updateCartCount() {
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    const count = getCartCount();
    cartCountElement.textContent = count;
    cartCountElement.style.display = count > 0 ? 'inline' : 'none';
  }
}

// Initialize cart display
fetchCart();

// Export functions for use in other files
window.cartFunctions = {
  getCartCount,
  updateCartCount,
  showNotification
};
