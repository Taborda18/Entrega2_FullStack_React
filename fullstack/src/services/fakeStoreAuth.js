import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';
const LOGGED_IN_USER_KEY = 'loggedInUser';
const USER_TOKEN_KEY = 'userToken';

// Normalize user for app
const normalizeUser = (user) => ({
  uid: String(user.id || user.username),
  displayName: user.username,
  name: user.username,
  email: user.email,
  emailVerified: true,
  phone: user.phone || '',
  address: user.address ? `${user.address.street || ''} ${user.address.city || ''}` : '',
});

/**
 * Login with FakeStore API
 * Note: FakeStore API doesn't return a user object on auth endpoint,
 * so we fetch user data separately after successful auth
 */
export const loginWithFakeStore = async (username, password) => {
  try {
    // Step 1: Authenticate with FakeStore
    const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });

    if (!authResponse.data.token) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // Step 2: Fetch all users to find the one we just logged in
    const usersResponse = await axios.get(`${API_BASE_URL}/users`);
    const user = usersResponse.data.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Step 3: Save token and user data
    const normalizedUser = normalizeUser(user);
    localStorage.setItem(USER_TOKEN_KEY, authResponse.data.token);
    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(normalizedUser));

    // Notify auth changes
    window.dispatchEvent(new Event('fakestore-auth-change'));

    return {
      success: true,
      user: normalizedUser,
      token: authResponse.data.token,
    };
  } catch (error) {
    console.error('Login error:', error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
    };
  }
};

/**
 * Logout from FakeStore session
 */
export const logoutFromFakeStore = async () => {
  try {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    window.dispatchEvent(new Event('fakestore-auth-change'));
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error.message);
    return { success: false, error: 'Logout failed' };
  }
};

/**
 * Get current FakeStore user
 */
export const getCurrentFakeStoreUser = () => {
  try {
    return JSON.parse(localStorage.getItem(LOGGED_IN_USER_KEY) || 'null');
  } catch {
    return null;
  }
};

/**
 * Get stored token
 */
export const getFakeStoreToken = () => {
  return localStorage.getItem(USER_TOKEN_KEY);
};

/**
 * Subscribe to FakeStore auth changes
 */
export const subscribeToFakeStoreAuthChanges = (callback) => {
  const handler = () => callback(getCurrentFakeStoreUser());
  handler();
  window.addEventListener('fakestore-auth-change', handler);

  return () => {
    window.removeEventListener('fakestore-auth-change', handler);
  };
};

export default {
  loginWithFakeStore,
  logoutFromFakeStore,
  getCurrentFakeStoreUser,
  getFakeStoreToken,
  subscribeToFakeStoreAuthChanges,
};
