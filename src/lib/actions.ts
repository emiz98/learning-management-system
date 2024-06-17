import { queryClient } from "@/app/session_context";

export const revalidate = async (key: string) => {
  await queryClient.invalidateQueries({
    queryKey: [key],
  });
};
