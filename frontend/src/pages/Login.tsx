import React, { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      await login(email, password);
      navigate("/products");
    } catch (err: any) {
      let msg = "Error al ingresar";
      try {
        const json = JSON.parse(err.message.split("-")[1] || "");
        if (Array.isArray(json.errors)) {
          msg = json.errors.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
        } else if (json.message) {
          msg = json.message;
        }
      } catch {
        if (err.message) msg = err.message;
      }
      setFeedback(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin} autoComplete="off">
        <h1>Iniciar sesión</h1>
        <div className="form-group">
          <label htmlFor="login-email">Correo</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setFeedback(null);
            }}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setFeedback(null);
            }}
            autoComplete="current-password"
            required
          />
        </div>
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
        {feedback && (
          <div className="login-link" style={{ color: "red" }}>
            {feedback}
          </div>
        )}
        <div className="login-link">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </div>
      </form>
    </div>
  );
}
