export default function Modal({ visible, onClose, children }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-panel p-7 rounded-2xl border border-gray-700 w-[500px] h-[600px] relative shadow-xl">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-5 text-gray-400 hover:text-white text-2xl font-bold"
                >
                    ×
                </button>

                {children}
            </div>
    </div>
    );
}