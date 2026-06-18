import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Rat, Bug, FlaskConical, ArrowRight, Shield } from 'lucide-react';
import { useI18n } from '../../i18n';
import Button from '../Button/Button';
import './Expertise.css';

export default function Expertise() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const cards = [
    {
      key: 'rodent' as const,
      icon: Rat,
      color: '#E8562A',
      bgClass: 'expertise__card--rodent',
    },
    {
      key: 'disinfection' as const,
      icon: FlaskConical,
      color: '#27AE60',
      bgClass: 'expertise__card--disinfection',
    },
    {
      key: 'insect' as const,
      icon: Bug,
      color: '#F0A830',
      bgClass: 'expertise__card--insect',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const getExpertise = (key: string) => {
    const map: Record<string, { title: string; desc: string; cta: string }> = {
      rodent: t.expertise.rodent,
      disinfection: t.expertise.disinfection,
      insect: t.expertise.insect,
    };
    return map[key] ?? map.rodent;
  };

  return (
    <section id="expertise" className="expertise" ref={sectionRef}>
      <div className="expertise__bg" />

      <div className="expertise__container">
        {/* Section header */}
        <motion.div
          className="expertise__header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="expertise__tag">{t.expertise.tag}</span>
          <h2 className="expertise__title">{t.expertise.title}</h2>
          <p className="expertise__desc">{t.expertise.desc}</p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="expertise__grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {cards.map((card) => {
            const Icon = card.icon;
            const data = getExpertise(card.key);

            return (
              <motion.article
                key={card.key}
                className={`expertise__card ${card.bgClass}`}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {/* Card icon */}
                <div className="expertise__card-icon-wrapper">
                  <div className="expertise__card-icon" style={{ background: `linear-gradient(135deg, ${card.color}20, ${card.color}08)` }}>
                    <Icon size={32} style={{ color: card.color }} />
                  </div>
                </div>

                {/* Card content */}
                <h3 className="expertise__card-title">{data.title}</h3>
                <p className="expertise__card-desc">{data.desc}</p>

                {/* Features list */}
                <ul className="expertise__card-features">
                  <li>
                    <Shield size={14} />
                    {t.expertise.features.certified}
                  </li>
                  <li>
                    <Shield size={14} />
                    {t.expertise.features.rapid}
                  </li>
                  <li>
                    <Shield size={14} />
                    {t.expertise.features.guarantee}
                  </li>
                </ul>

                {/* Card CTA */}
                <div className="expertise__card-cta">
                  <Button variant="ghost" size="sm" icon={<ArrowRight size={16} />}>
                    {data.cta}
                  </Button>
                </div>

                {/* Decorative corner */}
                <div className="expertise__card-corner" />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
