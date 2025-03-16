import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

interface DatenschutzPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function DatenschutzPage({ params }: DatenschutzPageProps) {
  // Unwrap the params Promise
  const { locale } = await params;
  await getDictionary(locale);
  
  // Get current date for the "Stand" (Last updated) field
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
        {locale === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
      </h1>
      
      <div className="prose prose-lg max-w-none">
        {locale === 'de' ? (
          // German version
          <>
            <p className="text-sm text-muted-foreground mb-8">Stand: {formattedDate}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Datenschutz auf einen Blick</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Datenerfassung auf dieser Website</h3>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">Wie erfassen wir Ihre Daten?</h4>
            <p>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
            </p>
            <p>
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
            </p>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">Wofür nutzen wir Ihre Daten?</h4>
            <p>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Hinweis zur verantwortlichen Stelle</h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p>
              Rouven Zietz<br />
              Schloss Blumenthal 1<br />
              86551 Aichach
            </p>
            <p>
              E-Mail: rz(at)rouvenzietz.de
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Hinweis zu Cookies und Tracking</h3>
            <p>
              Wir verzichten bewusst auf die Verwendung von Cookies und Tracking-Mechanismen auf dieser Website. Es werden keine Cookies gesetzt und keine Tracking-Technologien eingesetzt. Dies dient dem Schutz Ihrer Privatsphäre und ermöglicht Ihnen eine unbeobachtete Nutzung unserer Website.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="list-disc pl-5 mb-6">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p>
              Diese Daten werden nur für die technisch korrekte Auslieferung der Webseiten benötigt und nach spätestens 7 Tagen gelöscht. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
            </p>
            <p>
              Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Newsletter</h3>
            <p>
              Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind. Weitere Daten werden nicht erhoben. Diese Daten verwenden wir ausschließlich für den Versand der angeforderten Informationen und geben sie nicht an Dritte weiter.
            </p>
            <p>
              Die Verarbeitung der in das Newsletter-Anmeldeformular eingegebenen Daten erfolgt ausschließlich auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die erteilte Einwilligung zur Speicherung der Daten, der E-Mail-Adresse sowie deren Nutzung zum Versand des Newsletters können Sie jederzeit widerrufen, etwa über den &quot;Austragen&quot;-Link im Newsletter.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">SSL- bzw. TLS-Verschlüsselung</h3>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Recht auf Auskunft, Löschung, Sperrung</h3>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Recht auf Datenübertragbarkeit</h3>
            <p>
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in ein gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Widerspruchsrecht</h3>
            <p>
              Soweit wir die Verarbeitung Ihrer personenbezogenen Daten auf die Interessenabwägung stützen, haben Sie jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen.
            </p>
          </>
        ) : (
          // English version
          <>
            <p className="text-sm text-muted-foreground mb-8">Last updated: {formattedDate}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Privacy at a Glance</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">General Information</h3>
            <p>
              The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you. For detailed information on the subject of data protection, please refer to our privacy policy listed below this text.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Data Collection on This Website</h3>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">Who is responsible for data collection on this website?</h4>
            <p>
              Data processing on this website is carried out by the website operator. You can find their contact details in the imprint of this website.
            </p>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">How do we collect your data?</h4>
            <p>
              On the one hand, your data is collected when you provide it to us. This could be, for example, data that you enter in a contact form.
            </p>
            <p>
              Other data is automatically collected or collected with your consent when you visit the website by our IT systems. This is primarily technical data (e.g. internet browser, operating system, or time of page view).
            </p>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">What do we use your data for?</h4>
            <p>
              Some of the data is collected to ensure error-free provision of the website. Other data may be used to analyze your user behavior.
            </p>
            
            <h4 className="text-lg font-semibold mt-4 mb-2">What rights do you have regarding your data?</h4>
            <p>
              You have the right to receive information about the origin, recipient, and purpose of your stored personal data free of charge at any time. You also have the right to request the correction or deletion of this data. If you have given consent for data processing, you can revoke this consent at any time for the future. You also have the right to request the restriction of the processing of your personal data under certain circumstances. Furthermore, you have the right to lodge a complaint with the competent supervisory authority.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. General Information and Mandatory Information</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Data Protection</h3>
            <p>
              The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Information about the Responsible Party</h3>
            <p>
              The party responsible for data processing on this website is:
            </p>
            <p>
              Rouven Zietz<br />
              Schloss Blumenthal 1<br />
              86551 Aichach<br />
              Germany
            </p>
            <p>
              Email: rz(at)rouvenzietz.de
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Note on Cookies and Tracking</h3>
            <p>
              We deliberately refrain from using cookies and tracking mechanisms on this website. No cookies are set and no tracking technologies are used. This serves to protect your privacy and allows you to use our website unobserved.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Server Log Files</h3>
            <p>
              The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:
            </p>
            <ul className="list-disc pl-5 mb-6">
              <li>Browser type and browser version</li>
              <li>Operating system used</li>
              <li>Referrer URL</li>
              <li>Hostname of the accessing computer</li>
              <li>Time of the server request</li>
              <li>IP address</li>
            </ul>
            <p>
              This data is only needed for the technically correct delivery of the web pages and is deleted after 7 days at the latest. This data is not merged with other data sources.
            </p>
            <p>
              The collection of this data is based on Art. 6 para. 1 lit. f GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimization of his website - for this purpose, the server log files must be collected.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Contact Form</h3>
            <p>
              If you send us inquiries via the contact form, your information from the inquiry form, including the contact details you provided there, will be stored by us for the purpose of processing the inquiry and in case of follow-up questions. We do not share this data without your consent.
            </p>
            <p>
              The processing of this data is based on Art. 6 para. 1 lit. b GDPR, if your request is related to the fulfillment of a contract or is necessary for the implementation of pre-contractual measures. In all other cases, the processing is based on our legitimate interest in the effective processing of the requests addressed to us (Art. 6 para. 1 lit. f GDPR) or on your consent (Art. 6 para. 1 lit. a GDPR) if this has been requested.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Newsletter</h3>
            <p>
              If you would like to receive the newsletter offered on the website, we require an email address from you as well as information that allows us to verify that you are the owner of the specified email address and agree to receive the newsletter. No additional data is collected. We use this data exclusively for sending the requested information and do not pass it on to third parties.
            </p>
            <p>
              The processing of the data entered in the newsletter registration form is based exclusively on your consent (Art. 6 para. 1 lit. a GDPR). You can revoke your consent to the storage of the data, the email address, and their use for sending the newsletter at any time, for example via the &quot;unsubscribe&quot; link in the newsletter.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">SSL or TLS Encryption</h3>
            <p>
              This site uses SSL or TLS encryption for security reasons and to protect the transmission of confidential content. You can recognize an encrypted connection by the fact that the address line of the browser changes from &quot;http://&quot; to &quot;https://&quot; and by the lock symbol in your browser line.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Right to Information, Deletion, and Blocking</h3>
            <p>
              You have the right to receive information about your stored personal data, its origin and recipient, and the purpose of data processing free of charge at any time. You also have the right to request the correction, blocking, or deletion of this data. For this and other questions about personal data, you can contact us at any time.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Right to Data Portability</h3>
            <p>
              You have the right to have data that we process automatically on the basis of your consent or in fulfillment of a contract handed over to you or to a third party in a common, machine-readable format. If you request the direct transfer of the data to another responsible party, this will only be done to the extent that it is technically feasible.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Right to Object</h3>
            <p>
              If we base the processing of your personal data on a balancing of interests, you may object to the processing at any time for reasons arising from your particular situation.
            </p>
          </>
        )}
      </div>
    </div>
  );
} 