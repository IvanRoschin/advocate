'use client';
import { FallingLines } from 'react-loader-spinner';

const Loader: React.FC = () => {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
      <FallingLines color="#EA580C" width="100" visible={true} />
    </div>
  );
};

export default Loader;
