import React from "react";
import "./ForoCard.css";

const ForoCard = ({ foro }) => {
  return (
    <div className="foro-card">
      <h4>{foro.titulo || "RespuestaDetalle - Con Respuesta + Archivo + Persona que la realizó"}</h4>
      <div className="foro-card-footer">
        <button className="btn-puntaje">Puntaje</button>
      </div>
    </div>
  );
};

export default ForoCard;
