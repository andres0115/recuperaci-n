import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAplicativo } from "@/api/aplicativos/postAplicativos";
import { Aplicativo } from "@/types/aplicativos";

export function usePostAplicativo() {
  const queryClient = useQueryClient();
  const { mutateAsync: crearAplicativo, isPending: isCreating } = useMutation({
    mutationFn: (data: Omit<Aplicativo, 'id_aplicativo'>) => postAplicativo(data as Aplicativo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplicativos"] });
    },
  });

  return { crearAplicativo, isCreating };
}
