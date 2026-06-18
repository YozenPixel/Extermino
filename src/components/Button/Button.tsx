import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  icon?: ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  className = '',
  icon,
}: ButtonProps) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();

  const content = (
    <motion.span
      className="btn__content"
      whileHover="hover"
      whileTap="tap"
      variants={{
        hover: { scale: 1.02 },
        tap: { scale: 0.98 },
      }}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__text">{children}</span>
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
    <button type={type} className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
