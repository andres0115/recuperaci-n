import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosClient";
import { Aplicativo } from "@/types/aplicativos";

export async function postAplicativo(data: Aplicativo): Promise<Aplicativo> {
  const response = await axiosInstance.post("/aplicativos", data);
  return response.data;
}

export function usePostAplicativo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAplicativo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplicativos"] });
    },
  });
}
