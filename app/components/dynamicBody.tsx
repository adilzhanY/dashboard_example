import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { twJoin } from "tailwind-merge";

const DynamicBody = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  return (
    <motion.div
      layoutId="dynamicBody"
      layout
      className={twJoin(
        "bg-white p-6 flex-1 rounded-3xl z-10 flex flex-col border-2 border-neutral-200 w-full max-w-5xl min-h-fit overflow-auto",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default DynamicBody;
