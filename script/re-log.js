const host =
  location.hostname === "127.0.0.1" ? "localhost" : location.hostname;
const API_BASE_URL = `https://api.${host}/api`;

window.addEventListener("error", (e) => {
  console.error(
    `Script error at ${e.filename}:${e.lineno}:${e.colno}`,
    e.error
  );
});

let verificationSent = false;
let verificationCode = "";

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
  setupEventListeners();
});

function checkAuthStatus() {
  const token = localStorage.getItem("authToken");
  if (token) {
    // User is logged in, you might want to redirect or show a different UI
    console.log("User is logged in");
    // window.location.href = '/dashboard.html'; // Uncomment if you have a dashboard
  }
}

function setupEventListeners() {
  // Verification button
  document
    .getElementById("verificationBtn")
    .addEventListener("click", handleVerification);

  // Form submissions
  document
    .getElementById("signupForm")
    .addEventListener("submit", handleSignUp);
  document
    .getElementById("signinForm")
    .addEventListener("submit", handleSignIn);

  // Real-time validations
  document
    .getElementById("confirm-password")
    .addEventListener("input", validateConfirmPassword);
  document
    .getElementById("signup-email")
    .addEventListener("blur", validateEmail);
  document
    .getElementById("signup-username")
    .addEventListener("blur", validateUsername);
  document
    .getElementById("signup-password")
    .addEventListener("input", validatePassword);
  document
    .getElementById("signup-phone")
    .addEventListener("blur", validatePhone);

  // Network status
  window.addEventListener("online", handleOnlineStatus);
  window.addEventListener("offline", handleOfflineStatus);
}

function validateFormRealTime() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const button = document.getElementById("verificationBtn");

  let isValid = true;

  if (!username || username.length < 3) isValid = false;
  if (!email || !isValidEmail(email)) isValid = false;
  if (!phone || !isValidPhone(phone)) isValid = false;
  if (!password || password.length < 6) isValid = false;
  if (!confirmPassword || password !== confirmPassword) isValid = false;

  button.disabled = !isValid;
}

// Switch between sign-in and sign-up forms
function switchToSignIn() {
  document.getElementById("signup").classList.remove("active");
  document.getElementById("signin").classList.add("active");
  clearMessages();
}

function switchToSignUp() {
  document.getElementById("signin").classList.remove("active");
  document.getElementById("signup").classList.add("active");
  clearMessages();
}

// Clear all error and success messages
function clearMessages() {
  const messages = document.querySelectorAll(".error, .success");
  messages.forEach((el) => (el.style.display = "none"));
}

// Loading state management
function setLoadingState(button, isLoading, originalText = "") {
  button.disabled = isLoading;
  button.innerHTML = isLoading
    ? '<span class="loader"></span> Loading...'
    : originalText;
  button.style.opacity = isLoading ? "0.7" : "1";

  // Add/remove loading class
  isLoading
    ? button.classList.add("loading")
    : button.classList.remove("loading");
}

// API request helper with improved error handling
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.message || `HTTP error! status: ${response.status}`
      );
      error.response = response;
      throw error;
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Message display helpers
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = "block";

    // Auto-focus to first error field
    if (!document.querySelector(".error:focus")) {
      const firstErrorInput = element
        .closest(".form-group")
        ?.querySelector("input");
      if (firstErrorInput) {
        firstErrorInput.focus();
      }
    }
  }
}

function showSuccess(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = "block";
    element.style.color = "#27ae60";

    // Hide after 5 seconds
    setTimeout(() => {
      element.style.display = "none";
    }, 5000);
  }
}

function hideError(elementId) {
  const element = document.getElementById(elementId);
  if (element) element.style.display = "none";
}

function hideMessage(elementId) {
  const element = document.getElementById(elementId);
  if (element) element.style.display = "none";
}

