import { useSelector, useDispatch } from 'react-redux';
import { devolverLibroAlCatalogo, rehacerDevolucion } from './store/slices/bibliotecaSlice';

const Devoluciones = () => {
    const dispatch = useDispatch();
    const devolucionStack = useSelector((state) => state.biblioteca.devolucionStack);

    const handleRehacerDevolucion = () => {
        dispatch(rehacerDevolucion());
    };

    const handleDevolverAlCatalogo = (libro) => {
        console.log("Devolviendo al catálogo el libro:", libro);
        dispatch(devolverLibroAlCatalogo({ libroId: libro.id, titulo: libro.titulo }));
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
