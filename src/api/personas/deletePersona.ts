import axiosInstance from "@/api/axiosConfig";

export async function deletePersona(id: number): Promise<void> {
  await axiosInstance.delete(`/personas/${id}`);
}