// Verification handler
async function handleVerification() {
  // Get all form values
  const email = document.getElementById("signup-email").value.trim();
  const phoneInput = document.getElementById("signup-phone");
  const phone = phoneInput.value.replace(/\D/g, ''); // Remove all non-digit characters
  phoneInput.value = phone; // Update the input with cleaned value
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const button = document.getElementById("verificationBtn");
  const originalText = button.textContent;

  // Debug: Log all values before validation
  console.log("Form values:", {
    email,
    phone,
    username,
    password,
    confirmPassword
  });

  // Clear previous messages
  hideError("verification-error");
  hideMessage("verification-success");
  hideError("username-error");
  hideError("email-error");
  hideError("phone-error");
  hideError("password-error");
  hideError("confirm-password-error");

  // Validate ALL fields
  let isValid = true;

  // Username validation
  if (!username) {
    showError("username-error", "Username is required");
    isValid = false;
  } else if (username.length < 3) {
    showError("username-error", "Username must be at least 3 characters");
    isValid = false;
  }

  // Email validation
  if (!email) {
    showError("email-error", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("email-error", "Invalid email format");
    isValid = false;
  }

  // Phone validation
  if (!phone) {
    showError("phone-error", "Nomor telepon diperlukan");
    isValid = false;
  } else if (!isValidPhone(phone)) {
    showError("phone-error", "Format tidak valid (10-15 digit angka)");
    isValid = false;
  }

  // Password validation
  if (!password) {
    showError("password-error", "Password is required");
    isValid = false;
  } else if (password.length < 6) {
    showError("password-error", "Password must be at least 6 characters");
    isValid = false;
  }

  // Confirm password validation
  if (!confirmPassword) {
    showError("confirm-password-error", "Please confirm your password");
    isValid = false;
  } else if (password !== confirmPassword) {
    showError("confirm-password-error", "Passwords do not match");
    isValid = false;
  }

  if (!isValid) {
    console.log("Validation failed, aborting...");
    return; // Stop if validation fails
  }

  // Start loading state
  setLoadingState(button, true);

  try {
    console.log("Sending OTP request with:", { email, username, phone });
    
    const response = await apiRequest("/send-otp", {
      method: "POST",
      body: JSON.stringify({ 
        email, 
        username,
        phone // Make sure phone is included
      }),
    });

    if (response.success) {
      verificationSent = true;

      // Enable form elements
      document.getElementById("verification-code").disabled = false;
      document.getElementById("submitBtn").disabled = false;

      // Update button
      button.textContent = "Resend";
      button.style.background = "linear-gradient(135deg, #27ae60, #2ecc71)";

      // Success message
      showSuccess("verification-success", `Verification code sent to ${email}`);

      // Optional: Show alert
      Swal.fire({
        title: "OTP Terkirim",
        text: `Kode verifikasi untuk ${username} telah dikirim ke ${email}`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "Lanjutkan",
        allowOutsideClick: true,
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    
    // Handle specific phone-related errors
    if (error.message.toLowerCase().includes("phone")) {
      showError("phone-error", error.message);
    } else {
      showError(
        "verification-error",
        error.message || "Failed to send verification"
      );
    }
  } finally {
    setLoadingState(button, false, originalText);
  }
}

// Phone validation helper (add this if not already present)
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    console.log(`Phone validation failed for: ${phone}`);
    return false;
  }
  return true;
}

// Sign up handler
async function handleSignUp(e) {
  e.preventDefault();

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const verificationCode = document
    .getElementById("verification-code")
    .value.trim();
  const submitBtn = document.getElementById("submitBtn");

  console.log({
    username,
    email,
    phone,
    password,
    confirmPassword,
    verificationCode,
  });

  clearMessages();

  // Validate form
  if (
    !validateForm(
      username,
      email,
      phone,
      password,
      confirmPassword,
      verificationCode
    )
  )
    return;

  setLoadingState(submitBtn, true);

  try {
    const response = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        phone,
        password,
        confirmPassword,
        verificationCode,
      }),
    });

    if (response.success) {
      // Store token and user data
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      Swal.fire({
        title: "Pendaftaran berhasil!",
        text: `Selamat datang, ${response.user.username}!`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "Lanjutkan Login",
        allowOutsideClick: true,
      });
      setTimeout(() => {
        switchToSignIn();
      }, 2000);
    }
  } catch (error) {
    handleSignUpError(error);
  } finally {
    setLoadingState(submitBtn, false, "Submit");
  }
}

