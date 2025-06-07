const Login = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Iniciar sesión</h1>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input type="text" id="username" placeholder="Ingrese su usuario" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" placeholder="Ingrese su contraseña" />
        </div>
        <button className="login-btn">Iniciar sesión</button>
        <p className="register-link">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;