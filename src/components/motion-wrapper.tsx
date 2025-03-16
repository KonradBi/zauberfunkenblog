'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionCardProps {
  children: ReactNode;
  index?: number;
}

export function MotionCard({ children, index = 0 }: MotionCardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
} 