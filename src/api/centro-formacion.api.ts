const BASE_URL = import.meta.env.VITE_API_URL;

export const findAllcentrosFormacionApi = async (): Promise<CentroFormacion[]> => {
  const response = await fetch(`${BASE_URL}/centrosFormacion`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error al obtener centrosFormacion");
  return response.json();
};


export const createCentroFormacionApi = async (request: SaveCentroFormacion): Promise<CentroFormacion> => {
  const response = await fetch(`${BASE_URL}/centrosFormacion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("Error al crear la sede");
  return response.json();
};

export const updateCentroFormacionApi = async (request: SaveCentroFormacion): Promise<CentroFormacion> => {
  if (!request.id_centro) throw new Error("ID requerido para actualizar sede");
  const response = await fetch(`${BASE_URL}/centrosFormacion/${request.id_centro}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("Error al actualizar la sede");
  return response.json();
};

export const deleteCentroFormacionApi = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/centrosFormacion/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error al eliminar la sede");
};
