import React from "react";
import "./TopBar.css";

const TopBar = () => {
  return (
    <div className="topbar">
      <h2>Foro Institucional UTN</h2>
      <nav>
        <ul>
          <li>Inicio</li>
          <li>Carreras</li>
          <li>Mi perfil</li>
          <li>Ayuda</li>
          <li className="profile-circle"></li>
        </ul>
      </nav>
    </div>
  );
};

export default TopBar;
