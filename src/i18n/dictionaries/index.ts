import { Locale } from '../config';
import de from './de.json';
import en from './en.json';
import { Dictionary } from './types';

// Verwende Type Assertion, um TypeScript mitzuteilen, dass die JSON-Dateien
// den Dictionary-Typ erfüllen
const dictionaries: Record<Locale, Dictionary> = {
  de: de as unknown as Dictionary,
  en: en as unknown as Dictionary,
};

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
export type { Dictionary };
