import { useState } from "react";

export function useCentrosFormacion() {
  const [centros, setCentros] = useState<CentroFormacion[]>([
    { id: 1, nombre: "Centro de formación A" },
    { id: 2, nombre: "Centro de formación B" },
    { id: 3, nombre: "Centro de formación C" },
  ]);

  const addCentro = (newCentro: CentroFormacion) => {
    const nextId =
      centros.length > 0 ? Math.max(...centros.map((c) => c.id)) + 1 : 1;
    const newItem: CentroFormacion = {
      id: nextId,
      nombre: newCentro.nombre,
    };
    setCentros((prev) => [...prev, newItem]);
  };

  const updateCentro = (id: number, updated: Partial<CentroFormacion>) => {
    setCentros((prev) =>
      prev.map((centro) =>
        centro.id === id ? { ...centro, ...updated } : centro
      )
    );
  };

  const deleteCentro = (id: number) => {
    setCentros((prev) => prev.filter((centro) => centro.id !== id));
  };

  const getCentroById = (id: number): CentroFormacion | undefined =>
    centros.find((centro) => centro.id === id);

  return {
    centros,
    addCentro,
    updateCentro,
    deleteCentro,
    getCentroById,
  };
}
