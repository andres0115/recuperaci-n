import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Persona } from "@/types/personas";

export async function putPersona(params: { 
  id_persona: number; 
  data: Partial<Persona>; 
}): Promise<Persona> {
  const { id_persona, data } = params;
  const response = await axiosInstance.put<Persona>(
    `/personas/${id_persona}`,
    data
  );
  return response.data;
}

export function usePutPersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
    },
  });
}
