import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Shield, Camera, Palette, Globe, Bell, Mail, Phone, Building2, Calendar, Check, Trash2 } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { mockUser } from '../../stores/mockData';
import type { Language } from '../../types';

export default function ProfilePage() {
  const { t, lang, setLang } = useI18n();
  const [form, setForm] = useState({
    name: mockUser.name || '',
    company: mockUser.company || '',
    email: mockUser.email || '',
    phone: mockUser.phone || '',
    bio: t.profile.bio,
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<'light' | 'system'>('system');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(null);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleRemoveCover = () => {
    if (coverUrl) URL.revokeObjectURL(coverUrl);
    setCoverUrl(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.profile.title}</h1>
        <p className="text-sm text-gray-400 mt-1">{t.profile.subtitle}</p>
      </div>

      {/* Profile header card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Cover photo */}
        <div className="relative group h-24 overflow-hidden">
          {coverUrl ? (
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-orange-400 to-orange-500" />
          )}
          {/* Cover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2">
            <button
              onClick={() => coverInputRef.current?.click()}
              className="p-2 bg-white/90 hover:bg-white rounded-lg text-gray-700 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
              title={t.profile.changeCoverPhoto}
            >
              <Camera size={16} />
            </button>
            {coverUrl && (
              <button
                onClick={handleRemoveCover}
                className="p-2 bg-white/90 hover:bg-white rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                title={t.profile.removeCover}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12 mb-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 bg-orange-100 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-orange-600 font-bold text-3xl">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              {/* Avatar actions */}
              <div className="absolute -bottom-1 -right-1 flex gap-1">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  title={t.profile.changeProfilePhoto}
                >
                  <Camera size={14} />
                </button>
                {avatarUrl && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    title={t.profile.removePhoto}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 pt-2">
              <h2 className="text-xl font-bold text-gray-800">{mockUser.name}</h2>
              <p className="text-sm text-gray-400">{mockUser.company}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Building2 size={12} /> {mockUser.role}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {t.profile.memberSince} {new Date(mockUser.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-sm transition-colors shrink-0">
              <Save size={16} /> {saved ? t.profile.saved : t.profile.save}
            </motion.button>
          </div>

          {/* Bio */}
          <div className="p-4 bg-gray-50 rounded-xl mb-6">
            <p className="text-sm text-gray-600 leading-relaxed">{form.bio}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><User size={20} className="text-orange-500" /></div>
            <h2 className="text-lg font-semibold text-gray-800">{t.profile.personalInfo}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile['name']}</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile['company']}</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile['email']}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile['phone']}</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><Shield size={20} className="text-orange-500" /></div>
            <h2 className="text-lg font-semibold text-gray-800">{t.profile.changePassword}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.currentPassword}</label>
              <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.newPassword}</label>
              <input type="password" value={passwordForm.newPass} onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.profile.confirmPassword}</label>
              <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preferences row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language & Theme */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Globe size={20} className="text-orange-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{t.profile.preferences}</h2>
          </div>

          {/* Language */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">{t.profile.language}</label>
            <div className="flex gap-3">
              {(['fr', 'en'] as Language[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all ${
                    lang === l ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}>
                  {l === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
                  {lang === l && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette size={16} className="inline mr-1.5 -mt-0.5" />
              {t.profile.displayTheme}
            </label>
            <div className="flex gap-3">
              {[
                { value: 'light' as const, label: t.profile.light },
                { value: 'system' as const, label: t.profile.system },
              ].map((opt) => (
                <button key={opt.value} onClick={() => setTheme(opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border transition-all ${
                    theme === opt.value ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  {opt.label} {theme === opt.value && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Bell size={20} className="text-orange-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{t.profile.notifications}</h2>
          </div>

          <div className="space-y-4">
            {/* Email notifications toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{t.profile.emailNotifications}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.profile.emailNotificationsDesc}</p>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`relative w-11 h-6 rounded-full transition-colors ${emailNotifs ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${emailNotifs ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {/* Notification types */}
            {[t.profile.newInterventionNotif, t.profile.reminderNotif, t.profile.monthlyReportNotif].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    i === 0 ? 'bg-green-50' : i === 1 ? 'bg-orange-50' : 'bg-purple-50'
                  }`}>
                    <Bell size={16} className={`${
                      i === 0 ? 'text-green-500' : i === 1 ? 'text-orange-500' : 'text-purple-500'
                    }`} />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
                <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center bg-white">
                  <Check size={12} className="text-orange-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
