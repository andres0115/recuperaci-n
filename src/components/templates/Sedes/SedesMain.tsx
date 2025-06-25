import Header from "@/components/organismos/Header";
import { Button, Card } from "@heroui/react";
import React, { useRef, useState } from "react";
import SedesList from "./SedesList";
import { Action } from "@/enums/action";
import Modal from "@/components/organismos/Modal";
import SedeForm from "./SedesForm";
import Sidebar from "@/components/organismos/Sidebar";
import { useSedes } from "@/hooks/use-sede";
import Alert from "@/components/organismos/Alert";
import { useCentrosFormacion } from "@/hooks/use-centroformacion";

interface SedesMainProps {
  userName?: string;
}

const SedesMain: React.FC<SedesMainProps> = ({ userName = "Wilson" }) => {
  const [action, setAction] = useState<Action>(Action.ADD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sedes, isLoading, createSede, updateSede, deleteSede } = useSedes();
  const { centros } = useCentrosFormacion();
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [sedeToDelete, setSedeToDelete] = useState<Sede | null>(null);

  const alertDeleteRef = useRef<{ onOpen: () => void; onClose: () => void }>(
    null
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSede(null);
  };
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} />

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Card className="p-0 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">
                Lista de sedes
              </h2>

              <Button
                onPress={() => {
                  setAction(Action.ADD);
                  openModal();
                }}
                color="primary"
                type="submit"
                className="w-40"
              >
                Agregar Nuevo
              </Button>
            </div>
            {/* Modal para agregar o editar sedes */}
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              title={action === Action.ADD ? "Agregar Sede" : "Editar Sede"}
            >
              <SedeForm
                centrosFormacion={centros ?? []}
                onCancel={closeModal}
                initialData={selectedSede ?? undefined}
                onSave={(item: SaveSede) => {
                  action === Action.EDIT ? updateSede(item) : createSede(item);
                  closeModal();
                }}
              />
            </Modal>
            {isLoading ? (
              <p className="p-4">Cargando datos...</p>
            ) : (
              <SedesList
                sedes={sedes ?? []}
                onEdit={(item) => {
                  setAction(Action.EDIT);
                  setSelectedSede(item);
                  openModal();
                }}
                onDelete={(item: Sede) => {
                  setSedeToDelete(item);
                  alertDeleteRef.current?.onOpen();
                }}
              />
            )}

            <Alert
              ref={alertDeleteRef}
              onCloseCallback={(confirmed: boolean) => {
                if (confirmed && sedeToDelete) {
                  deleteSede(sedeToDelete.id_sede);
                  setSedeToDelete(null); //  Limpiamos
                }
              }}
              title="Notificacion"
              description="Esta seguro que desea eliminar este registro ?"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
export default SedesMain;
