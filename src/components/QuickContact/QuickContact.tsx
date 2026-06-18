import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n';
import Button from '../Button/Button';
import './QuickContact.css';

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const infoItems = [
  { icon: Phone, text: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
  { icon: Mail, text: 'contact@hygienepro.fr', href: 'mailto:contact@hygienepro.fr' },
  { icon: MapPin, text: 'Paris, Île-de-France' },
  { icon: Clock, text: 'Lun-Sam: 8h-19h | Urgences 7j/7' },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s+\-()]{6,20}$/;

export default function QuickContact() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.quickContact.errorRequired;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.quickContact.errorRequired;
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = t.quickContact.errorPhone;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.quickContact.errorRequired;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = t.quickContact.errorEmail;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.quickContact.errorRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setErrors({});
    }, 5000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  const inputClass = (fieldName: keyof FormErrors, base: string) =>
    `${base} ${errors[fieldName] ? `${base}--error` : ''}`;

  return (
    <section id="contact" className="quick-contact" ref={sectionRef}>
      <div className="quick-contact__container">
        <motion.div
          className="quick-contact__layout"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Left: Info & Form */}
          <div className="quick-contact__main">
            {/* Header */}
            <motion.div className="quick-contact__header" variants={itemVariants}>
              <span className="quick-contact__tag">Contact</span>
              <h2 className="quick-contact__title">{t.quickContact.title}</h2>
              <p className="quick-contact__subtitle">{t.quickContact.subtitle}</p>
            </motion.div>

            {/* Success message */}
            {isSubmitted && (
              <motion.div
                className="quick-contact__success"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle2 size={24} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                <span>{t.quickContact.success}</span>
              </motion.div>
            )}

            {/* Form */}
            <motion.form
              className="quick-contact__form"
              variants={itemVariants}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="quick-contact__form-row">
                <div className="quick-contact__field">
                  <label htmlFor="name" className="quick-contact__label">
                    {t.quickContact.form.name}
                  </label>
                  <div className="quick-contact__input-wrapper">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={inputClass('name', 'quick-contact__input')}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <AlertCircle size={16} className="quick-contact__input-icon" />}
                  </div>
                  {errors.name && <span id="name-error" className="quick-contact__error">{errors.name}</span>}
                </div>
                <div className="quick-contact__field">
                  <label htmlFor="phone" className="quick-contact__label">
                    {t.quickContact.form.phone}
                  </label>
                  <div className="quick-contact__input-wrapper">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={inputClass('phone', 'quick-contact__input')}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 12 34 56 78"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && <AlertCircle size={16} className="quick-contact__input-icon" />}
                  </div>
                  {errors.phone && <span id="phone-error" className="quick-contact__error">{errors.phone}</span>}
                </div>
              </div>
              <div className="quick-contact__field">
                <label htmlFor="email" className="quick-contact__label">
                  {t.quickContact.form.email}
                </label>
                <div className="quick-contact__input-wrapper">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={inputClass('email', 'quick-contact__input')}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean@exemple.fr"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <AlertCircle size={16} className="quick-contact__input-icon" />}
                </div>
                {errors.email && <span id="email-error" className="quick-contact__error">{errors.email}</span>}
              </div>
              <div className="quick-contact__field">
                <label htmlFor="message" className="quick-contact__label">
                  {t.quickContact.form.message}
                </label>
                <div className="quick-contact__input-wrapper">
                  <textarea
                    id="message"
                    name="message"
                    className={inputClass('message', 'quick-contact__textarea')}
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t.quickContact.form.message}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                </div>
                {errors.message && <span id="message-error" className="quick-contact__error">{errors.message}</span>}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={<Send size={18} />}
                className="quick-contact__submit"
              >
                {t.quickContact.form.submit}
              </Button>
            </motion.form>
          </div>

          {/* Right: Contact Info */}
          <motion.div className="quick-contact__info" variants={itemVariants}>
            <div className="quick-contact__info-card">
              <h3 className="quick-contact__info-title">{t.quickContact.infoTitle}</h3>
              <ul className="quick-contact__info-list">
                {infoItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index} className="quick-contact__info-item">
                      <div className="quick-contact__info-icon">
                        <Icon size={18} />
                      </div>
                      {item.href ? (
                        <a href={item.href} className="quick-contact__info-link">
                          {item.text}
                        </a>
                      ) : (
                        <span className="quick-contact__info-text">{item.text}</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="quick-contact__info-urgency">
                <h4>{t.quickContact.urgencyTitle}</h4>
                <p>{t.quickContact.urgencyDesc}</p>
                <a href="tel:+33123456789" className="quick-contact__info-phone">
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
