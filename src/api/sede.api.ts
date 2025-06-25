const BASE_URL = import.meta.env.VITE_API_URL;

export const findAllSedesApi = async (): Promise<Sede[]> => {
  const response = await fetch(`${BASE_URL}/sedes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error al obtener sedes");
  return response.json();
};


export const createSedeApi = async (sede: SaveSede): Promise<Sede> => {
  const response = await fetch(`${BASE_URL}/sedes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sede),
  });
  if (!response.ok) throw new Error("Error al crear la sede");
  return response.json();
};

export const updateSedeApi = async (sede: SaveSede): Promise<Sede> => {
  if (!sede.id_sede) throw new Error("ID requerido para actualizar sede");
  const response = await fetch(`${BASE_URL}/sedes/${sede.id_sede}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sede),
  });
  if (!response.ok) throw new Error("Error al actualizar la sede");
  return response.json();
};

export const deleteSedeApi = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/sedes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error al eliminar la sede");
};
