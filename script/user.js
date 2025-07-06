// =======================================================
// Global Constants and Initial State
// =======================================================

// Mengambil data pengguna dan token autentikasi dari localStorage
let user = JSON.parse(localStorage.getItem("user"));
let token = localStorage.getItem("authToken");
let lastImageUrl = null;

// =======================================================
// DOM Element References
// =======================================================

const elements = {
  btnEdit: document.getElementById("btnEdit"),
  editForm: document.getElementById("editForm"),
  editAvatarInput: document.getElementById("editAvatar"),
  greetingDisplay: document.getElementById("greeting"),
  displayName: document.getElementById("displayName"),
  displayEmail: document.getElementById("displayEmail"),
  usernameDisplay: document.getElementById("username"),
  emailDisplay: document.getElementById("email"),
  fullNameDisplay: document.getElementById("fullName"),
  birthPlaceDisplay: document.getElementById("birthPlace"),
  birthDateDisplay: document.getElementById("birthDate"),
  avatarDisplay: document.getElementById("avatar"),
  editFullNameInput: document.getElementById("editFullName"),
  editBirthPlaceInput: document.getElementById("editBirthPlace"),
  editBirthDateInput: document.getElementById("editBirthDate"),
  filePreview: document.getElementById("filePreview"),
  fileLabel: document.getElementById("fileLabel"),
  debugInfo: document.getElementById("debugInfo"),
  profileView: document.getElementById("profileView"),
};

// =======================================================
// Event Listeners
// =======================================================

document.addEventListener("DOMContentLoaded", initializeProfilePage);

/**
 * Inisialisasi halaman profil dengan verifikasi ringan
 */
function initializeProfilePage() {
  // Verifikasi sederhana - hanya cek apakah ada data user dan token
  if (!user || !token) {
    showAlert("warning", "Silakan login terlebih dahulu");
    setTimeout(() => {
      window.location.href = "../";
    }, 2000);
    return;
  }

  // Langsung load profil tanpa validasi kompleks
  loadProfile();

  // Setup event listeners
  elements.btnEdit?.addEventListener("click", () => toggleEditMode(true));
  elements.editForm?.addEventListener("submit", updateProfile);
  elements.editAvatarInput?.addEventListener("change", handleFileSelect);
  document.getElementById("btnLogout")?.addEventListener("click", logout);
  document
    .getElementById("btnCancelEdit")
    ?.addEventListener("click", cancelEdit);
}

// =======================================================
// Authentication Functions (Simplified)
// =======================================================

/**
 * Logout sederhana tanpa validasi kompleks
 */
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  showAlert("info", "Anda telah logout");
  setTimeout(() => {
    window.location.href = "../";
  }, 1500);
}

/**
 * Redirect ke halaman utama
 */
function redirectToHome() {
  window.location.href = "../";
}

// =======================================================
// Utility Functions
// =======================================================

/**
 * Format tanggal untuk display (DD-MM-YYYY)
 */
function formatDateDisplay(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return dateString;
  }
}

/**
 * Format tanggal untuk input HTML (YYYY-MM-DD)
 */
function formatDateForInput(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
}

/**
 * Build URL gambar yang fleksibel
 */
