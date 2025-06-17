import { usePostAplicativo as useApiPostAplicativo } from "@/api/aplicativos/postAplicativos";
import { Aplicativo } from "@/types/aplicativos";

export function usePostAplicativo() {
  const post = useApiPostAplicativo();
  const crearAplicativo = async (data: Aplicativo) => post.mutateAsync(data);
  return { crearAplicativo };
}
