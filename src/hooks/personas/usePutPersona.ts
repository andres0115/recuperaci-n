import { usePutPersona as useApiPutPersona } from "@/api/personas/putPersona"; 

export function usePutPersonas() {
  const mutation = useApiPutPersona();
  
  const actualizarPersona = async (id: number, data: any) => {
    try {
      await mutation.mutateAsync({ id_persona: id, data });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar persona:", error);
      return { success: false, error };
    }
  };
  
  return { actualizarPersona, isLoading: mutation.isPending };
}
