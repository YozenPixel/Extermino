import { useI18n } from '../../i18n';
import type { Language } from '../../types';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const languages: Array<{ code: Language; label: string }> = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="lang-switcher" role="radiogroup" aria-label="Language selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`lang-switcher__btn ${language === lang.code ? 'lang-switcher__btn--active' : ''}`}
          onClick={() => setLanguage(lang.code)}
          role="radio"
          aria-checked={language === lang.code}
          aria-label={lang.code === 'fr' ? 'Français' : 'English'}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