function buildImageUrl(imagePath) {
  if (!imagePath) return null;

  // Handle data URL langsung (jika ada)
  if (imagePath.startsWith("data:")) return imagePath;

  // Kalau sudah full URL, pastikan protokolnya sesuai dengan frontend
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    const frontendProtocol = window.location.protocol;
    return imagePath.replace(/^https?:/, frontendProtocol);
  }

  // Tambahin API_BASE_URL untuk relative path
  const slashPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${slashPath}`;
}

/**
 * Update debug info
 */
function updateDebugInfo(message) {
  if (elements.debugInfo) {
    const timestamp = new Date().toLocaleTimeString();
    elements.debugInfo.innerHTML += `[${timestamp}] ${message}<br>`;
  }
}

/**
 * Show alert notification
 */
function showAlert(type, message) {
  let iconType;
  switch (type) {
    case "success":
      iconType = "success";
      break;
    case "error":
      iconType = "error";
      break;
    case "warning":
      iconType = "warning";
      break;
    case "info":
      iconType = "info";
      break;
    default:
      iconType = "info";
  }

  Swal.fire({
    icon: iconType,
    title: message,
    showConfirmButton: false,
    timer: 2000,
    toast: true,
    position: "top-end",
  });
}

// =======================================================
// Profile Management Functions
// =======================================================

/**
 * Load profil dengan error handling yang tidak terlalu ketat
 */
async function loadProfile() {
  try {
    // Siapin headers dasar
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Panggil endpoint profile
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: headers,
    });

    console.log("Full user object:", user);
    console.log("Image path after fetch:", user.profile_image);

    // Kalau HTTP response gagal (misal 401, 500)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    // Coba parse ke JSON, fallback ke text kalau gagal
    let data;
    const rawText = await res.text();
    console.log("RAW Response:", rawText);

    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ Gagal parse JSON:", err.message);
      throw new Error("Response bukan JSON valid");
    }

    // Cek apakah ada user di dalam response JSON
    if (data.user) {
      // Simpan user global & localStorage
      user = data.user;
      localStorage.setItem("user", JSON.stringify(user));

      // Update UI
      updateUIElements();
      console.log(
        "DEBUG: Calling updateProfileImage with:",
        user.profile_image
      );
      await updateProfileImage(user.profile_image);
      updateDebugInfo("✅ Profile loaded successfully");
    } else {
      throw new Error("No user data in response");
    }
  } catch (error) {
    console.error("Load profile error:", error);
    updateDebugInfo(`❌ Load profile error: ${error.message}`);

    // Fallback pakai localStorage
    if (user) {
      updateUIElements();
      updateDebugInfo("⚠️ Using cached profile data");
      showAlert("warning", "Menggunakan data offline");
    } else {
      showAlert("error", "Gagal memuat profil, silakan login kembali");
      setTimeout(() => {
        logout();
      }, 2000);
    }
  }
}

/**
 * Update UI elements dengan data user
 */
function updateUIElements() {
  if (!user) return;

  elements.greetingDisplay.textContent = `Selamat datang, ${
    user.username || "User"
  }`;
  elements.displayName.textContent = user.full_name || user.username || "User";
  elements.displayEmail.textContent = user.email || "-";
  elements.usernameDisplay.textContent = user.username || "-";
  elements.emailDisplay.textContent = user.email || "-";
  elements.fullNameDisplay.textContent = user.full_name || "-";
  elements.birthPlaceDisplay.textContent = user.birth_place || "-";
  elements.birthDateDisplay.textContent = formatDateDisplay(user.birth_date);
}

/**
 * Update profile image dengan fallback sederhana
 */
async function updateProfileImage(imagePath) {
  elements.avatarDisplay.innerHTML = '<div style="font-size:12px;">📷</div>';
  updateDebugInfo(`🔄 Loading image: ${imagePath || "No image path"}`);

  if (!imagePath) {
    elements.avatarDisplay.innerHTML = "👤";
    updateDebugInfo("ℹ️ No profile image set");
    return;
  }

  // FIX: Gunakan imagePath dari parameter, bukan langsung dari user.profile_image
  const imageUrl = buildImageUrl(imagePath);
  console.log("Final image URL:", imageUrl);

  if (imageUrl) {
    const img = new Image();
    img.src = imageUrl;
    img.alt = "Profile";
    img.style.width = "120px";
    img.style.height = "120px";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";
    img.style.display = "block";

    img.onload = function () {
      elements.avatarDisplay.innerHTML = ""; // Kosongkan container
      elements.avatarDisplay.appendChild(img); // Tambahkan gambar
      updateDebugInfo(`✅ Image loaded: ${imageUrl}`);
    };

    img.onerror = function () {
      elements.avatarDisplay.innerHTML = "👤";
      updateDebugInfo(`❌ Image load failed: ${imageUrl}`);
    };
  } else {
    elements.avatarDisplay.innerHTML = "👤";
    updateDebugInfo(`❌ Invalid image path: ${imagePath}`);
  }
}

/**
 * Toggle edit mode
 */
function toggleEditMode(show) {
  elements.editForm.style.display = show ? "block" : "none";
  elements.profileView.style.display = show ? "none" : "block";

  if (show && user) {
    elements.editFullNameInput.value = user.full_name || "";
    elements.editBirthPlaceInput.value = user.birth_place || "";
    elements.editBirthDateInput.value = formatDateForInput(user.birth_date);

    // Reset file input
    elements.editAvatarInput.value = "";
    elements.filePreview.style.display = "none";
    elements.filePreview.src = "";
    elements.fileLabel.textContent =
      "Pilih file gambar atau drag & drop di sini";
  }
}

/**
 * Cancel edit mode
 */
function cancelEdit() {
  toggleEditMode(false);
}

/**
 * Handle file selection dengan validasi ringan
 */
function handleFileSelect(e) {
  const file = e.target.files[0];

  if (file) {
    // Validasi sederhana
    if (!file.type.startsWith("image/")) {
      showAlert("error", "File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB - lebih longgar
      showAlert("error", "Ukuran file maksimal 10MB.");
      e.target.value = "";
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function (event) {
      elements.filePreview.src = event.target.result;
      elements.filePreview.style.display = "block";
      elements.fileLabel.textContent = file.name;
    };
    reader.readAsDataURL(file);
  } else {
    elements.filePreview.style.display = "none";
    elements.filePreview.src = "";
    elements.fileLabel.textContent =
      "Pilih file gambar atau drag & drop di sini";
  }
}

/**
 * Check for profile changes
 */
function hasProfileChanges(
  currentUser,
  newFullName,
  newBirthPlace,
  newBirthDate,
  newAvatarFile
) {
  const isFullNameChanged =
    (newFullName || "").trim() !== (currentUser.full_name || "").trim();
  const isBirthPlaceChanged =
    (newBirthPlace || "").trim() !== (currentUser.birth_place || "").trim();
  const currentBirthDateForComparison = formatDateForInput(
    currentUser.birth_date
  );
  const isBirthDateChanged = newBirthDate !== currentBirthDateForComparison;
  const isAvatarChanged = newAvatarFile !== undefined && newAvatarFile !== null;

  return (
    isFullNameChanged ||
    isBirthPlaceChanged ||
    isBirthDateChanged ||
    isAvatarChanged
  );
}

/**
 * Update profile dengan error handling yang lebih toleran
 */
async function updateProfile(e) {
  e.preventDefault();

  const formData = new FormData();
  const fullName = elements.editFullNameInput.value.trim();
  const birthPlace = elements.editBirthPlaceInput.value.trim();
  const birthDate = elements.editBirthDateInput.value;
  const avatarFile = elements.editAvatarInput.files[0];

  // Check for changes
  if (!hasProfileChanges(user, fullName, birthPlace, birthDate, avatarFile)) {
    showAlert("info", "Tidak ada perubahan untuk disimpan.");
    return;
  }

  // Append data to form
  if (fullName) formData.append("full_name", fullName);
  if (birthPlace) formData.append("birth_place", birthPlace);
  if (birthDate) formData.append("birth_date", birthDate);
  if (avatarFile) formData.append("profile_image", avatarFile);

  try {
    // Gunakan headers yang sederhana untuk FormData
    const headers = {
      Authorization: `Bearer ${token}`,
      // Jangan set Content-Type untuk FormData, biarkan browser yang handle
    };

    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: headers,
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      showAlert("success", "Profil berhasil diperbarui!");

      // Update user data
      if (data.user) {
        user = data.user;
        localStorage.setItem("user", JSON.stringify(user));
      }

      toggleEditMode(false);

      // Reload profile after short delay
      setTimeout(() => {
        loadProfile();
      }, 500);

      updateDebugInfo(`✅ Profile updated successfully`);
    } else {
      showAlert("error", data.message || "Gagal memperbarui profil.");
      updateDebugInfo(`❌ Update failed: ${data.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Update error:", error);
    showAlert("error", "Terjadi kesalahan saat update.");
    updateDebugInfo(`❌ Update error: ${error.message}`);
  }
}
