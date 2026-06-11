import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface SwooshLineProps {
  className?: string;
}

export default function SwooshLine({ className }: SwooshLineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.8, ease: 'easeInOut', delay: 0.3 },
      });
    }
  }, [isInView, controls]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 220"
      preserveAspectRatio="none"
      className={clsx('absolute inset-0 w-full h-full pointer-events-none z-10', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M -20 180 C 80 200, 150 80, 280 120 C 380 150, 420 60, 560 90 C 680 115, 720 40, 860 80 C 960 105, 1000 30, 1140 50 C 1180 42, 1200 38, 1220 35"
        stroke="#C8E63C"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(200, 230, 60, 0.7))',
        }}
      />
    </svg>
  );
}
