import "../input.css";
// El filtro de materia debe estar determinado por la eleccion de 
// filtro carrera
export default function BarraLado() {
    return (
        <aside className="w-1/4 space-y-6">
            <div className="bg-panel p-4 rounded-2xl shadow-md border border-gray-600">
                <h2 className="text-lg font-semibold mb-3 text-azulUTN">Filtros</h2>
                
                <div className="mb-4">
                    <p className="font-medium">Carreras</p>
                    <select className="bg-fondo border border-gray-600 p-2 w-full rounded text-texto">
                        <option>Seleccionar carrera</option>
                        <option>Todos</option>
                        <option>Industrial</option>
                        <option>Mecanica</option>
                        <option>Sistemas</option>
                        <option>Electrica</option>
                        <option>Quimica</option>
                    </select>
                </div>
                
                <div className="mb-5">
                    <p className="font-medium">Materia</p>
                    <select className="bg-fondo border border-gray-600 p-2 w-full rounded text-texto">
                        <option>Seleccionar materia</option>
                        <option>Todos</option>
                        <option>Algoritmos</option>
                        <option>Redes</option>
                        <option>Base de Datos</option>
                    </select>
                </div>
            </div>
            <div className="bg-panel p-4 rounded-2xl shadow-md border border-gray-600">
                <h2 className="text-lg font-semibold mb-3 text-azulUTN">Ranking de Foros</h2>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>¿Cuál es el mejor lenguaje de programación? Respuestas: 120</li>
                    <li>¿Cómo optimizar algoritmos de búsqueda? - Respuestas: 30</li>
                    <li>¿Cómo diseñar una base de datos eficiente? - Respuestas: 12</li>
                </ol>
            </div>
        </aside>
    );
}