import {Link} from 'react-router-dom';
import utnLogo from "../images/utnLogo.png";
import "../input.css";

export default function Encabezado() {

    return (
         <nav className="bg-panel text-white border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/home" className="text-xl font-semibold">
                    Foro Institucional UTN
                </Link>
                
                <div className="flex gap-6 items-center">
                    <Link to="/home" className='hover:text-indigo-600'>Inicio</Link>
                    <Link to="/carreras" className='hover:text-indigo-600'>Carreras</Link>
                    <Link to="/perfil" className='hover:text-indigo-600'>Mi perfil</Link>
                    <Link to="/ayuda" className='hover:text-indigo-600'>Ayuda</Link>
                    
                    <div className="flex items-center justify-center">
                        <img src={utnLogo} alt="UTN Logo" className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </nav>
    );
}