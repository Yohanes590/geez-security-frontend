import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="h-12 w-12 text-geez-green animate-spin" />
      <p className="mt-4 text-gray-400">Loading data...</p>
    </div>
  );
};

export default Loader;
