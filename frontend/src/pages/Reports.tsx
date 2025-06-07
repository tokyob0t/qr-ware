const Reports = () => {
  return (
    <div className="page-container">
      <h1>Reports Page</h1>
      <div className="reports-dashboard">
        <div className="chart-mock">
          <h3>Stock por Producto</h3>
          <div className="bar-chart"></div>
        </div>
        <div className="chart-mock">
          <h3>Movimientos Mensuales</h3>
          <div className="line-chart"></div>
        </div>
        <div className="export-options">
          <button>Exportar a Excel</button>
          <button>Exportar a PDF</button>
        </div>
      </div>
    </div>
  )
}

export default Reports