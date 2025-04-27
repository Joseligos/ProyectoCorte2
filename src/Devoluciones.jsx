import { useSelector, useDispatch } from 'react-redux';
import { rehacerDevolucion } from './store/slices/bibliotecaSlice';

const Devoluciones = () => {
    const dispatch = useDispatch();
    const devolucionStack = useSelector((state) => state.biblioteca.devolucionStack);

    const handleRehacerDevolucion = () => {
        dispatch(rehacerDevolucion());
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
                onClick={() => handleRehacerDevolucion(libro)}
            >Rehacer Devolución</button>
            </li>
        ))}
        </ul>
        </div>
    );
};

export default Devoluciones;
