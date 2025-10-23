import {Link} from 'react-router-dom';
import "../input.css";

export default function Encabezado() {
    return (
         <nav className="bg-panel text-white border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-semibold">
                    Foro Institucional UTN
                </Link>
                <div className="flex gap-6 items-center">
                <Link to="/">Inicio</Link>
                <Link to="/carreras">Carreras</Link>
                <Link to="/perfil">Mi perfil</Link>
                <Link to="/ayuda">Ayuda</Link>
                <div className="w-8 h-8 bg-green-500 rounded-full">US</div>
                </div>
            </div>
        </nav>
    );
}