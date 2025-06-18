import { useState } from "react";

export function useSedes() {
  const [sedes, setSedes] = useState<Sede[]>([
    {
      key: 1,
      id: 1,
      nombre: "Sede 1",
      centroFormacionNombre: "Centro de formación A",
      centroFormacionId: 1,
    },
    {
      key: 2,
      id: 2,
      nombre: "Sede 2",
      centroFormacionNombre: "Centro de formación A",
      centroFormacionId: 1,
    },
  ]);

  const [centrosFormacion, setCentrosFormacion] = useState<CentroFormacion[]>([
    { id: 1, nombre: "Centro de formación A" },
    { id: 2, nombre: "Centro de formación B" },
    { id: 3, nombre: "Centro de formación C" },
  ]);

  const addSede = (newSede: SaveSede) => {
    const nextId =
      sedes.length > 0 ? Math.max(...sedes.map((s) => s.id)) + 1 : 1;

    const findCentro = centrosFormacion.find(
      (centro) => centro.id === newSede.centroFormacionId
    );
    const newItem: Sede = {
      ...newSede,
      id: nextId,
      key: nextId,
      centroFormacionNombre: findCentro?.nombre ?? "",
    };
    setSedes((prev) => [...prev, newItem]);
  };

  const updateSede = (id: number, updated: Partial<SaveSede>) => {
    setSedes((prev) =>
      prev.map((sede) => (sede.id === id ? { ...sede, ...updated } : sede))
    );
      console.log("Sede updated:", sedes);
  };

  const deleteSede = (id: number) => {
    setSedes((prev) => prev.filter((sede) => sede.id !== id));
  };

  const getSedeById = (id: number): Sede | undefined =>
    sedes.find((sede) => sede.id === id);

  return {
    sedes,
    centrosFormacion,
    addSede,
    updateSede,
    deleteSede,
    getSedeById,
  };
}
