import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

// Normalize cart response to match app model
const normalizeCart = (cart) => ({
  id: cart.id,
  userId: cart.userId,
  products: Array.isArray(cart.products)
    ? cart.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    : [],
  date: cart.date || new Date().toISOString(),
});

// Get all carts
export const getAllCarts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carts`);
    return {
      success: true,
      data: response.data.map(normalizeCart),
    };
  } catch (error) {
    console.error('Error fetching carts:', error.message);
    return {
      success: false,
      error: 'Failed to fetch carts',
      data: [],
    };
  }
};

// Get a single cart by ID
export const getCartById = async (cartId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carts/${cartId}`);
    return {
      success: true,
      data: normalizeCart(response.data),
    };
  } catch (error) {
    console.error(`Error fetching cart ${cartId}:`, error.message);
    return {
      success: false,
      error: `Failed to fetch cart ${cartId}`,
      data: null,
    };
  }
};

// Get carts for a specific user
export const getCartsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carts/user/${userId}`);
    return {
      success: true,
      data: Array.isArray(response.data)
        ? response.data.map(normalizeCart)
        : [normalizeCart(response.data)],
    };
  } catch (error) {
    console.error(`Error fetching carts for user ${userId}:`, error.message);
    return {
      success: false,
      error: `Failed to fetch carts for user ${userId}`,
      data: [],
    };
  }
};

// Create a new cart
export const createCart = async (cartData) => {
  try {
    const payload = {
      userId: cartData.userId,
      products: Array.isArray(cartData.products)
        ? cartData.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        : [],
    };

    const response = await axios.post(`${API_BASE_URL}/carts`, payload);
    return {
      success: true,
      data: normalizeCart(response.data),
      message: 'Cart created successfully',
    };
  } catch (error) {
    console.error('Error creating cart:', error.message);
    return {
      success: false,
      error: 'Failed to create cart',
      data: null,
    };
  }
};

// Update a cart
export const updateCart = async (cartId, cartData) => {
  try {
    const payload = {
      userId: cartData.userId,
      products: Array.isArray(cartData.products)
        ? cartData.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        : [],
    };

    const response = await axios.put(`${API_BASE_URL}/carts/${cartId}`, payload);
    return {
      success: true,
      data: normalizeCart(response.data),
      message: 'Cart updated successfully',
    };
  } catch (error) {
    console.error(`Error updating cart ${cartId}:`, error.message);
    return {
      success: false,
      error: 'Failed to update cart',
      data: null,
    };
  }
};

// Delete a cart
export const deleteCart = async (cartId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/carts/${cartId}`);
    return {
      success: true,
      message: 'Cart deleted successfully',
      data: response.data,
    };
  } catch (error) {
    console.error(`Error deleting cart ${cartId}:`, error.message);
    return {
      success: false,
      error: 'Failed to delete cart',
    };
  }
};

// Convert local cart to API format
export const convertCartToAPI = (cartItems, userId) => {
  return {
    userId,
    products: cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  };
};

export default {
  getAllCarts,
  getCartById,
  getCartsByUserId,
  createCart,
  updateCart,
  deleteCart,
  convertCartToAPI,
};
