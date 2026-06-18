import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Award,
  Clock,
  Leaf,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { useI18n } from '../../i18n';
import './WhyChooseUs.css';

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  'Biocide Certification': Award,
  'Certification Biocide': Award,
  'Rapid Response': Clock,
  'Intervention Rapide': Clock,
  'Eco-Friendly Solutions': Leaf,
  'Solutions Éco-Responsables': Leaf,
  'Complete Traceability': FileCheck,
  'Traçabilité Complète': FileCheck,
};

const itemColors = [
  { bg: '#FFF0EA', icon: '#E8562A', border: 'rgba(232, 86, 42, 0.15)' },
  { bg: '#E8F8F0', icon: '#27AE60', border: 'rgba(39, 174, 96, 0.15)' },
  { bg: '#FFF8E8', icon: '#F0A830', border: 'rgba(240, 168, 48, 0.15)' },
  { bg: '#EEF2FF', icon: '#4F6EF7', border: 'rgba(79, 110, 247, 0.15)' },
];

export default function WhyChooseUs() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  const getIcon = (title: string) => {
    const Icon = iconMap[title];
    return Icon || CheckCircle2;
  };

  return (
    <section id="why-choose-us" className="why-choose-us" ref={sectionRef}>
      <div className="why-choose-us__container">
        {/* Section header */}
        <motion.div
          className="why-choose-us__header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="why-choose-us__tag">{t.whyChooseUs.tag}</span>
          <h2 className="why-choose-us__title">{t.whyChooseUs.title}</h2>
          <p className="why-choose-us__desc">{t.whyChooseUs.desc}</p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="why-choose-us__grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {t.whyChooseUs.items.map((item: { title: string; desc: string }, index: number) => {
            const Icon = getIcon(item.title);
            const colors = itemColors[index];

            return (
              <motion.div
                key={item.title}
                className="why-choose-us__card"
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div
                  className="why-choose-us__card-icon"
                  style={{ background: colors.bg, borderColor: colors.border }}
                >
                  <div style={{ color: colors.icon }}><Icon size={28} strokeWidth={1.5} /></div>
                </div>

                <div className="why-choose-us__card-content">
                  <h3 className="why-choose-us__card-title">{item.title}</h3>
                  <p className="why-choose-us__card-desc">{item.desc}</p>
                </div>

                {/* Hover indicator line */}
                <div
                  className="why-choose-us__card-line"
                  style={{ background: colors.icon }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats banner */}
        <motion.div
          className="why-choose-us__stats"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {t.whyChooseUs.stats.map((stat: { number: string; label: string }, index: number) => (
            <div key={index} className="why-choose-us__stat">
              <span className="why-choose-us__stat-number">{stat.number}</span>
              <span className="why-choose-us__stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
