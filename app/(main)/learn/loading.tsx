import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader className="w-6 h-6 text-muted-foreground animate-spin" />
    </div>
  );
};

export default Loading;
