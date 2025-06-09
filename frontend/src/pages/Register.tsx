export default function Register() {
  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Crear cuenta</h1>
        <div className="form-group">
          <label htmlFor="fullname">Nombre completo</label>
          <input type="text" id="fullname" placeholder="Ingrese su nombre completo" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" placeholder="Ingrese su correo" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" placeholder="Cree una contraseña" />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <input type="password" id="confirm-password" placeholder="Confirme su contraseña" />
        </div>
        <button className="register-btn">Registrarse</button>
        <p className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}
