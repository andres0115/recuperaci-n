import { useGetAmbientes as useApiGetAmbientes } from "@/api/ambientes/getAmbientes";

export function useGetAmbientes() {
  const { data: ambientes, isLoading, isError } = useApiGetAmbientes();
  return { ambientes, isLoading, isError };
}
