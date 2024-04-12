import { LoaderCircleIcon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full">
      <LoaderCircleIcon className="animate-spin size-12 text-white" />
    </div>
  );
};

export default Loader;
