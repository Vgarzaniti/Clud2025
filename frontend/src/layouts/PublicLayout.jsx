import { Outlet } from "react-router-dom";
import EncabezadoPublico from "../components/EncabezadoPublico.jsx";

export default function PublicLayout() {
    return(
        <div className="min-h-screen bg-fondo text-texto">
            <EncabezadoPublico />
            <Outlet />
        </div>
    )
}