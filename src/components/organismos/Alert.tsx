import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    forwardRef,
  } from "@heroui/react";
  import { useImperativeHandle, useState } from "react";
  
  interface AlertProps {
    title: string;
    description?: string;
    onCloseCallback: (confirmed: boolean) => void;
  }
  
  const Alert = forwardRef(({ title, description, onCloseCallback }: Readonly<AlertProps>, ref) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  
    useImperativeHandle(ref, () => ({
      onOpen,
      onClose,
    }));
  
    const handleConfirm = () => {
      onClose();
      onCloseCallback(true);
    };
  
    const handleCancel = () => {
      onClose();
      onCloseCallback(false);
    };
  
    return (
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        radius="lg"
        size="md"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>{description}</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={handleCancel}>
                  Cancelar
                </Button>
                <Button className="bg-primary" onPress={handleConfirm}>
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  });
  
  export default Alert;
  