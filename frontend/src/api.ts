const API_URL = "http://localhost:8000";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener productos: ${response.status} - ${errorText}`);
  }

  const json = await response.json();
  return json.data;  // <- importante, devolver solo el arreglo
}


export async function addProduct(product: { name: string; sku: string; stock: number }) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    credentials: "include",   // envía cookies automáticamente
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al añadir producto: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Login y register se mantienen igual (sin token ni credentials)
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",   // también necesario para recibir cookie
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
}
