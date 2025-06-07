const Movements = () => {
  return (
    <div className="page-container">
      <h1>Movements Page</h1>
      <div className="mock-table">
        <div className="table-header">
          <span>Producto</span>
          <span>Tipo</span>
          <span>Cantidad</span>
          <span>Fecha</span>
          <span>Usuario</span>
        </div>
        <div className="table-row">
          <span>Producto 1</span>
          <span>Entrada</span>
          <span>50</span>
          <span>2023-10-15</span>
          <span>usuario1</span>
        </div>
        <div className="table-row">
          <span>Producto 2</span>
          <span>Salida</span>
          <span>25</span>
          <span>2023-10-16</span>
          <span>usuario2</span>
        </div>
      </div>
    </div>
  )
}

export default Movements