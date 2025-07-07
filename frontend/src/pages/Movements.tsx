import { useEffect, useState } from "react";
import { getMovements } from "../api";

type Movement = {
  sku: string;
  type: string;
  quantity: number;
  timestamp: string;
  user_email: string;
  note?: string;
};

function tipoMovimiento(type: string) {
  switch (type) {
    case "STOCK_ADDED":
      return "Entrada de stock";
    case "STOCK_REMOVED":
      return "Salida de stock";
    case "PRODUCT_CREATED":
      return "Creación de producto";
    case "PRODUCT_DELETED":
      return "Eliminación de producto";
    default:
      return type;
  }
}

export default function Movements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMovements()
      .then(setMovements)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page-container">
      <h1>Movimientos</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="mock-table">
        <div className="table-header">
          <span>Producto</span>
          <span>Tipo</span>
          <span>Cantidad</span>
          <span>Fecha</span>
          <span>Usuario</span>
        </div>
        {movements.map((m, i) => (
          <div className="table-row" key={i}>
            <span>{m.sku}</span>
            <span>{tipoMovimiento(m.type)}</span>
            <span>{m.quantity}</span>
            <span>{new Date(m.timestamp).toLocaleString()}</span>
            <span>{m.user_email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
