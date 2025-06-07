const Register = () => {
  return (
    <div className="page-container">
      <h1>Register Page</h1>
      <div className="mock-form">
        <input type="text" placeholder="Nombre completo" />
        <input type="email" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />
        <input type="password" placeholder="Confirmar contraseña" />
        <button>Registrarse</button>
      </div>
    </div>
  )
}

export default Register