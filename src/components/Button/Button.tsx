import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30',
  secondary: 'bg-gray-700 hover:bg-gray-800 text-white',
  outline: 'bg-transparent border-2 border-white/50 hover:border-white/80 text-white hover:bg-white/10',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-2 border-transparent',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-8 py-3.5 text-base rounded-xl gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  className = '',
  icon,
  disabled,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center font-semibold cursor-pointer no-underline whitespace-nowrap transition-all ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  const content = (
    <motion.span
      className="inline-flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
