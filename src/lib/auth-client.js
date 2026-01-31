// src/lib/auth-client.js

// Use the Next.js API proxy instead of calling backend directly
const API_BASE = "/api/auth";

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: {id, email, name, role, emailVerified}, token?: string}>}
 */
export async function login(email, password) {
  console.log("[auth-client.js] ENTER login, email:", email);

  try {
    console.log("[auth-client.js] BEFORE API CALL - calling sign-in endpoint");

    const res = await fetch(`${API_BASE}/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    console.log("[auth-client.js] AFTER API CALL - response status:", res.status);

    // Try to parse JSON response
    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      console.error("[auth-client.js] Failed to parse response JSON:", jsonErr, "Response status:", res.status);
      throw new Error(`Server returned invalid response (${res.status})`);
    }

    if (!res.ok) {
      // Handle specific errors
      if (res.status === 403) {
        console.log("[auth-client.js] ERROR - User is banned");
        throw new Error(data.message || "Account is banned");
      }
      if (res.status === 401) {
        console.log("[auth-client.js] ERROR - Invalid credentials");
        throw new Error(data.error || "Invalid email or password");
      }
      console.log("[auth-client.js] ERROR - Login failed with status:", res.status);
      throw new Error(data.message || data.error || "Login failed");
    }

    console.log("[auth-client.js] EXIT login - success, user role:", data.user?.role);
    return data;
  } catch (err) {
    // Check if it's a network error (TypeError means network issue)
    if (err instanceof TypeError) {
      console.error("[auth-client.js] Network error - Failed to fetch:", err);
      throw new Error("Network error. Please check your connection.");
    }
    // If it's already our custom error, rethrow it
    if (err.message && (err.message.includes("Account is banned") || err.message.includes("Invalid email"))) {
      throw err;
    }
    // Other errors
    console.error("[auth-client.js] Login error:", err);
    throw err;
  }
}

/**
 * Register new user
 * @param {string} name - User full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (STUDENT or TUTOR)
 * @returns {Promise<{user: {id, email, name, role, emailVerified}}>}
 */
export async function register(name, email, password, role = "STUDENT") {
  console.log("[auth-client.js] ENTER register, email:", email, "role:", role);

  try {
    console.log("[auth-client.js] BEFORE API CALL - calling sign-up endpoint");

    const res = await fetch(`${API_BASE}/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name, role }),
    });

    console.log("[auth-client.js] AFTER API CALL - response status:", res.status);

    // Try to parse JSON response
    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      console.error("[auth-client.js] Failed to parse response JSON:", jsonErr, "Response status:", res.status);
      throw new Error(`Server returned invalid response (${res.status})`);
    }

    if (!res.ok) {
      if (res.status === 400) {
        console.log("[auth-client.js] ERROR - Bad request or email exists");
        throw new Error(
          data.message || "Email already exists or invalid data"
        );
      }
      console.log("[auth-client.js] ERROR - Registration failed with status:", res.status);
      throw new Error(data.message || data.error || "Registration failed");
    }

    console.log("[auth-client.js] EXIT register - success");
    return data;
  } catch (err) {
    // Check if it's a network error
    if (err instanceof TypeError) {
      console.error("[auth-client.js] Network error - Failed to fetch:", err);
      throw new Error("Network error. Please check your connection.");
    }
    // If it's already our custom error, rethrow it
    if (err.message && err.message.includes("Email already exists")) {
      throw err;
    }
    // Other errors
    console.error("[auth-client.js] Registration error:", err);
    throw err;
  }
}

/**
 * Get current session
 * @returns {Promise<{user: {id, email, name, role, emailVerified, isBanned}}>}
 */
export async function getSession() {
  console.log("[auth-client.js] ENTER getSession");

  try {
    console.log("[auth-client.js] BEFORE API CALL - fetching session");

    const res = await fetch(`${API_BASE}/get-session`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    console.log("[auth-client.js] AFTER API CALL - response status:", res.status);

    if (!res.ok) {
      console.log("[auth-client.js] getSession - not ok, returning null");
      return null;
    }

    const data = await res.json();
    console.log("[auth-client.js] EXIT getSession - success, user role:", data.user?.role);
    return data;
  } catch (err) {
    console.log("[auth-client.js] getSession - error:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export async function logout() {
  console.log("[auth-client.js] ENTER logout");

  try {
    console.log("[auth-client.js] BEFORE API CALL - calling sign-out endpoint");

    const res = await fetch(`${API_BASE}/sign-out`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    console.log("[auth-client.js] AFTER API CALL - response status:", res.status);

    if (!res.ok) {
      console.log("[auth-client.js] ERROR - logout failed with status:", res.status);
      throw new Error("Logout failed");
    }

    console.log("[auth-client.js] EXIT logout - success");
  } catch (err) {
    console.error("[auth-client.js] Logout error:", err);
    throw new Error("Failed to logout. Please try again.");
  }
}

/**
 * Get redirect path based on user role
 * @param {string} role - User role (STUDENT, TUTOR, ADMIN)
 * @returns {string} redirect path
 */
export function getRedirectPath(role) {
  console.log("[auth-client.js] ENTER getRedirectPath, role:", role);

  switch (role) {
    case "STUDENT":
      console.log("[auth-client.js] EXIT getRedirectPath - redirecting to home");
      return "/"; // Redirect to home page
    case "TUTOR":
      console.log("[auth-client.js] EXIT getRedirectPath - redirecting to tutor dashboard");
      return "/tutor/dashboard";
    case "ADMIN":
      console.log("[auth-client.js] EXIT getRedirectPath - redirecting to admin");
      return "/admin";
    default:
      console.log("[auth-client.js] EXIT getRedirectPath - unknown role, redirecting to home");
      return "/";
  }
}
