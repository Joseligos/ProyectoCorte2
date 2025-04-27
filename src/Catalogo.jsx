import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { añadirLibro, prestarLibro, devolverLibro, agregarACola } from "./store/slices/bibliotecaSlice";

const Catalogo = () => {
  const dispatch = useDispatch();
  const catalog = useSelector((state) => state.biblioteca.catalog);
  const librosPrestados = useSelector((state) => state.biblioteca.librosPrestados);
  const esperaQueue = useSelector((state) => state.biblioteca.esperaQueue);

  const [titulo, setTitulo] = useState('');
  const [currentPage, setCurrentPage] = useState(catalog.head);

  useEffect(() => {
    if (catalog.head) {
      setCurrentPage(catalog.nodes[catalog.head]);
    }
  }, [catalog]);

  const handleAgregarLibro = () => {
    if (titulo.trim() !== '') {
      dispatch(añadirLibro(titulo));
      setTitulo('');
    }
  };

  const handlePrestarLibro = () => {
    const usuario = prompt("Ingresa tu nombre para prestar el libro");
    if (usuario && currentPage) {
      dispatch(prestarLibro({ libroId: currentPage.id, usuario }));

      if (currentPage.next) {
        setCurrentPage(catalog.nodes[currentPage.next]);
      } else if (currentPage.prev) {
        setCurrentPage(catalog.nodes[currentPage.prev]);
      } else {
        setCurrentPage(null); 
      }
    }
  };

  const renderLibro = () => {
    if (currentPage) {
      return (
        <div>
          <h3>{currentPage.titulo}</h3>
          <button onClick={handlePrestarLibro}>Prestar</button>
        </div>
      );
    }
    return <p>No hay libro para mostrar.</p>;
  };

  const handleSiguiente = () => {
    if (currentPage && currentPage.next) {
      setCurrentPage(catalog.nodes[currentPage.next]);
    }
  };

  const handleAnterior = () => {
    if (currentPage && currentPage.prev) {
      setCurrentPage(catalog.nodes[currentPage.prev]);
    }
  };

  const renderLibrosPrestados = () => {
    return Object.entries(librosPrestados).map(([libroId, { titulo, usuario }]) => {
      const estaPrestado = true;


      return (
        <li key={libroId}>
          {titulo} - Prestado a: {usuario}
          <button
            onClick={() => dispatch(devolverLibro({ libroId, titulo }))}
            style={{ marginLeft: "10px" }}
          >
            Devolver
          </button>

          {estaPrestado && (
            <button
              onClick={() => {
                const usuario = prompt("Ingresa tu nombre para ponerte en cola");
                if (usuario) {
                  if (!esperaQueue[libroId]) {
                    dispatch(agregarACola({ libroId, usuario }));
                  } else {
                    dispatch(agregarACola({ libroId, usuario }));
                  }
                }
              }}
              style={{ marginLeft: "10px" }}
            >
              Unirse a la cola
            </button>
          )}
        </li>
      );
    });
  };

  const renderEsperaQueue = () => {
    return Object.entries(esperaQueue).map(([libroId, cola]) => {
      const libro = librosPrestados[libroId] || catalog.nodes[libroId];
  
      return (
        <li key={libroId}>
          {libro ? libro.titulo : "Libro no disponible"} - Esperando: {cola.join(", ")}
        </li>
      );
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Catálogo de Libros</h2>
      <input
        type="text"
        placeholder="Título del libro"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button onClick={handleAgregarLibro} style={{ marginLeft: '10px' }}>
        Agregar Libro
      </button>

      <div>
        <h3>Libro Actual</h3>
        {renderLibro()}
      </div>
      <br />
      <div>
        <button onClick={handleAnterior} disabled={!currentPage || !currentPage.prev}>
          Libro Anterior
        </button>
        <button onClick={handleSiguiente} disabled={!currentPage || !currentPage.next}>
          Libro Siguiente
        </button>
      </div>

      <h3>Libros Prestados</h3>
      <ul>
        {renderLibrosPrestados()}
      </ul>

      <h3>Colas de Espera</h3>
      <ul>
        {renderEsperaQueue()}
      </ul>
    </div>
  );
};

export default Catalogo;
