import { usePostPersona as useApiPostPersona } from "@/api/personas/postPersona"; 

export function usePostPersonas() {
  const mutation = useApiPostPersona();
  
  const crearPersona = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
      return { success: true };
    } catch (error) {
      console.error("Error al crear persona:", error);
      return { success: false, error };
    }
  };
  
  return { crearPersona, isLoading: mutation.isPending };
}
