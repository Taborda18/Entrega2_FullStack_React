import MOCK_PRODUCTS from "../mockdata/mock_products";
import axios from "axios";

const API_BASE_URL = "https://fakestoreapi.com";

const normalizeProduct = (product, source = "api") => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: Number(product.price),
  image: product.image,
  category: product.category ?? "General",
  rate: Number(product.rate ?? product.rating?.rate ?? 0),
  ratingCount: Number(product.ratingCount ?? product.rating?.count ?? 0),
  source,
});

const getFallbackProducts = () =>
  [...MOCK_PRODUCTS]
    .map((item) => normalizeProduct(item, "mock"))
    .sort((a, b) => Number(a.id) - Number(b.id));

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data
      .map((item) => normalizeProduct(item, "api"))
      .sort((a, b) => Number(a.id) - Number(b.id));
  } catch {
    return getFallbackProducts();
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return normalizeProduct(response.data, "api");
  } catch {
    const fallback = getFallbackProducts().find(
      (item) => Number(item.id) === Number(id),
    );
    return fallback ?? null;
  }
};
