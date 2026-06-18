import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall, Shield, Clock } from 'lucide-react';
import { useI18n } from '../../i18n';
import Button from '../Button/Button';
import './Hero.css';

export default function Hero() {
  const { t } = useI18n();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const badgesVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const, delay: 0.6 },
    },
  };

  return (
    <section id="home" className="hero">
      {/* Background with overlay */}
      <div className="hero__bg">
        <div className="hero__bg-image" />
        <div className="hero__bg-overlay" />
      </div>

      {/* Decorative patterns */}
      <div className="hero__pattern" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      {/* Floating shapes decoration */}
      <div className="hero__decorations" aria-hidden="true">
        <motion.div
          className="hero__shape hero__shape--1"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero__shape hero__shape--2"
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="hero__shape hero__shape--3"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="hero__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badges */}
        <motion.div className="hero__badges" variants={badgesVariants}>
          <span className="hero__badge">
            <Shield size={14} />
            {t.hero.badge1}
          </span>
          <span className="hero__badge">
            <Clock size={14} />
            {t.hero.badge2}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1 className="hero__title" variants={itemVariants}>
          {t.hero.title.split('.').map((part: string, i: number) => (
            <span key={i}>
              {part}{i === 0 ? '.' : ''}
              {i === 0 && <span className="hero__title-accent">.</span>}
              <br />
            </span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="hero__subtitle" variants={itemVariants}>
          {t.hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div className="hero__ctas" variants={itemVariants}>
          <Button variant="primary" size="lg" icon={<ArrowRight size={20} />}>
            {t.hero.ctaPrimary}
          </Button>
          <Button
            variant="outline"
            size="lg"
            icon={<PhoneCall size={20} />}
          >
            {t.hero.ctaSecondary}
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div className="hero__trust" variants={itemVariants}>
          <div className="hero__trust-item">
            <span className="hero__trust-number">15+</span>
            <span className="hero__trust-label">{t.hero.trust1}</span>
          </div>
          <div className="hero__trust-divider" />
          <div className="hero__trust-item">
            <span className="hero__trust-number">5000+</span>
            <span className="hero__trust-label">{t.hero.trust2}</span>
          </div>
          <div className="hero__trust-divider" />
          <div className="hero__trust-item">
            <span className="hero__trust-number">98%</span>
            <span className="hero__trust-label">{t.hero.trust3}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          className="hero__scroll-mouse"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="hero__scroll-wheel" />
        </motion.div>
        <span className="hero__scroll-text">Scroll</span>
      </motion.div>
    </section>
  );
}
