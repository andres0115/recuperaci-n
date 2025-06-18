import Header from '@/components/organismos/Header';
import { Button, Card } from '@heroui/react';
import React, { useRef, useState } from 'react';
import Modal from '@/components/organismos/Modal';
import Sidebar from '@/components/organismos/Sidebar';
import Alert from '@/components/organismos/Alert';
import CentrosList from './CentroFormacionList';
import CentroForm from './CentroFormacionForm';
import { useCentrosFormacion } from '@/hooks/use-centroformacion';
import { Action } from '@/models/action';

interface CentrosFormacionMainProps {
  userName?: string;
}

const CentrosFormacionMain: React.FC<CentrosFormacionMainProps> = ({ userName = "Administrador" }) => {

  const [action, setAction] = useState<Action>(Action.ADD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState<CentroFormacion | null>(null);
  const [centroToDelete, setCentroToDelete] = useState<CentroFormacion | null>(null);
  const alertDeleteRef = useRef<{ onOpen: () => void; onClose: () => void }>(null);

  const { centros, addCentro, updateCentro, deleteCentro } = useCentrosFormacion();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCentro(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} />
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Card className="p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Centros de Formación</h2>
              <Button
                onPress={() => {
                  setAction(Action.ADD);
                  openModal();
                }}
                color="primary"
                className="w-40"
              >
                Agregar Nuevo
              </Button>
            </div>

            {/* Modal para agregar o editar centros */}
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              title={action === Action.ADD ? "Agregar Centro" : "Editar Centro"}
            >
              <CentroForm
                initialData={selectedCentro ?? undefined}
                onCancel={closeModal}
                onSave={(item: SaveCentroFormacion) => {
                  action === Action.EDIT
                    ? updateCentro(item.id!, item)
                    : addCentro(item);
                  closeModal();
                }}
              />
            </Modal>

            {/* Lista de centros */}
            <CentrosList
              centros={centros}
              onEdit={(item) => {
                setAction(Action.EDIT);
                setSelectedCentro(item);
                openModal();
              }}
              onDelete={(item) => {
                setCentroToDelete(item);
                alertDeleteRef.current?.onOpen();
              }}
            />

            {/* Alerta de confirmación para eliminar */}
            <Alert
              ref={alertDeleteRef}
              onCloseCallback={(confirmed: boolean) => {
                if (confirmed && centroToDelete) {
                  deleteCentro(centroToDelete.id);
                  setCentroToDelete(null);
                }
              }}
              title="Confirmar Eliminación"
              description="¿Está seguro de que desea eliminar este centro de formación?"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CentrosFormacionMain;
