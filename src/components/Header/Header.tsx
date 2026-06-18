import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useI18n } from '../../i18n';
import Button from '../Button/Button';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import logo from '../../assets/logo.svg';
import './Header.css';

interface NavItem {
  key: string;
  href: string;
}

export default function Header() {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { key: 'home', href: '#home' },
    { key: 'services', href: '#expertise' },
    { key: 'expertise', href: '#why-choose-us' },
    { key: 'contact', href: '#contact' },
    { key: 'blog', href: '#' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const getNavLabel = (key: string): string => {
    const map: Record<string, string> = {
      home: t.nav.home,
      services: t.nav.services,
      expertise: t.nav.expertise,
      contact: t.nav.contact,
      blog: t.nav.blog,
    };
    return map[key] || key;
  };

  return (
    <>
      <motion.header
        className={`header ${isScrolled ? 'header--scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="header__container">
          {/* Logo */}
          <a href="#home" className="header__logo">
            <img src={logo} alt="Hygiène Pro Services" width={200} height={60} />
          </a>

          {/* Desktop Navigation */}
          <nav className="header__nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="header__nav-link"
              >
                {getNavLabel(item.key)}
              </a>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="header__actions">
            <LanguageSwitcher />
            <Button variant="primary" size="sm">
              {t.header.cta}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="header__menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="header__mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <nav className="header__mobile-nav">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="header__mobile-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {getNavLabel(item.key)}
                  <ChevronDown size={16} className="header__mobile-link-icon" />
                </a>
              ))}
            </nav>
            <div className="header__mobile-actions">
              <LanguageSwitcher />
              <Button variant="primary" size="lg" className="header__mobile-cta">
                {t.header.cta}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
