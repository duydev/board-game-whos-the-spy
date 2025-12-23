import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import common from '@/locales/vi/common.json';
import setup from '@/locales/vi/pages/setup.json';
import enterNames from '@/locales/vi/pages/enterNames.json';
import discussion from '@/locales/vi/pages/discussion.json';
import voting from '@/locales/vi/pages/voting.json';
import gameResult from '@/locales/vi/pages/gameResult.json';
import rules from '@/locales/vi/pages/rules.json';
import layout from '@/locales/vi/components/layout.json';
import timer from '@/locales/vi/components/timer.json';
import playerCard from '@/locales/vi/components/playerCard.json';
import roleCard from '@/locales/vi/components/roleCard.json';
import voteResult from '@/locales/vi/components/voteResult.json';
import errors from '@/locales/vi/errors.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        common,
        'pages/setup': setup,
        'pages/enterNames': enterNames,
        'pages/discussion': discussion,
        'pages/voting': voting,
        'pages/gameResult': gameResult,
        'pages/rules': rules,
        'components/layout': layout,
        'components/timer': timer,
        'components/playerCard': playerCard,
        'components/roleCard': roleCard,
        'components/voteResult': voteResult,
        errors,
      },
    },
    fallbackLng: 'vi',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
