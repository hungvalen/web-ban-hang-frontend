// hooks/useTranslation.js
import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, ...rest } = useI18nTranslation();
  return { t, ...rest };
};