function validateForm(
  username,
  email,
  phone,
  password,
  confirmPassword,
  verificationCode
) {
  let isValid = true;

  if (username.length < 3) {
    showError("username-error", "Username minimal 3 karakter");
    isValid = false;
  }

  if (!isValidEmail(email)) {
    showError("email-error", "Format email tidak valid");
    isValid = false;
  }

  if (!isValidPhone(phone)) {
    showError("phone-error", "Format nomor telepon tidak valid");
    isValid = false;
  }

  if (password.length < 6) {
    showError("password-error", "Password minimal 6 karakter");
    isValid = false;
  }

  if (password !== confirmPassword) {
    showError("confirm-password-error", "Password tidak cocok");
    isValid = false;
  }

  if (!verificationSent) {
    showError(
      "verification-error",
      "Harap kirim kode verifikasi terlebih dahulu"
    );
    isValid = false;
  }

  if (!verificationCode) {
    showError("verification-error", "Harap masukkan kode verifikasi");
    isValid = false;
  }

  return isValid;
}

function handleSignUpError(error) {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("phone")) {
    showError("phone-error", error.message);
  } else if (errorMessage.includes("verification code")) {
    showError("verification-error", error.message);
  } else if (
    errorMessage.includes("email") ||
    errorMessage.includes("username")
  ) {
    showError("email-error", error.message);
  } else {
    showError("verification-error", error.message || "Pendaftaran gagal");
  }
}

// Sign in handler
async function handleSignIn(e) {
  e.preventDefault();

  const username = document.getElementById("signin-username").value.trim();
  const password = document.getElementById("signin-password").value;
  const submitBtn = this.querySelector('button[type="submit"]');

  clearMessages();

  if (!username || !password) {
    // alert("Harap isi username dan password");
    Swal.fire({
      title: "Harap isi username dan password",
      icon: "warning",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: "Lanjutkan",
      allowOutsideClick: true,
    });
    return;
  }

  setLoadingState(submitBtn, true);

  try {
    const response = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response.success) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      Swal.fire({
        title: "Login Berhasil!",
        text: `Selamat datang kembali, ${response.user.username}!`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "Halaman Utama",
        allowOutsideClick: true,
      });
      setTimeout(() => {
        window.location.href = "../";
      }, 2000);
    }
  } catch (error) {
    // alert(error.message || "Login gagal. Periksa username dan password Anda.");
    Swal.fire({
      title: "Login Gagal",
      text: error.message || "Periksa username dan password Anda.",
      icon: "error",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: "Lanjutkan",
      allowOutsideClick: true,
    });
  } finally {
    setLoadingState(submitBtn, false, "Masuk");
  }
}

// Real-time validation functions
function validateConfirmPassword() {
  const password = document.getElementById("signup-password").value;
  const confirmPassword = this.value;

  if (confirmPassword && password !== confirmPassword) {
    showError("confirm-password-error", "Password tidak cocok");
  } else {
    hideError("confirm-password-error");
  }
}

function validateEmail() {
  const email = this.value.trim();
  if (email && !isValidEmail(email)) {
    showError("email-error", "Format email tidak valid");
  } else {
    hideError("email-error");
  }
}

function validatePhone() {
  const phoneInput = document.getElementById("signup-phone");
  const phone = phoneInput.value.trim();
  const errorElement = document.getElementById("phone-error");

  console.log("Validating phone:", phone); // Debug line

  if (!phone) {
    errorElement.textContent = "Nomor telepon diperlukan";
    errorElement.style.display = "block";
    return false;
  }

  if (!/^[0-9]{10,15}$/.test(phone)) {
    errorElement.textContent = "Hanya angka, 10-15 digit";
    errorElement.style.display = "block";
    return false;
  }

  errorElement.style.display = "none";
  return true;
}

function validateUsername() {
  const username = this.value.trim();
  if (username && username.length < 3) {
    showError("username-error", "Username minimal 3 karakter");
  } else {
    hideError("username-error");
  }
}

function validatePassword() {
  const password = this.value;
  if (password && password.length < 6) {
    showError("password-error", "Password minimal 6 karakter");
  } else {
    hideError("password-error");
  }
}

// Network status handlers
function handleOnlineStatus() {
  console.log("Connection restored");
}

function handleOfflineStatus() {
  // alert("Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi.");
  Swal.fire({
    title: "Koneksi Internet Terputus",
    text: "Beberapa fitur mungkin tidak berfungsi.",
    icon: "error",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: true,
    confirmButtonText: "Lanjutkan",
    allowOutsideClick: true,
  });
}

// Logout function
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.reload();
}
