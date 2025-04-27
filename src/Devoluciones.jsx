import { useSelector, useDispatch } from 'react-redux';
import { rehacerDevolucion, devolverLibroAlCatalogo } from './store/slices/bibliotecaSlice';

const Devoluciones = () => {
    const dispatch = useDispatch();
    const devolucionStack = useSelector((state) => state.biblioteca.devolucionStack);
    const librosPrestados = useSelector((state) => state.biblioteca.librosPrestados);
    const esperaQueue = useSelector((state) => state.biblioteca.esperaQueue);

    const handleRehacerDevolucion = () => {
        dispatch(rehacerDevolucion());
    };

    const handleDevolverAlCatalogo = (libro) => {
        dispatch(devolverLibroAlCatalogo({ libroId: libro.id, titulo: libro.titulo }));
    };

    const puedeDevolverAlCatalogo = (libroId) => {
        const estaPrestado = librosPrestados[libroId];
        const tieneCola = esperaQueue[libroId] && esperaQueue[libroId].length > 0;

        return !estaPrestado && !tieneCola;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Historial de Devoluciones</h2>
            <ul>
                {devolucionStack.map((libro, index) => (
                    <li key={index}>
                        {libro.titulo} - Devuelto por: {libro.usuario}
                        <button
                            style={{ marginLeft: '10px' }}
                            onClick={handleRehacerDevolucion}
                        >
                            Rehacer Devolución
                        </button>

                        <button
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleDevolverAlCatalogo(libro)}
                            disabled={!puedeDevolverAlCatalogo(libro.id)}
                        >
                            Devolver al Catálogo
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Devoluciones;
