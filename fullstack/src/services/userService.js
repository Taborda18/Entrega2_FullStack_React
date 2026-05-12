import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

// Normalize user response to match app model
const normalizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  password: user.password, // Note: API returns password for demo purposes
  name: user.name || user.username,
  phone: user.phone || '',
  address: user.address
    ? `${user.address.street || ''} ${user.address.city || ''}`.trim()
    : '',
  uid: String(user.id),
  displayName: user.username,
  emailVerified: true,
});

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return {
      success: true,
      data: response.data.map(normalizeUser),
    };
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return {
      success: false,
      error: 'Failed to fetch users',
      data: [],
    };
  }
};

// Get a single user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return {
      success: true,
      data: normalizeUser(response.data),
    };
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error.message);
    return {
      success: false,
      error: `Failed to fetch user ${userId}`,
      data: null,
    };
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.name || userData.username,
      phone: userData.phone || '',
      address: userData.address || {},
    };

    const response = await axios.post(`${API_BASE_URL}/users`, payload);
    return {
      success: true,
      data: normalizeUser(response.data),
      message: 'User created successfully',
    };
  } catch (error) {
    console.error('Error creating user:', error.message);
    return {
      success: false,
      error: 'Failed to create user',
      data: null,
    };
  }
};

// Update a user
export const updateUser = async (userId, userData) => {
  try {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.name || userData.username,
      phone: userData.phone || '',
      address: userData.address || {},
    };

    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, payload);
    return {
      success: true,
      data: normalizeUser(response.data),
      message: 'User updated successfully',
    };
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error.message);
    return {
      success: false,
      error: 'Failed to update user',
      data: null,
    };
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
    return {
      success: true,
      message: 'User deleted successfully',
      data: response.data,
    };
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error.message);
    return {
      success: false,
      error: 'Failed to delete user',
    };
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  normalizeUser,
};
