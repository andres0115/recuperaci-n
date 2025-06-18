
import { Action } from "@/models/action";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import React from "react";


interface UsersFormProps {
    onSave?: (item: SaveSede) => void;
    onCancel?: () => void;
    actionType?: Action,
    centrosFormacion: CentroFormacion[],
    initialData?: Sede;
}

const SedeForm = ({ actionType, centrosFormacion, initialData,
    onSave, onCancel }: UsersFormProps) => {
    const [action, setAction] = React.useState("");
    return (
        <Form
            className="w-full mx-auto flex flex-col gap-4"
            validationBehavior="native"
            onReset={() => setAction("null")}
            onSubmit={(e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.currentTarget));
                if (onSave) onSave({
                    nombre: data.name as string,
                    centroFormacionId: parseInt(data.centroFormacionId as string, 10)
                });
            }}
        >
            <Input
                isRequired
                labelPlacement="outside"
                name="name"
                placeholder="Nombre de la sede"
                type="text"
                defaultValue={initialData?.nombre ?? ""}
            />
            <Select
                isRequired
                labelPlacement="outside"
                name="centroFormacionId"
                defaultSelectedKeys={initialData?.centroFormacionId?.toString() ?? ""}
                placeholder="Seleccione un centro de formación"
            >
                {centrosFormacion.map((centro) => (
                    <SelectItem key={centro.id}>
                        {centro.nombre}
                    </SelectItem>
                ))}
            </Select>

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

export default SedeForm;
