{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    ruff
    isort
    python312
    python312Packages.python-lsp-server
    python312Packages.python-lsp-ruff
    python312Packages.pip
  ];

  shellHook = ''
    echo "🔧 Entorno de desarrollo para QR App cargado."
    echo "📦 Frontend: React + TypeScript con bun"
    echo "🖥️ Backend: Flask (API) + Supabase"

    # Ruta al entorno virtual
    VENV_DIR="./venv"

    # Crear venv si no existe
    if [ ! -d "$VENV_DIR" ]; then
      echo "📁 No se encontró el entorno virtual. Creándolo en $VENV_DIR..."
      python3 -m venv "$VENV_DIR"
    fi

    # Activar entorno virtual
    echo "✅ Activando entorno virtual..."
    source "$VENV_DIR/bin/activate"

    # Instalar dependencias si requirements.txt existe
    if [ -f "requirements.txt" ]; then
      echo "📦 Instalando paquetes desde requirements.txt (si faltan)..."
      pip install --upgrade pip > /dev/null
      pip install -r requirements.txt
    else
      echo "⚠️ No se encontró requirements.txt, saltando instalación de paquetes."
    fi
  '';
}
