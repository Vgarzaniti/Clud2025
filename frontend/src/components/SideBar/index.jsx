import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-section filtros">
        <h3>Filtros</h3>
        <div className="filter-group">
          <p>Carreras</p>
          <select>
            <option>Ingeniería</option>
            <option>Licenciatura</option>
          </select>

          <p>Materias</p>
          <select>
            <option>Matemática</option>
            <option>Programación</option>
          </select>
        </div>
      </div>

      <div className="sidebar-section ranking">
        <h3>Ranking Foros</h3>
        <ol>
          <li>Pregunta Foro - Cant. Res</li>
          <li>Pregunta Foro - Cant. Res</li>
          <li>Pregunta Foro - Cant. Res</li>
          <li>Pregunta Foro - Cant. Res</li>
        </ol>
      </div>
    </div>
  );
};

export default Sidebar;
