import React from 'react';
import '../estilos/filtrosLateral.css';

const FiltrosLateral = ({ categorias, categoriaActiva, setCategoriaActiva }) => {
    return (
        <aside className="filtros-lateral">
            <h4 className="filtros-titulo">CATEGORÍAS</h4>
            <ul className="filtros-lista">
                {categorias.map((cat, index) => (
                    <li key={index} className="filtro-item">
                        <button
                            className={`filtro-btn ${categoriaActiva === cat ? 'active' : ''}`}
                            onClick={() => setCategoriaActiva(cat)}
                        >
                            <span className="filtro-texto">{cat}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default FiltrosLateral;
