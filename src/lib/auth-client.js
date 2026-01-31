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
  try {
    const res = await fetch(`${API_BASE}/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    // Try to parse JSON response
    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      console.error("Failed to parse response JSON:", jsonErr, "Response status:", res.status);
      throw new Error(`Server returned invalid response (${res.status})`);
    }

    if (!res.ok) {
      // Handle specific errors
      if (res.status === 403) {
        throw new Error(data.message || "Account is banned");
      }
      if (res.status === 401) {
        throw new Error(data.error || "Invalid email or password");
      }
      throw new Error(data.message || data.error || "Login failed");
    }

    return data;
  } catch (err) {
    // Check if it's a network error (TypeError means network issue)
    if (err instanceof TypeError) {
      console.error("Network error - Failed to fetch:", err);
      throw new Error("Network error. Please check your connection.");
    }
    // If it's already our custom error, rethrow it
    if (err.message && (err.message.includes("Account is banned") || err.message.includes("Invalid email"))) {
      throw err;
    }
    // Other errors
    console.error("Login error:", err);
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
  try {
    const res = await fetch(`${API_BASE}/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name, role }),
    });

    // Try to parse JSON response
    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      console.error("Failed to parse response JSON:", jsonErr, "Response status:", res.status);
      throw new Error(`Server returned invalid response (${res.status})`);
    }

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error(
          data.message || "Email already exists or invalid data"
        );
      }
      throw new Error(data.message || data.error || "Registration failed");
    }

    return data;
  } catch (err) {
    // Check if it's a network error
    if (err instanceof TypeError) {
      console.error("Network error - Failed to fetch:", err);
      throw new Error("Network error. Please check your connection.");
    }
    // If it's already our custom error, rethrow it
    if (err.message && err.message.includes("Email already exists")) {
      throw err;
    }
    // Other errors
    console.error("Registration error:", err);
    throw err;
  }
}

/**
 * Get current session
 * @returns {Promise<{user: {id, email, name, role, emailVerified, isBanned}}>}
 */
export async function getSession() {
  try {
    const res = await fetch(`${API_BASE}/session`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    const res = await fetch(`${API_BASE}/sign-out`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }
  } catch (err) {
    throw new Error("Failed to logout. Please try again.");
  }
}

/**
 * Get redirect path based on user role
 * @param {string} role - User role (STUDENT, TUTOR, ADMIN)
 * @returns {string} redirect path
 */
export function getRedirectPath(role) {
  switch (role) {
    case "STUDENT":
      return "/dashboard";
    case "TUTOR":
      return "/tutor/dashboard";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}
