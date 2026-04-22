const API_BASE = "./backend/api";

function apiUrl(path) {
  const normalizedPath = String(path || "").replace(/^\/+/, "");
  return `${API_BASE}/${normalizedPath}`;
}

async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;
  const requestOptions = {
    method,
    headers: { ...headers },
    credentials: "same-origin",
  };

  if (body !== undefined) {
    requestOptions.headers["Content-Type"] = "application/json";
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(apiUrl(path), requestOptions);
  const data = await response.json().catch(() => ({
    success: false,
    message: "Invalid server response.",
  }));

  if (!response.ok || data.success === false) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

function getCurrentUser() {
  const storedUser = localStorage.getItem("currentUser");
  return storedUser ? JSON.parse(storedUser) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart");
}

async function syncCurrentUser() {
  try {
    const response = await apiRequest("/auth/me.php");
    setCurrentUser(response.user);
    return response.user;
  } catch (error) {
    if (error.status === 401) {
      clearCurrentUser();
      return null;
    }
    throw error;
  }
}

async function logoutUser() {
  try {
    await apiRequest("/auth/logout.php", { method: "POST" });
  } finally {
    clearCurrentUser();
  }
}

async function refreshCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (!cartCountElement) {
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    cartCountElement.textContent = "0";
    cartCountElement.style.display = "none";
    return;
  }

  try {
    const response = await apiRequest("/cart.php");
    const count = response.totals?.items_count || 0;
    cartCountElement.textContent = count;
    cartCountElement.style.display = count > 0 ? "inline" : "none";
  } catch (error) {
    if (error.status === 401) {
      clearCurrentUser();
      renderNavbar();
      return;
    }
  }
}

function renderNavbar() {
  const navbarUser = document.getElementById("navbarUser");
  if (!navbarUser) {
    return;
  }

  const user = getCurrentUser();

  if (user && user.email) {
    navbarUser.innerHTML = `
      <span class="fw-bold white">Hi, ${user.name}</span>
      <button class="btn btn-outline-light btn-sm" id="logoutBtn">Logout</button>
      <a class="white position-relative" href="cart.html">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
        <span class="cart-count badge bg-danger position-absolute top-0 start-100 translate-middle" style="display: none;">0</span>
      </a>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await logoutUser();
        window.location.href = "login.html";
      });
    }
  } else {
    navbarUser.innerHTML = `
      <a class="white" href="login.html">
        <i class="fa-solid fa-user"></i>
        <span>Login</span>
      </a>
      <a class="white position-relative" href="cart.html">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
        <span class="cart-count badge bg-danger position-absolute top-0 start-100 translate-middle" style="display: none;">0</span>
      </a>
    `;
  }

  if (window.cartFunctions && typeof window.cartFunctions.updateCartCount === "function") {
    window.cartFunctions.updateCartCount();
  }
}

window.appApi = {
  request: apiRequest,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  syncCurrentUser,
  logoutUser,
  renderNavbar,
  refreshCartCount,
};

document.addEventListener("DOMContentLoaded", async () => {
  renderNavbar();

  try {
    await syncCurrentUser();
  } catch (_error) {
    // Keep the last known UI state when the backend is unreachable.
  }

  renderNavbar();
  refreshCartCount();
});
