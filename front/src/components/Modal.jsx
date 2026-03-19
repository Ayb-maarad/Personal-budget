

const Modal = ({ onClose, children }) => {
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="mb-4 text-gray-400 hover:text-white text-sm"
                    onClick={onClose}
                >
                    ✕ Close
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
