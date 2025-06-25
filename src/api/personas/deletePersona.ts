import axiosInstance from "@/api/axiosClient";

export async function deletePersona(id: number): Promise<void> {
  await axiosInstance.delete(`/personas/${id}`);
}
