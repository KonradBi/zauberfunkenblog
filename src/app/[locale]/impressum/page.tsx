import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

interface ImpressumPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function ImpressumPage({ params }: ImpressumPageProps) {
  // Unwrap the params Promise
  const { locale } = await params;
  // Remove unused dictionary variable
  await getDictionary(locale);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
        {locale === 'de' ? 'Impressum' : 'Legal Notice'}
      </h1>
      
      <div className="prose prose-lg max-w-none">
        {locale === 'de' ? (
          // German version
          <>
            <p className="text-sm text-muted-foreground mb-8">Stand: Februar 2024</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Angaben gemäß § 5 TMG und § 55 RStV</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Verantwortlich für den Inhalt</h3>
            <p>
              Rouven Zietz<br />
              Freier Journalist<br />
              Journalistische Dienstleistungen<br />
              Schloss Blumenthal 1<br />
              86551 Aichach
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Kontakt</h3>
            <p>
              E-Mail: rz(at)rouvenzietz.de
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Berufsbezeichnung und berufsrechtliche Regelungen</h3>
            <p>
              Berufsbezeichnung: Freier Journalist<br />
              Verliehen in: Bundesrepublik Deutschland
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Mitgliedschaften</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Deutscher Journalisten-Verband (DJV)</li>
              <li>Presserat</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Redaktionell Verantwortlicher</h3>
            <p>
              Rouven Zietz<br />
              Schloss Blumenthal 1<br />
              86551 Aichach
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Umsatzsteuer-ID</h3>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              DE [Ihre USt-IdNr.]
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Journalistische Grundsätze</h2>
            <p>
              Die journalistischen Inhalte dieser Website werden nach bestem Wissen und Gewissen sowie unter Beachtung der Grundsätze des Deutschen Pressekodex erstellt. Für die Richtigkeit und Aktualität der veröffentlichten Informationen wird keine Gewähr übernommen.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a><br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
            <p>
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p>
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Bildrechte</h2>
            <p>
              Die auf dieser Website verwendeten Bilder und Grafiken unterliegen dem Urheberrecht. Die Bildrechte liegen, soweit nicht anders gekennzeichnet, bei Rouven Zietz. Eine Nutzung ohne ausdrückliche Zustimmung ist nicht gestattet.
            </p>
          </>
        ) : (
          // English version
          <>
            <p className="text-sm text-muted-foreground mb-8">Last updated: February 2024</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information according to § 5 TMG and § 55 RStV</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Responsible for content</h3>
            <p>
              Rouven Zietz<br />
              Freelance Journalist<br />
              Journalistic Services<br />
              Schloss Blumenthal 1<br />
              86551 Aichach<br />
              Germany
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Contact</h3>
            <p>
              Email: rz(at)rouvenzietz.de
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Professional title and regulations</h3>
            <p>
              Professional title: Freelance Journalist<br />
              Awarded in: Federal Republic of Germany
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Memberships</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>German Journalists Association (DJV)</li>
              <li>German Press Council</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Editorially responsible</h3>
            <p>
              Rouven Zietz<br />
              Schloss Blumenthal 1<br />
              86551 Aichach<br />
              Germany
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">VAT ID</h3>
            <p>
              VAT identification number according to § 27 a of the German VAT law:<br />
              DE [VAT ID No.]
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Journalistic principles</h2>
            <p>
              The journalistic content of this website is created to the best of our knowledge and belief and in compliance with the principles of the German Press Code. No guarantee is given for the accuracy and timeliness of the published information.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">EU dispute resolution</h2>
            <p>
              The European Commission provides a platform for online dispute resolution (OS): <a href="https://ec.europa.eu/consumers/odr/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a><br />
              You can find our email address in the legal notice above.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Consumer dispute resolution/universal arbitration board</h2>
            <p>
              We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Liability for content</h2>
            <p>
              As a service provider, we are responsible for our own content on these pages in accordance with § 7 paragraph 1 TMG under the general laws. According to §§ 8 to 10 TMG, however, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
            </p>
            <p>
              Obligations to remove or block the use of information under the general laws remain unaffected. However, liability in this regard is only possible from the point in time at which a concrete legal violation becomes known. If we become aware of any such legal violations, we will remove the relevant content immediately.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Liability for links</h2>
            <p>
              Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking.
            </p>
            <p>
              However, a permanent control of the contents of the linked pages is not reasonable without concrete evidence of a violation of law. If we become aware of any legal violations, we will remove such links immediately.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Copyright</h2>
            <p>
              The content and works created by the site operators on these pages are subject to German copyright law. The reproduction, editing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
            </p>
            <p>
              Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. If we become aware of any infringements, we will remove such content immediately.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Image rights</h2>
            <p>
              The images and graphics used on this website are subject to copyright. The image rights belong to Rouven Zietz, unless otherwise indicated. Use without express permission is not permitted.
            </p>
          </>
        )}
      </div>
    </div>
  );
} 