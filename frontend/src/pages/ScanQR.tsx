import React, { useRef, useEffect, useState } from "react";
import { getProductBySKU } from "../api";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanQR() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);
  const scanner = useRef<Html5Qrcode | null>(null);
  const lastScanned = useRef<string>("");

  const handleScan = async (sku: string) => {
    if (sku === lastScanned.current) return;
    lastScanned.current = sku;
    setScanResult(sku);
    setError("");
    setProduct(null);
    try {
      const prod = await getProductBySKU(sku);
      setProduct(prod);
    } catch {
      setProduct(null);
      setError("Producto no encontrado");
    }
    setTimeout(() => { lastScanned.current = ""; }, 1000);
  };

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      if (scanner.current) {
        try { scanner.current.clear(); } catch {}
      }
      scanner.current = new Html5Qrcode(qrRef.current.id);
      scanner.current
        .start(
          { facingMode: "environment" },
          { fps: 10 },
          (decodedText) => {
            if (decodedText) handleScan(decodedText);
          },
          () => {}
        )
        .catch(() => setError("No se pudo acceder a la cámara."));
    }
    return () => {
      try { scanner.current?.stop(); } catch {}
      try { scanner.current?.clear(); } catch {}
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page-container">
      <h1>Escanear QR de Producto</h1>
      <div
        className="scanner-area"
        style={{
          margin: "0 auto 1rem auto",
          width: 340,
          height: 340,
          maxWidth: "100%",
          maxHeight: "100vw",
          position: "relative",
          background: "#eee",
          borderRadius: 8,
          border: "2px dashed #3498db",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          id="qr-reader"
          ref={qrRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        />
      </div>
      {scanResult && (
        <div style={{ color: "#888", marginBottom: "1rem" }}>
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      {product && (
        <div
          className="product-info"
          style={{
            marginTop: "2rem",
            background: "white",
            padding: "2rem",
            borderRadius: 8,
            textAlign: "left",
            maxWidth: 350,
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 2px 8px #0002",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Producto encontrado</h2>
          <div><strong>Nombre:</strong> {product.name}</div>
          <div><strong>SKU:</strong> {product.sku}</div>
          <div><strong>Stock:</strong> {product.stock}</div>
          <div><strong>Precio:</strong> {product.price}</div>
        </div>
      )}
    </div>
  );
}
