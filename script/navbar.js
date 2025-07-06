document.addEventListener("DOMContentLoaded", () => {
  validateUserFromLocalStorage();
  validateAuthToken();
  const token = localStorage.getItem("authToken");
  const userData = localStorage.getItem("user");

  const greeting = document.getElementById("greeting");
  const usernameEl = document.getElementById("username");
  const emailEl = document.getElementById("email");
  const logoutBtn = document.getElementById("logout");
  const ctaBtn = document.getElementById("ctaBtn");

  if (!token || !userData) {
    greeting.textContent = "Selamat datang di website!";
    usernameEl.textContent = "Belum daftar";
    emailEl.textContent = "Silakan daftar untuk fitur tambahan";
    logoutBtn.style.display = "none";
    ctaBtn.textContent = "Login";
    ctaBtn.href = "./register-login/";
    return;
  }

  const user = JSON.parse(userData);
  greeting.textContent = `Selamat datang, ${user.username}!`;
  usernameEl.textContent = user.username;
  emailEl.textContent = user.email;
  logoutBtn.style.display = "inline-block";
  ctaBtn.textContent = "Halaman Pengguna";
  ctaBtn.href = "./user-section/";
});

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.reload();
}

// Mobile menu toggle functionality
function toggleMenu() {
  const navbarItems = document.getElementById("navbarItems");
  const burger = document.querySelector(".burger-menu");
  const isOpen = navbarItems.classList.toggle("active");

  burger.classList.toggle("active");

  document.body.style.overflow = isOpen ? 'hidden' : 'auto';
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const navbarItems = document.getElementById("navbarItems");
  const burgerMenu = document.querySelector(".burger-menu");
  const navbar = document.querySelector(".navbar");

  if (
    !navbar.contains(event.target) &&
    navbarItems.classList.contains("active")
  ) {
    navbarItems.classList.remove("active");
    burgerMenu.classList.remove("active");
  }
});

// Close menu when clicking on nav items (mobile)
document
  .querySelectorAll(".navbar-items a, .navbar-items button")
  .forEach((item) => {
    item.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        const navbarItems = document.getElementById("navbarItems");
        const burgerMenu = document.querySelector(".burger-menu");
        navbarItems.classList.remove("active");
        burgerMenu.classList.remove("active");
      }
    });
  });
