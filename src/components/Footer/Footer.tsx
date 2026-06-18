import { motion } from 'framer-motion';
import { Globe, MessageSquareShare, Share2, ScanFace, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { useI18n } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import logo from '../../assets/logo.svg';
import './Footer.css';

const socialLinks = [
  { icon: Globe, href: '#', label: 'Facebook', color: '#1877F2' },
  { icon: MessageSquareShare, href: '#', label: 'LinkedIn', color: '#0A66C2' },
  { icon: Share2, href: '#', label: 'Twitter', color: '#1DA1F2' },
  { icon: ScanFace, href: '#', label: 'Instagram', color: '#E4405F' },
];

interface QuickLink {
  label: keyof Translations['nav'] | 'legal';
  href: string;
}

const quickLinks: QuickLink[] = [
  { label: 'home', href: '#home' },
  { label: 'services', href: '#expertise' },
  { label: 'expertise', href: '#why-choose-us' },
  { label: 'contact', href: '#contact' },
  { label: 'blog', href: '#' },
  { label: 'legal', href: '#' },
];

const contactInfo = [
  { icon: Phone, text: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
  { icon: Mail, text: 'contact@hygienepro.fr', href: 'mailto:contact@hygienepro.fr' },
  { icon: MapPin, text: 'Paris, Île-de-France' },
];

export default function Footer() {
  const { t } = useI18n();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Top section with main content */}
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <img src={logo} alt="Hygiène Pro Services" className="footer__logo" />
            <p className="footer__desc">{t.footer.description}</p>
            <div className="footer__social">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="footer__social-link"
                    aria-label={social.label}
                    style={{ '--hover-bg': social.color } as React.CSSProperties}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__links">
            <h4 className="footer__heading">{t.footer.quickLinks}</h4>
            <ul className="footer__link-list">
              {quickLinks.map((link) => {
                const label = link.label === 'legal' ? t.footer.legal : t.nav[link.label];
                return (
                  <li key={link.label}>
                    <a href={link.href} className="footer__link">{label}</a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__contact">
            <h4 className="footer__heading">{t.footer.contact}</h4>
            <ul className="footer__contact-list">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="footer__contact-item">
                    <Icon size={16} className="footer__contact-icon" />
                    {item.href ? (
                      <a href={item.href} className="footer__contact-link">
                        {item.text}
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="footer__cta">
            <h4 className="footer__heading">{t.footer.urgencyTitle}</h4>
            <p className="footer__cta-text">{t.footer.urgencyDesc}</p>
            <a href="tel:+33123456789" className="footer__phone">
              +33 1 23 45 67 89
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <LanguageSwitcher />
            <span className="footer__copyright">
              &copy; {new Date().getFullYear()} Hygiène Pro Services. {t.footer.rights}
            </span>
          </div>
          <div className="footer__bottom-right">
            <a href="#" className="footer__legal-link">{t.footer.legal}</a>
            <span className="footer__separator">|</span>
            <a href="#" className="footer__legal-link">{t.footer.cgv}</a>
            <span className="footer__separator">|</span>
            <a href="#" className="footer__legal-link">{t.footer.privacy}</a>
          </div>
        </div>

        {/* Scroll to top button */}
        <motion.button
          className="footer__scroll-top"
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      </div>
    </footer>
  );
}
