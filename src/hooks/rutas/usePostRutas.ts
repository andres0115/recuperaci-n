import { usePostRuta as useApiPostRuta } from "@/api/rutas/postRutas";
import { Ruta } from "@/types/rutas";

export function usePostRuta() {
  const post = useApiPostRuta();
  const crearRuta = async (data: Ruta) => post.mutateAsync(data);
  return { crearRuta };
}
