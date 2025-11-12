import { useEffect, useState } from "react";
import { carreraService } from '../services/carreraService.js';
import CarreraTarjeta from '../components/CarreraTarjeta.jsx';


export default function Carreras() {
  const [carreras, setCarreras] = useState([]);

  useEffect(() => {
    const cargarCarreras = async () => {
      try {
        const data = await carreraService.obtenerTodos();
        setCarreras(data);
      } catch (error) {
        console.error("Error al cargar carreras:", error);
      }
    };
    cargarCarreras();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-10 px-6 text-texto">
      <h1 className="text-3xl font-semibold mb-6 text-azulUTN">
        Explorar materias de nuestras carreras
      </h1>

      <hr className="w-3/4 mx-auto border-t-2 border-gray-700 mb-8" />

      {carreras.length > 0 ? (
        <div className="space-y-10">
          {carreras.map((carrera) => (
            <CarreraTarjeta key={carrera.idCarrera} carrera={carrera} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">
          No hay carreras disponibles.
        </p>
      )}
    </div>
  );
}