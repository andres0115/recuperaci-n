import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putAplicativo } from "@/api/aplicativos/putAplicativos";
import { Aplicativo } from "@/types/aplicativos";

export function usePutAplicativo() {
  const queryClient = useQueryClient();
  const { mutateAsync: actualizarAplicativo, isPending: isUpdating } = useMutation({
    mutationFn: (data: Partial<Aplicativo> & { id: number }) => putAplicativo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplicativos"] });
    },
  });

  return { actualizarAplicativo, isUpdating };
}
