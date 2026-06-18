import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, PhoneCall, Shield, Clock, Award, Leaf, FileCheck,
  Rat, Bug, FlaskConical, Send, Menu, X, ChevronDown, Globe,
} from 'lucide-react';
import { useI18n } from '../lib/i18n';

export default function LandingPage() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  const nav = [
    { label: t.nav.home, href: '#home', action: () => scrollTo('home') },
    { label: t.nav.services, href: '#services', action: () => scrollTo('services') },
    { label: t.nav.expertise, href: '#expertise', action: () => scrollTo('expertise') },
    { label: t.nav.blog, href: '#blog' },
    { label: t.nav.contact, href: '#contact', action: () => scrollTo('contact') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-lg">
        Aller au contenu
      </a>

      {/* ===== HEADER ===== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'h-16 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'h-20 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          <a href="#home" onClick={() => scrollTo('home')} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HP</span>
            </div>
            <span className={`font-bold text-lg transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}>Hygiène Pro</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => (
              <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); item.action?.(); }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:text-orange-500 hover:bg-orange-50' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex bg-gray-100/20 rounded-lg p-0.5">
              {(['fr', 'en'] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    lang === l ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link to="/dashboard"
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30">
              {t.nav.quote}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2 rounded-lg" onClick={() => setMobileMenu(!mobileMenu)}
            style={{ color: scrolled ? '#2D3436' : 'white' }}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenu && (
        <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 top-16 z-40 bg-white p-6 lg:hidden">
          <nav className="flex flex-col gap-2 mb-6">
            {nav.map((item) => (
              <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); item.action?.(); }}
                className="flex items-center justify-between px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-colors">
                {item.label} <ChevronDown size={16} className="text-gray-300 -rotate-90" />
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
            <Link to="/dashboard" className="w-full py-3 text-center bg-orange-500 text-white font-semibold rounded-xl shadow-lg">
              {t.nav.quote}
            </Link>
          </div>
        </motion.div>
      )}

      {/* ===== HERO ===== */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center 30%', filter: 'brightness(0.5)',
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a2e]/60" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/80 backdrop-blur-sm">
              <Shield size={12} /> Certifié Biocide
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/80 backdrop-blur-sm">
              <Clock size={12} /> Intervention 7j/7
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Éliminez Nuisibles, Virus et Bactéries.<br />
            <span className="text-orange-400">Experts Certifiés Pour Tous.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            {t.landing.heroSubtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40">
              <ArrowRight size={20} /> {t.landing.ctaPrimary}
            </Link>
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/30 hover:border-white/50 text-white font-medium rounded-xl transition-colors">
              <PhoneCall size={20} /> {t.landing.ctaSecondary}
            </a>
          </motion.div>

          {/* Trust */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="inline-flex flex-wrap items-center gap-6 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            {[
              { num: '15+', label: "Années d'expérience" },
              { num: '5000+', label: 'Clients satisfaits' },
              { num: '98%', label: 'Taux de satisfaction' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{item.num}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider">{item.label}</p>
                </div>
                {i < 2 && <div className="w-px h-10 bg-white/10 hidden sm:block" />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-9 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
          <span className="text-xs text-white/20 uppercase tracking-widest">Scroll</span>
        </motion.div>
      </section>

      {/* ===== EXPERTISE ===== */}
      <section id="services" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-500 text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
              {t.nav.services}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{t.landing.expertiseTitle}</h2>
            <p className="text-lg text-gray-400">Des solutions professionnelles pour chaque type de nuisance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">              {([
                { icon: Rat, type: 'rodent' as const, color: '#E8562A', bg: '#FFF0EA' },
                { icon: FlaskConical, type: 'disinfection' as const, color: '#27AE60', bg: '#E8F8F0' },
                { icon: Bug, type: 'insect' as const, color: '#F0A830', bg: '#FFF8E8' },
              ]).map((item, i) => {
              const Icon = item.icon;
              const descKey = `${item.type}Desc` as 'rodentDesc' | 'disinfectionDesc' | 'insectDesc';
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: item.bg }}>
                    <Icon size={32} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{t.interventions[item.type]}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{t.landing[descKey]}</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-400"><Shield size={14} style={{ color: item.color }} /> {t.landing.featureCertified}</li>
                    <li className="flex items-center gap-2 text-sm text-gray-400"><Shield size={14} style={{ color: item.color }} /> {t.landing.featureRapid}</li>
                    <li className="flex items-center gap-2 text-sm text-gray-400"><Shield size={14} style={{ color: item.color }} /> {t.landing.featureGuarantee}</li>
                  </ul>
                  <div className="pt-4 border-t border-gray-50">
                    <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">
                      {t.landing.learnMore} <ArrowRight size={16} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section id="expertise" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-500 text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
              Pourquoi Nous
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{t.landing.whyTitle}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Award, title: 'Certification Biocide', desc: 'Agréé et certifié pour l\'utilisation de produits biocides professionnels.', iconColor: '#E8562A', bg: '#FFF0EA', line: '#E8562A' },
              { icon: Clock, title: 'Intervention Rapide', desc: 'Présence sur site en moins de 24h. Intervention d\'urgence 7j/7.', iconColor: '#27AE60', bg: '#E8F8F0', line: '#27AE60' },
              { icon: Leaf, title: 'Solutions Éco-Responsables', desc: 'Solutions respectueuses de l\'environnement sans compromis sur l\'efficacité.', iconColor: '#F0A830', bg: '#FFF8E8', line: '#F0A830' },
              { icon: FileCheck, title: 'Traçabilité Complète', desc: 'Rapport d\'intervention détaillé avec photos, produits et recommandations.', iconColor: '#4F6EF7', bg: '#EEF2FF', line: '#4F6EF7' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative flex gap-5 bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative z-10 w-14 h-14 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105"
                    style={{ backgroundColor: item.bg, borderColor: item.bg }}>
                    <Icon size={28} strokeWidth={1.5} style={{ color: item.iconColor }} />
                  </div>
                  <div className="relative z-10 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"
                    style={{ backgroundColor: item.line }} />
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 bg-gray-800 rounded-2xl p-8">
            {[
              { num: '15+', label: "Années d'expertise" },
              { num: '5000+', label: 'Interventions réalisées' },
              { num: '98%', label: 'Clients satisfaits' },
              { num: '24/7', label: "Support d'urgence" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{item.num}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider mt-1">{item.label}</p>
                </div>
                {i < 3 && <div className="w-px h-12 bg-white/10 hidden sm:block" />}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== QUICK CONTACT ===== */}
      <section id="contact" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <span className="inline-block px-3 py-1 bg-orange-50 text-orange-500 text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
                Contact
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">{t.landing.contactTitle}</h2>
              <p className="text-gray-400 mb-8">{t.landing.contactSub}</p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.landing.formName}</label>
                    <input type="text" required placeholder="Jean Dupont"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.landing.formPhone}</label>
                    <input type="tel" required placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.landing.formEmail}</label>
                  <input type="email" required placeholder="jean@exemple.fr"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.landing.formMessage}</label>
                  <textarea rows={4} required placeholder="Décrivez votre situation..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none" />
                </div>
                <button type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all">
                  <Send size={18} /> {t.landing.formSubmit}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">{t.landing.infoTitle}</h3>
                <div className="space-y-4">
                  {[
                    { icon: PhoneCall, text: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
                    { icon: Send, text: 'contact@hygienepro.fr', href: 'mailto:contact@hygienepro.fr' },
                    { icon: Globe, text: 'Paris, Île-de-France' },
                    { icon: Clock, text: 'Lun-Sam: 8h-19h | Urgences 7j/7' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon size={16} className="text-orange-500" />
                        </div>
                        {item.href ? (
                          <a href={item.href} className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{item.text}</a>
                        ) : (
                          <span className="text-sm text-gray-500">{item.text}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <h4 className="text-orange-500 font-semibold mb-1">{t.landing.urgencyTitle}</h4>
                  <p className="text-sm text-gray-400 mb-3">{t.landing.urgencyDesc}</p>
                  <a href="tel:+33123456789" className="text-2xl font-bold text-gray-800 hover:text-orange-500 transition-colors">
                    {t.landing.emergencyPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-800 text-white/70">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HP</span>
                </div>
                <span className="text-white font-bold text-lg">Hygiène Pro</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Experts en dératisation, désinfection et désinsectisation. Protégez votre santé et vos espaces avec des professionnels certifiés.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                {nav.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} onClick={(e) => { e.preventDefault(); item.action?.(); }}
                      className="text-sm text-white/50 hover:text-orange-400 transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-white/50">
                  <PhoneCall size={14} className="text-orange-400" />
                  <a href="tel:+33123456789" className="hover:text-orange-400 transition-colors">+33 1 23 45 67 89</a>
                </li>
                <li className="flex items-center gap-2 text-sm text-white/50">
                  <Send size={14} className="text-orange-400" />
                  <a href="mailto:contact@hygienepro.fr" className="hover:text-orange-400 transition-colors">contact@hygienepro.fr</a>
                </li>
                <li className="flex items-center gap-2 text-sm text-white/50">
                  <Globe size={14} className="text-orange-400" />
                  Paris, Île-de-France
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Urgence ?</h4>
              <p className="text-sm text-white/50 mb-3">Besoin d'une intervention immédiate ? Notre équipe est disponible 7j/7.</p>
              <a href="tel:+33123456789" className="text-xl font-bold text-white hover:text-orange-400 transition-colors">
                +33 1 23 45 67 89
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
            <div className="flex items-center gap-4">
              <div className="flex bg-white/10 rounded-lg p-0.5">
                {(['fr', 'en'] as const).map((l) => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${lang === l ? 'bg-white text-orange-500 shadow-sm' : 'text-white/50 hover:text-white'}`}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="text-xs text-white/40">
                &copy; 2026 Hygiène Pro Services. Tous droits réservés.
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">CGV</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
