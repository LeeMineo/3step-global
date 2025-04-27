export const languages = ['en', 'ko', 'ja'] as const;

export const defaultNS = 'common';

export function getOptions(lang = 'ko') {
  return {
    // 번역 기본 설정
    supportedLngs: languages,
    fallbackLng: 'ko',
    lng: lang,
    ns: [defaultNS],
    defaultNS,
  };
}
