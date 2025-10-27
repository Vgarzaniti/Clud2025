import { Outlet } from "react-router-dom";
import Encabezado from "../components/Encabezado.jsx";

export default function MainLayout() {
    return(
        <div className="min-h-screen bg-fondo text-texto">
            <Encabezado />
            <Outlet />
        </div>
    )
}