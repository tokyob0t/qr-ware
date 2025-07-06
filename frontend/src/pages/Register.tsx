import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      await register(form.name, form.email, form.password);
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      let msg = "Error al registrar";
      try {
        const json = JSON.parse(err.message.split("-")[1] || "");
        if (Array.isArray(json.errors)) {
          msg = json.errors.map((e: any) => e.msg || e).join(", ");
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
    <div className="register-container">
      {/* Banner de éxito */}
      {showBanner && (
        <div className="banner-success">
          ¡Registro exitoso! Ahora puedes iniciar sesión.
        </div>
      )}
      <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
        <h1>Registro</h1>
        <div className="form-group">
          <label htmlFor="register-name">Nombre</label>
          <input
            id="register-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
        {feedback && (
          <div className="register-link" style={{ color: "red" }}>
            {feedback}
          </div>
        )}
        <div className="register-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </form>
    </div>
  );
}
