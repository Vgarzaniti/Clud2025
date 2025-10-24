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
                    <Link to="/" className='hover:text-indigo-600'>Inicio</Link>
                    <Link to="/carreras" className='hover:text-indigo-600'>Carreras</Link>
                    <Link to="/perfil" className='hover:text-indigo-600'>Mi perfil</Link>
                    <Link to="/ayuda" className='hover:text-indigo-600'>Ayuda</Link>
                    
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-semibold text-fondo">
                        US
                    </div>
                </div>
            </div>
        </nav>
    );
}