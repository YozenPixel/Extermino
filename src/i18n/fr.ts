import type { Translations } from '../types';

const fr: Translations = {
  nav: {
    home: 'Accueil',
    services: 'Services',
    expertise: 'Expertise',
    contact: 'Contact',
    blog: 'Blog',
  },
  header: {
    cta: 'Demander un Devis Gratuit',
  },
  hero: {
    title: 'Éliminez Nuisibles, Virus et Bactéries. Experts Certifiés Pour Tous.',
    subtitle: 'Experts certifiés pour la protection de votre santé et de votre environnement. Intervention rapide 7j/7 dans toute la région.',
    ctaPrimary: 'Obtenir un Diagnostic Rapide',
    ctaSecondary: 'Contactez-Nous',
    badge1: 'Certifié Biocide',
    badge2: 'Intervention 7j/7',
    trust1: "Années d'expérience",
    trust2: 'Clients satisfaits',
    trust3: 'Taux de satisfaction',
  },
  expertise: {
    title: 'Nos 3 Domaines d\'Expertise',
    tag: 'Nos Services',
    desc: 'Des solutions professionnelles pour chaque type de nuisance, adaptées à vos besoins spécifiques.',
    rodent: {
      title: 'Dératisation',
      desc: 'Élimination complète des rongeurs (rats, souris, surmulots) avec des solutions certifiées et durables. Protection de vos locaux contre les infestations.',
      cta: 'En savoir plus',
    },
    disinfection: {
      title: 'Désinfection',
      desc: 'Traitement professionnel contre les virus et bactéries. Protocoles stricts pour assainir vos espaces de vie et de travail en profondeur.',
      cta: 'En savoir plus',
    },
    insect: {
      title: 'Désinsectisation',
      desc: 'Traitement ciblé contre tous les insectes nuisibles (cafards, fourmis, punaises de lit, moustiques). Solutions adaptées à chaque situation.',
      cta: 'En savoir plus',
    },
    features: {
      certified: 'Produits certifiés',
      rapid: 'Intervention rapide',
      guarantee: 'Garantie de résultat',
    },
  },
  whyChooseUs: {
    title: 'Pourquoi Nous Choisir ?',
    tag: 'Pourquoi Nous',
    desc: 'Nous nous engageons à fournir un service d\'excellence avec des professionnels qualifiés et des solutions adaptées.',
    items: [
      {
        title: 'Certification Biocide',
        desc: 'Agréé et certifié pour l\'utilisation de produits biocides professionnels, garantissant une intervention efficace et sécurisée.',
      },
      {
        title: 'Intervention Rapide',
        desc: 'Présence sur site en moins de 24h. Intervention d\'urgence disponible 7 jours sur 7 pour les situations critiques.',
      },
      {
        title: 'Solutions Éco-Responsables',
        desc: 'Nous privilégions des solutions respectueuses de l\'environnement et de vos occupants, sans compromis sur l\'efficacité.',
      },
      {
        title: 'Traçabilité Complète',
        desc: 'Rapport d\'intervention détaillé avec photos, produits utilisés et recommandations. Transparence totale sur nos prestations.',
      },
    ],
    stats: [
      { number: '15+', label: "Années d'expertise" },
      { number: '5000+', label: 'Interventions réalisées' },
      { number: '98%', label: 'Clients satisfaits' },
      { number: '24/7', label: "Support d'urgence" },
    ],
  },
  quickContact: {
    title: 'Besoin d\'une Intervention Urgente ?',
    subtitle: 'Notre équipe vous répond sous 24h. Urgences traitées en priorité.',
    form: {
      name: 'Nom complet',
      phone: 'Numéro de téléphone',
      email: 'Adresse email',
      message: 'Décrivez votre situation...',
      submit: 'Demander un Diagnostic',
    },
    infoTitle: 'Informations',
    urgencyTitle: 'Urgence ?',
    urgencyDesc: 'Appelez notre ligne prioritaire',
    success: 'Merci ! Votre demande a été envoyée. Notre équipe vous contactera dans les plus brefs délais.',
    errorRequired: 'Ce champ est requis',
    errorEmail: 'Veuillez entrer un email valide',
    errorPhone: 'Veuillez entrer un numéro valide',
  },
  footer: {
    description: 'Experts en dératisation, désinfection et désinsectisation. Protégez votre santé et vos espaces avec des professionnels certifiés.',
    quickLinks: 'Liens Rapides',
    contact: 'Contact',
    legal: 'Mentions Légales',
    cgv: 'CGV',
    privacy: 'Politique de confidentialité',
    rights: 'Tous droits réservés.',
    urgencyTitle: 'Urgence ?',
    urgencyDesc: "Besoin d'une intervention immédiate ? Notre équipe est disponible 7j/7.",
  },
};

export default fr;
