import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { GetAmbiente } from "@/types/ambiente";

export async function postAmbiente(data: GetAmbiente): Promise<GetAmbiente> {
  const response = await axiosInstance.post("/ambientes", data);
  return response.data;
}

export function usePostAmbiente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAmbiente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambientes"] });
    },
  });
}
