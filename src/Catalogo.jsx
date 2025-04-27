import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { añadirLibro, prestarLibro, devolverLibro, agregarACola } from "./store/slices/bibliotecaSlice";

const Catalogo = () => {
    const dispatch = useDispatch();
    const catalog = useSelector((state) => state.biblioteca.catalog);
    const librosPrestados = useSelector((state) => state.biblioteca.librosPrestados);
    const esperaQueue = useSelector((state) => state.biblioteca.esperaQueue);
  
    const [titulo, setTitulo] = useState('');
  
    const handleAgregarLibro = () => {
      if (titulo.trim() !== '') {
        dispatch(añadirLibro(titulo));
        setTitulo('');
      }
    };
  
    const renderCatalog = () => {
      const libros = [];
      let currentId = catalog.head;
    
      while (currentId) {
        const currentLibro = catalog.nodes[currentId];
    
        if (!currentLibro) {
          console.error(`Libro con id ${currentId} no encontrado`);
          break;
        }

        libros.push(
          <li key={currentLibro.id}>
            {currentLibro.titulo}
            <button
              onClick={() => {
                const usuario = prompt("Ingresa tu nombre para prestar el libro");
                if (usuario) {
                  dispatch(prestarLibro({ libroId: currentLibro.id, usuario }));
                }
              }}
              style={{ marginLeft: "10px" }}
            >
              Prestar
            </button>
          </li>
        );
    
        currentId = currentLibro.next;
      }
    
      return libros;
    };
  
    const renderLibrosPrestados = () => {
        return Object.entries(librosPrestados).map(([libroId, { titulo, usuario }]) => {

          const estaPrestado = true; 

          const tieneCola = esperaQueue[libroId] && esperaQueue[libroId].length > 0;
          
          console.log(`Libro: ${titulo} | Prestado a: ${usuario} | Hay cola: ${tieneCola ? 'Sí' : 'No'}`);
      
          return (
            <li key={libroId}>
              {titulo} - Prestado a: {usuario}
              <button
                onClick={() => dispatch(devolverLibro({ libroId, titulo }))}
                style={{ marginLeft: "10px" }}
              >
                Devolver
              </button>
      
              {}
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
          const libro = catalog.nodes[libroId];
          
          return (
            <li key={libroId}>
              {libro ? libro.titulo : "Libro no disponible"} - Esperando: {cola.join(', ')}
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
  
        <h3>Libros Disponibles</h3>
        <ul>
          {renderCatalog()}
        </ul>
  
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



