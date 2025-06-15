import React, { useEffect, useState } from "react";
import { getProducts, addProduct } from "../api";

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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilterAndSort();
  }, [products, filterText, orderBy, orderDir]);

  const fetchProducts = () => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
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

    addProduct(newProduct)
      .then(() => {
        setMessage("Producto agregado exitosamente");
        setNewProduct({ name: "", sku: "", stock: 0, price: 0 });
        fetchProducts();
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => setError(err.message));
  };

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
        </div>
        {filteredProducts.map((prod) => (
          <div className="table-row" key={prod.id || prod.sku}>
            <span>{prod.sku}</span>
            <span>{prod.name}</span>
            <span>{prod.stock}</span>
            <span>{prod.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
