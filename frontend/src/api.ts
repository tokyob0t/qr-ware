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

export async function updateProduct(sku: string, data: any) {
  const payload: any = {};
  if (typeof data.name === "string") payload.name = data.name;
  if (typeof data.stock === "number") payload.stock = data.stock;
  if (typeof data.price === "number") payload.price = data.price;

  const res = await fetch(ENDPOINTS.PRODUCT_BY_SKU(sku), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
}


export async function deleteProduct(sku: string) {
  const res = await fetch(ENDPOINTS.PRODUCT_BY_SKU(sku), {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
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

export async function getMovements() {
  const res = await fetch(ENDPOINTS.MOVEMENTS, { credentials: "include" });
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const json = await res.json();

    return json.data || [];
  } else {
    throw new Error("Respuesta de movimientos no es JSON");
  }
}

export async function addMovement(movement: {
  sku: string;
  type: string;
  quantity: number;
  user_email: string;
  note?: string;
}) {
  const res = await fetch(ENDPOINTS.MOVEMENTS, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movement),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error al registrar movimiento:", res.status, errorText);
    throw new Error(`Error al registrar movimiento: ${errorText}`);
  }
  return res.json();
}

