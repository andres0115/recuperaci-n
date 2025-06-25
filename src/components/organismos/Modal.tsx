import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay de fondo */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md transform overflow-hidden rounded-lg p-6 text-left align-middle shadow-xl transition-all bg-white relative">
          {/* Botón de cerrar */}
          <div className="absolute top-3 right-3">
            <button
              type="button"
              className="rounded-full p-1 focus:outline-none text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          
          {/* Título */}
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {title}
            </h3>
          )}
          
          {/* Contenido */}
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
