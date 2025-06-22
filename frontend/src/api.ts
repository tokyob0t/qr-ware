import { ENDPOINTS } from "./endpoints";

export async function login(email: string, password: string) {
  const res = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${res.status} - ${errText}`);
  }
  return res.json();
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${res.status} - ${errText}`);
  }
  return res.json();
}

export async function logout() {
  const res = await fetch(ENDPOINTS.LOGOUT, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

export async function getProducts() {
  const response = await fetch(ENDPOINTS.PRODUCTS, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener productos: ${response.status} - ${errorText}`);
  }
  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
}


export async function addProduct(product: { name: string; sku: string; stock: number; price: number }) {
  const response = await fetch(ENDPOINTS.PRODUCTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al añadir producto: ${response.status} - ${errorText}`);
  }
  return response.json();
}

export async function getProductBySKU(sku: string) {
  const response = await fetch(ENDPOINTS.PRODUCT_BY_SKU(sku), {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Producto no encontrado");
  const json = await response.json();
  return json.data ?? json;
}

export async function getSession() {
  const res = await fetch(ENDPOINTS.ME, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) return null;
  const body = await res.json();
  return body?.data || null;
}