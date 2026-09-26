import { appConfig } from "@/config/app.config";
import { Video } from "lucide-react";

const Logo = () => (
  <span className="flex items-center gap-2.5">
    <span className="flex-center size-9 rounded-xl bg-blue-1">
      <Video className="size-5 text-white" />
    </span>
    <span className="text-xl font-extrabold tracking-tight text-white">
      {appConfig.title}
    </span>
  </span>
);

export default Logo;
