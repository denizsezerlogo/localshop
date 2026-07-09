import { createContext, useContext, useEffect, useState } from 'react';
import { tr } from './tr';
import { en } from './en';

// Hafif i18n çözümü: sözlükler düz JS modülleri, seçim localStorage'da kalıcı.
// t doğrudan aktif sözlüğün kendisidir: t.PAGE_CART, t.STOCK_LAST(3) gibi.
// React dışındaki modüller (örn. axios client) getCurrentLang/getDict kullanır.
const DICTS = { tr, en };
const STORAGE_KEY = 'lang';

let currentLang = localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'tr';

export const getCurrentLang = () => currentLang;
export const getDict = () => DICTS[currentLang];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(currentLang);

  const setLang = (next) => {
    if (!DICTS[next]) return;
    currentLang = next;
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  };

  // <html lang="..."> erişilebilirlik ve tarayıcı çevirisi için güncel tutulur
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
