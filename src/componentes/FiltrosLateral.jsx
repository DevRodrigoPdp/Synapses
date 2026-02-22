import React from 'react';
import '../estilos/filtrosLateral.css';

const FiltrosLateral = ({ categorias, categoriaActiva, setCategoriaActiva }) => {
    return (
        <aside className="filtros-lateral">
            <h4 className="filtros-titulo">CATEGORÍAS</h4>
            <ul className="filtros-lista">
                {categorias.map((cat, index) => (
                    <li key={index} className="filtro-item">
                        <label className="filtro-label">
                            <input 
                                type="radio" 
                                name="filtro-categoria"
                                checked={categoriaActiva === cat}
                                onChange={() => setCategoriaActiva(cat)}
                                className="filtro-radio"
                            />
                            <span className="filtro-texto">{cat}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default FiltrosLateral;
