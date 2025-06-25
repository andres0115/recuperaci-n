import { Action } from "@/enums/action";
import { Button, Form, Input } from "@heroui/react";
import React from "react";

interface CentroFormacionFormProps {
  onSave?: (item: SaveCentroFormacion) => void;
  onCancel?: () => void;
  actionType?: Action;
  initialData?: CentroFormacion;
}

const CentroFormacionForm = ({
  onSave,
  onCancel,
  actionType,
  initialData,
}: CentroFormacionFormProps) => {
  return (
    <Form
      className="w-full mx-auto flex flex-col gap-4"
      validationBehavior="native"
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        if (onSave) {
          onSave({
            id_centro: initialData?.id_centro,
            nombre: data.nombre as any,
          });
        }
      }}
    >
      <Input
        isRequired
        label="Nombre del centro de formación"
        labelPlacement="outside"
        name="nombre"
        placeholder="Ingrese el nombre"
        type="text"
        defaultValue={initialData?.nombre ?? ""}
      />

      <div className="flex justify-end w-full">
        <Button color="default" onPress={onCancel} className="w-40 mr-2">
          Cancelar
        </Button>
        <Button color="primary" type="submit" className="w-40">
          {actionType === Action.ADD ? "Agregar" : "Guardar"}
        </Button>
      </div>
    </Form>
  );
};

export default CentroFormacionForm;
