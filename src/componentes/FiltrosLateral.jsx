import React, { useState } from 'react';
import '../estilos/filtrosLateral.css';

const FiltrosLateral = ({ categorias, categoriaActiva, setCategoriaActiva }) => {

    const gruposDefinidos = {
        'Bicicletas': [
            'Bicicleta de Montaña', 'Bicicleta De Montaña', 'E-MTB', 'Bicicleta de Carretera',
            'Gravel (Graddle)', 'Gravel', 'Enduro', 'E-Bike Eléctrica', 'Bicicleta', 'Bicicletas', 'Urbana'
        ],
        'Equipamiento y Accesorios': [
            'Accesorios', 'Cubiertas', 'Cascos', 'Guantes', 'Protecciones', 'Gafas', 'Equipamiento'
        ]
    };

    // Clasificar las categorías que realmente existen en el catálogo actual
    const bicis = categorias.filter(c => gruposDefinidos['Bicicletas'].includes(c));
    const equipamiento = categorias.filter(c => gruposDefinidos['Equipamiento y Accesorios'].includes(c));
    const otros = categorias.filter(c =>
        c !== 'Todas' &&
        !gruposDefinidos['Bicicletas'].includes(c) &&
        !gruposDefinidos['Equipamiento y Accesorios'].includes(c)
    );

    const renderBotonCategoria = (cat) => (
        <li key={cat} className="filtro-item">
            <button
                className={`filtro-btn ${categoriaActiva === cat ? 'active' : ''}`}
                onClick={() => setCategoriaActiva(cat)}
            >
                <span className="filtro-texto">{cat}</span>
            </button>
        </li>
    );

    // Estado para controlar qué grupos están abiertos (por defecto todos abiertos o cerrados)
    const [gruposAbiertos, setGruposAbiertos] = useState({
        'Bicicletas': true,
        'Equipamiento': true,
        'Otros': true
    });

    const toggleGrupo = (grupo) => {
        setGruposAbiertos(prev => ({
            ...prev,
            [grupo]: !prev[grupo]
        }));
    };

    return (
        <aside className="filtros-lateral">
            <h4 className="filtros-titulo">COLECCIÓN</h4>

            <ul className="filtros-lista">
                {/* Botón ALL siempre visible si existe */}
                {categorias.includes('Todas') && renderBotonCategoria('Todas')}

                {/* Grupo: Bicicletas */}
                {bicis.length > 0 && (
                    <li className="filtro-grupo">
                        <div className="filtro-grupo-header" onClick={() => toggleGrupo('Bicicletas')}>
                            <span className="filtro-grupo-titulo">Bicicletas</span>
                            <span className={`filtro-chevron ${gruposAbiertos['Bicicletas'] ? 'open' : ''}`}>▼</span>
                        </div>
                        {gruposAbiertos['Bicicletas'] && (
                            <ul className="filtros-sublista">
                                {bicis.filter(cat => cat !== 'Bicicleta' && cat !== 'Bicicletas').map(cat => renderBotonCategoria(cat))}
                            </ul>
                        )}
                    </li>
                )}

                {/* Grupo: Equipamiento */}
                {equipamiento.length > 0 && (
                    <li className="filtro-grupo">
                        <div className="filtro-grupo-header" onClick={() => toggleGrupo('Equipamiento')}>
                            <span className="filtro-grupo-titulo">Equipamiento</span>
                            <span className={`filtro-chevron ${gruposAbiertos['Equipamiento'] ? 'open' : ''}`}>▼</span>
                        </div>
                        {gruposAbiertos['Equipamiento'] && (
                            <ul className="filtros-sublista">
                                {equipamiento.filter(cat => cat !== 'Equipamiento').map(cat => renderBotonCategoria(cat))}
                            </ul>
                        )}
                    </li>
                )}

                {/* Grupo: Otros (por si se crea una categoría que no está mapeada) */}
                {otros.length > 0 && (
                    <li className="filtro-grupo">
                        <div className="filtro-grupo-header" onClick={() => toggleGrupo('Otros')}>
                            <span className="filtro-grupo-titulo">Más Categorías</span>
                            <span className={`filtro-chevron ${gruposAbiertos['Otros'] ? 'open' : ''}`}>▼</span>
                        </div>
                        {gruposAbiertos['Otros'] && (
                            <ul className="filtros-sublista">
                                {otros.map(cat => renderBotonCategoria(cat))}
                            </ul>
                        )}
                    </li>
                )}

            </ul>
        </aside>
    );
};

export default FiltrosLateral;
