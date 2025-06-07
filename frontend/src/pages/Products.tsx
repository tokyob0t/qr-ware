const Products = () => {
  return (
    <div className="page-container">
      <h1>Products Page</h1>
      <div className="mock-table">
        <div className="table-header">
          <span>Nombre</span>
          <span>Código</span>
          <span>Stock</span>
          <span>Acciones</span>
        </div>
        <div className="table-row">
          <span>Producto 1</span>
          <span>PROD001</span>
          <span>150</span>
          <span>
            <button>Editar</button>
            <button>Eliminar</button>
          </span>
        </div>
        <div className="table-row">
          <span>Producto 2</span>
          <span>PROD002</span>
          <span>85</span>
          <span>
            <button>Editar</button>
            <button>Eliminar</button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Products