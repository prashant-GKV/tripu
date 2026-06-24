import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface PhotoCardProps {
  src: string;
  alt: string;
  rotation?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  caption?: string;
  delay?: number;
}

export default function PhotoCard({
  src,
  alt,
  rotation = 0,
  className,
  size = 'md',
  caption,
  delay = 0,
}: PhotoCardProps) {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-56',
  };

  return (
    <motion.div
      className={clsx(
        'polaroid-card flex-shrink-0 cursor-pointer overflow-hidden',
        sizes[size],
        className
      )}
      style={{ rotate: rotation }}
      initial={{ opacity: 0, y: 20, rotate: rotation - 5 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      whileHover={{
        rotate: 0,
        scale: 1.06,
        zIndex: 10,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
      {caption && (
        <p className="mt-2 text-xs font-sans text-traw-secondary text-center truncate">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
