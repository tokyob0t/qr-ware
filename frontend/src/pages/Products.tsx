import React, { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addMovement,
  getSession
} from "../api";

type OrderBy = "name" | "sku" | "stock" | "price";
type OrderDir = "asc" | "desc";

export default function Products() {
  const skuRegex = /^SKU-[A-Z]{3}-\d{3}$/;

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [skuError, setSkuError] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", stock: 0, price: 0 });
  const [message, setMessage] = useState("");
  const [filterText, setFilterText] = useState("");
  const [orderBy, setOrderBy] = useState<OrderBy>("name");
  const [orderDir, setOrderDir] = useState<OrderDir>("asc");
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string; role?: string } | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Estado para edición
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<any>(null);

  useEffect(() => {
    getSession()
      .then(setUser)
      .finally(() => setUserLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilterAndSort();
  }, [products, filterText, orderBy, orderDir]);

  const fetchProducts = () => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message));
  };

  const applyFilterAndSort = () => {
    let temp = products.filter(
      (p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase()) ||
        p.sku.toLowerCase().includes(filterText.toLowerCase())
    );

    temp.sort((a, b) => {
      let valA = a[orderBy];
      let valB = b[orderBy];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return orderDir === "asc" ? -1 : 1;
      if (valA > valB) return orderDir === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(temp);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    if (name === "sku") {
      value = value.toUpperCase();
      if (skuError) setSkuError("");
    }
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "price" ? Number(value) : value,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(e.target.value as OrderBy);
  };

  const handleOrderDirChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderDir(e.target.value as OrderDir);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!skuRegex.test(newProduct.sku)) {
      setSkuError("SKU inválido. Debe tener formato: SKU-AAA-000");
      return;
    }

    setSkuError("");
    setError("");

    if (!user) {
      setError("No autenticado. Inicia sesión para agregar productos.");
      return;
    }

    addProduct(newProduct)
      .then(() => {
        addMovement({
          sku: newProduct.sku,
          type: "PRODUCT_CREATED",
          quantity: Number(newProduct.stock),
          user_email: user.email,
          note: "Creación de producto"
        });
        setMessage("Producto agregado exitosamente");
        setNewProduct({ name: "", sku: "", stock: 0, price: 0 });
        fetchProducts();
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => setError(err.message));
  };

  function startEdit(idx: number, prod: any) {
    setEditIndex(idx);
    setEditProduct({ ...prod });
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditProduct((prev: any) => ({
      ...prev,
      [name]: name === "stock" || name === "price" ? Number(value) : value,
    }));
  }

  function saveEdit(sku: string) {
    if (!user) {
      setError("No autenticado. Inicia sesión para editar productos.");
      return;
    }

    const oldProduct = products[editIndex!];
    const payload: any = {};

    if (
      typeof editProduct.name === "string" &&
      editProduct.name.trim() !== "" &&
      editProduct.name !== oldProduct.name
    ) {
      payload.name = editProduct.name;
    }

    if (
      typeof editProduct.stock === "number" &&
      editProduct.stock !== oldProduct.stock
    ) {
      payload.stock = editProduct.stock;
    }

    if (
      typeof editProduct.price === "number" &&
      editProduct.price !== oldProduct.price
    ) {
      payload.price = editProduct.price;
    }

    if (Object.keys(payload).length === 0) {
      setMessage("No hay cambios para actualizar.");
      setEditIndex(null);
      return;
    }

    // Convertir explícitamente a número para evitar errores raros
    const oldStock = Number(oldProduct.stock);
    const newStock = Number(editProduct.stock);

    const quantityChange = !isNaN(oldStock) && !isNaN(newStock)
      ? Math.abs(newStock - oldStock)
      : 0;

    updateProduct(sku, payload)
      .then(() => {
        if ("stock" in payload && quantityChange > 0) {
          addMovement({
            sku,
            type: newStock > oldStock ? "STOCK_ADDED" : "STOCK_REMOVED",
            quantity: quantityChange,
            user_email: user.email,
            note: "Ajuste de stock",
          });
        }
        setMessage("Producto actualizado");
        setEditIndex(null);
        fetchProducts();
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => setError(err.message));
  }

  function handleDelete(sku: string) {
    if (!user) {
      setError("No autenticado. Inicia sesión para eliminar productos.");
      return;
    }
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    const movimiento = {
      sku,
      type: "PRODUCT_DELETED",
      quantity: 0,
      user_email: user.email,
      note: "Eliminación de producto",
    };
    console.log("Movimiento a registrar en eliminación:", movimiento);

    deleteProduct(sku)
      .then(() => {
        addMovement(movimiento)
          .then(() => {
            setMessage("Producto eliminado");
            fetchProducts();
            setTimeout(() => setMessage(""), 3000);
          })
          .catch((err) => {
            console.error("Error registrando movimiento tras eliminación:", err);
            setError(err.message);
          });
      })
      .catch((err) => setError(err.message));
  }


  // Bloqueo UX mientras se carga o si no hay usuario
  if (userLoading) return <div>Cargando usuario...</div>;
  if (!user) return <div>No autenticado. Inicia sesión para gestionar productos.</div>;

  return (
    <div className="page-container">
      <h1>Productos</h1>

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      {message && <div style={{ color: "green", marginBottom: "1rem" }}>{message}</div>}

      <button
        onClick={() => setShowForm((show) => !show)}
        className={`toggle-form-btn ${showForm ? "active" : ""}`}
      >
        {showForm ? "Ocultar formulario de ingreso" : "Mostrar formulario de ingreso"}
      </button>

      {showForm && (
        <div className="product-form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre del producto</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={newProduct.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="sku">SKU</label>
            <input
              id="sku"
              type="text"
              name="sku"
              placeholder="SKU-AAA-000"
              value={newProduct.sku}
              onChange={handleChange}
              required
            />
            {skuError && <small>{skuError}</small>}

            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={handleChange}
              min={0}
              required
            />

            <label htmlFor="price">Precio</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Precio"
              value={newProduct.price}
              onChange={handleChange}
              min={0}
              step={0.01}
              required
            />

            <button type="submit">Agregar Producto</button>
          </form>
        </div>
      )}

      <div className="filter-order-container">
        <input
          type="text"
          placeholder="Filtrar por nombre o SKU"
          value={filterText}
          onChange={handleFilterChange}
        />

        <div>
          <label htmlFor="orderBy">Ordenar por:</label>
          <select id="orderBy" value={orderBy} onChange={handleOrderByChange}>
            <option value="name">Nombre</option>
            <option value="sku">SKU</option>
            <option value="stock">Stock</option>
            <option value="price">Precio</option>
          </select>
        </div>

        <div>
          <label htmlFor="orderDir">Dirección:</label>
          <select id="orderDir" value={orderDir} onChange={handleOrderDirChange}>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <div className="mock-table" style={{ marginTop: "1rem" }}>
        <div className="table-header">
          <span>SKU</span>
          <span>Nombre</span>
          <span>Stock</span>
          <span>Precio</span>
          <span>Acciones</span>
        </div>
        {filteredProducts.map((prod, idx) => (
          <div className="table-row" key={prod.id || prod.sku}>
            {editIndex === idx ? (
              <>
                <span>{prod.sku}</span>
                <input
                  value={editProduct.name}
                  name="name"
                  onChange={handleEditChange}
                />
                <input
                  value={editProduct.stock}
                  name="stock"
                  type="number"
                  onChange={handleEditChange}
                />
                <input
                  value={editProduct.price}
                  name="price"
                  type="number"
                  onChange={handleEditChange}
                />
                <button onClick={() => saveEdit(prod.sku)}>Guardar</button>
                <button onClick={() => setEditIndex(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <span>{prod.sku}</span>
                <span>{prod.name}</span>
                <span>{prod.stock}</span>
                <span>{prod.price}</span>
                <button onClick={() => startEdit(idx, prod)}>Editar</button>
                <button onClick={() => handleDelete(prod.sku)}>Eliminar</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
