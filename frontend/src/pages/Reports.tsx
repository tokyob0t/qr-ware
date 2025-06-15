import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import * as XLSX from "xlsx";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line
} from "recharts";

export default function Reports() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Simulación de movimientos mensuales
  const [monthlyMovements] = useState([
    { month: "Ene", movimientos: 10 },
    { month: "Feb", movimientos: 16 },
    { month: "Mar", movimientos: 8 },
    { month: "Abr", movimientos: 22 },
    { month: "May", movimientos: 12 },
    { month: "Jun", movimientos: 18 },
  ]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products.map(prod => ({
      SKU: prod.sku,
      Nombre: prod.name,
      Stock: prod.stock,
      Precio: prod.price
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, "productos.xlsx");
  };

  return (
    <div className="page-container">
      <h1>Reportes</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="reports-dashboard">

        {/* Gráfico de barras: Stock por Producto */}
        <div className="chart-mock">
          <h3>Stock por Producto</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={false} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de líneas: Movimientos Mensuales (simulado) */}
        <div className="chart-mock">
          <h3>Movimientos Mensuales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyMovements}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="movimientos" stroke="#27ae60" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="export-options" style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
          <button onClick={exportToExcel} style={{ fontWeight: "bold" }}>
            Exportar Stock a Excel
          </button>
          <button
            onClick={() => alert("Exportar movimientos no implementado aún")}
            style={{ fontWeight: "bold", background: "#bdc3c7", cursor: "not-allowed" }}
            disabled
          >
            Exportar Movimientos a Excel
          </button>
        </div>
      </div>
    </div>
  );
}
