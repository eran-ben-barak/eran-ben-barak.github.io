"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export const pageVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as any
    }
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.8,
      ease: [0.7, 0, 0.84, 0] as any
    }
  }
};

export const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.2, 
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1] as any
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.6,
      ease: [0.7, 0, 0.84, 0] as any
    }
  }
};

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}
