import { Link } from 'react-router-dom';
import '../estilos/pagina404.css';

function Pagina404() {
    return (
        <div className="Pagina404Container">
            <div className="contenido">
                <h1>
                    404
                </h1>
                <h2>
                    Página No Encontrada
                </h2>
                <p>
                    Lo sentimos, la dirección que intentas visitar no existe.
                </p>
                <Link
                    to="/"
                >
                    Volver a la Página Principal
                </Link>
            </div>
        </div>
    );
}

export default Pagina404;