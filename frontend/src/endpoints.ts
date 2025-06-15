export const API_BASE_URL = "http://localhost:8000";

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  LOGOUT: `${API_BASE_URL}/logout`,
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_SKU: (sku: string) => `${API_BASE_URL}/products/${sku}`,
};
