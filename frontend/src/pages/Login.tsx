import React, { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      navigate("/products");
    } catch (err: any) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Iniciar sesión</h1>
        <div className="form-group">
          <label>Correo</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-btn" type="submit">
          Iniciar sesión
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="login-link">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </div>
      </form>
    </div>
  );
}
