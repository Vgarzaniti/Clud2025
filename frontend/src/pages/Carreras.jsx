import CarreraTarjeta from '../components/CarreraTarjeta.jsx';

export default function Carreras() {
    const carreras = [
    {
      id: 1,
      nombre: "Ingenieria en Sistemas",
      materias: [
        "Programacion I",
        "Programacion II",
        "Redes de Computadoras",
        "Base de Datos",
        "Sistemas Operativos",
        "Ingenieria de Software",
      ],
    },
    {
      id: 2,
      nombre: "Ingenieria Electrónica",
      materias: [
        "Fisica I",
        "Circuitos",
        "Microcontroladores",
        "Electronica Digital",
        "Automatizacion",
        "Control de Sistemas",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-8 text-texto">
      <h1 className="text-3xl font-semibold mb-6 text-azulUTN">
        Explorar materias de nuestras carreras
      </h1>

      <hr className="w-3/4 mx-auto border-t-2 border-gray-700" />

      <div className="space-y-10">
        {carreras.map((carrera) => (
          <CarreraTarjeta key={carrera.id} carrera={carrera} />
        ))}
      </div>
      
    </div>
  );
}