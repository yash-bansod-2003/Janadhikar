import { Icons } from "@/components/icons";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full relative">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
      <Icons.logo className="size-14 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-1" />
    </div>
  );
};
