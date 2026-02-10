import {useNavigate} from "react-router-dom";

export default function MateriaTarjeta({ nombre, idMateria }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/materia/${idMateria}`)}
            className="bg-panel text-texto py-3 rounded-full font-medium hover:bg-azulUTN hover:text-white transition shadow-sm"
        >
            {nombre}
        </button>
    );
}