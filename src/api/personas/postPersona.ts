import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Persona } from "@/types/personas";

export async function postPersona(
  persona: Omit<Persona, "id_persona">
): Promise<Persona> {
  const response = await axiosInstance.post<Persona>(
    "/personas/",
    persona
  );
  return response.data;
}

export function usePostPersona() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas"] });
    },
  });
}
