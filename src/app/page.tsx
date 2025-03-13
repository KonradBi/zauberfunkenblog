import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

// Die API-Verbindung wurde erfolgreich getestet!
// Wir können nun zur normalen Funktionalität zurückkehren

export default function Home() {
  redirect(`/${defaultLocale}`);
}
