"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { getOptions } from '@/i18n/settings';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    ...getOptions(),
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: { useSuspense: false },
  });

export default i18n;
