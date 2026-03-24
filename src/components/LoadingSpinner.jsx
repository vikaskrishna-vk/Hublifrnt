import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
    </div>
  );
};

export default LoadingSpinner;
