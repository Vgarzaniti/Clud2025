import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { foroService } from "../services/foroService";
import { respuestaService } from "../services/respuestaService";

export default function Inicio() {
  const [rankingForos, setRankingForos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [metricas, setMetricas] = useState({
    foros: 0,
    respuestas: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const foros = await foroService.obtenerTodos();
        const respuestas = await respuestaService.obtenerPorTodos();

        setMetricas({
          foros: foros?.length || 0,
          respuestas: respuestas?.length || 0,
        });

        const conteo = {};
        (respuestas || []).forEach((r) => {
          conteo[r.foro] = (conteo[r.foro] || 0) + 1;
        });

        const topForos = (foros || [])
          .map((foro) => ({
            ...foro,
            totalRespuestas: conteo[foro.idForo] || 0,
          }))
          .sort((a, b) => b.totalRespuestas - a.totalRespuestas)
          .slice(0, 5);

        setRankingForos(topForos);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 flex flex-col">

      <section className="text-center mt-20">
        <h1 className="text-5xl font-extrabold text-white mb-6">
          Foro Institucional UTN
        </h1>

        <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10">
          Un espacio para que alumnos de ingeniería compartan dudas,
          conocimientos y experiencias académicas.
        </p>

        <Link
          to="/registrar"
          className="bg-azulUTN text-white px-12 py-4 rounded-full font-semibold hover:bg-blue-600 transition"
        >
          Crear cuenta
        </Link>

        {/* Métricas */}
        <div className="flex justify-center gap-16 mt-14 text-gray-300 mt-20">
          <div>
            <p className="text-3xl font-bold text-white">{metricas.foros}</p>
            <p>Foros</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{metricas.respuestas}</p>
            <p>Respuestas</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Texto */}
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-white mb-6">
              Participá en las conversaciones
            </h2>

            <p className="text-gray-300 text-lg mb-6">
              Unite a los foros más activos, ayudá a tus compañeros y encontrá
              soluciones más rápido.
            </p>

            <p className="text-sm text-gray-400">
              🔒 Para leer, publicar o responder necesitás registrarte.
            </p>
          </div>

          {/* Ranking */}
          <aside className="bg-panel p-6 rounded-2xl border border-gray-700 shadow-md w-full max-w-md">
            <h3 className="font-semibold text-xl mb-3 text-center text-amber-500">
              Foros más populares
            </h3>

            {cargando && (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {!cargando && !error && rankingForos.length === 0 && (
              <p className="text-gray-400 text-sm text-center">
                No hay foros con respuestas aún.
              </p>
            )}

            {!cargando && rankingForos.length > 0 && (
              <ol className="space-y-4">
                {rankingForos.map((foro, index) => (
                  <li
                    key={foro.idForo}
                    className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition"
                  >
                    <p className="text-sm text-gray-400 mb-1">#{index + 1}</p>
                    <p className="font-semibold text-white truncate mb-2">
                      {foro.pregunta}
                    </p>
                    <span className="text-sm text-amber-400">
                      💬 {foro.totalRespuestas} respuestas
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-12">
          ¿Cómo funciona el foro?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-300">
          {[
            ["📝", "Creá tu cuenta", "Registrate con tu correo institucional."],
            ["❓", "Publicá consultas", "Preguntá sobre materias o finales."],
            ["💬", "Respondé", "Ayudá a otros estudiantes."],
            ["🎓", "Aprendé", "Crecé en comunidad."],
          ].map(([icono, titulo, texto]) => (
            <div key={titulo}>
              <p className="text-4xl mb-4">{icono}</p>
              <h3 className="font-semibold text-white mb-2">{titulo}</h3>
              <p className="text-sm">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">

          <div className="bg-panel rounded-2xl p-8">
            <h2 className="text-3xl font-extrabold text-white mb-6">
              ¿Qué tipo de consultas podés hacer?
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li>📘 Dudas sobre materias</li>
              <li>🧪 Trabajos prácticos</li>
              <li>📝 Finales y exámenes</li>
              <li>👨‍💻 Programación y proyectos</li>
              <li>📅 Organización académica</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-extrabold text-white mb-6">
              Reglas básicas
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>✔ Respeto entre usuarios</p>
              <p>✔ Lenguaje apropiado</p>
              <p>✔ Publicar en el foro correcto</p>
              <p>✔ No spam</p>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-12">
          ¿Por qué usar el Foro UTN?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-300">
          {[
            ["🚀", "Respuestas reales", "De estudiantes UTN"],
            ["⏱", "Ahorra tiempo", "Todo en un solo lugar"],
            ["🤝", "Comunidad", "Pensado para alumnos, para que entre alumnos nos ayudemos"],
          ].map(([icono, titulo, texto]) => (
            <div key={titulo}>
              <p className="text-4xl mb-4">{icono}</p>
              <h3 className="font-semibold text-white mb-2">{titulo}</h3>
              <p className="text-sm">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 text-center bg-panel rounded-2xl my-20">
        <h2 className="text-3xl font-extrabold text-white mb-6">
          ¿Listo para participar?
        </h2>

        <p className="text-gray-300 mb-10">
          Sumate al foro y empezá a compartir conocimiento.
        </p>

        <Link
          to="/registrar"
          className="bg-azulUTN text-white px-14 py-4 rounded-full font-semibold hover:bg-blue-600 transition"
        >
          Crear cuenta
        </Link>
      </section>

    </div>
  );
}
