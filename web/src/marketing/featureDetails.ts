/**
 * Fuldt indhold til dedikerede feature-undersider (/funktioner/:slug).
 *
 * Hver slug matcher en FeatureCard. SEO-felterne her er kilden både til
 * client-side <head> (FeatureDetailPage) og den Netlify Edge-funktion der
 * indsætter meta-tags server-side for link-forhåndsvisninger. Husk at holde
 * dem i sync med netlify/edge-functions/featureSeo.ts hvis du ændrer dem.
 */

export type FeatureFaq = {
  q: string
  a: string
}

export type FeatureBenefit = {
  title: string
  body: string
}

export type FeatureDetail = {
  slug: string
  /** Overskrift i hero — må gerne være længere end card-titlen. */
  headline: string
  /** Kort label over hero (fx "Faktura & kunder"). */
  eyebrow: string
  /** Intro-paragraf under hero. */
  intro: string
  /** 3-4 benefit-blokke i grid. */
  benefits: FeatureBenefit[]
  /** Korte "check"-punkter i venstre kolonne af split-sektion. */
  bullets: string[]
  /** Længere forklarende paragraf under bullets. */
  body: string
  /** Etiket over mini-mockup i højre side af split-sektionen. */
  mockupLabel: string
  /** FAQ under content — godt til long-tail SEO. */
  faq: FeatureFaq[]
  /** SEO — bruges både client-side og i edge-funktion. */
  seo: {
    title: string
    description: string
    keywords?: string
  }
}

export const FEATURE_DETAILS: Record<string, FeatureDetail> = {
  fakturering: {
    slug: 'fakturering',
    eyebrow: 'Faktura & kunder',
    headline: 'Send fakturaer der ser professionelle ud — på sekunder',
    intro:
      'Opret fakturaer med korrekt moms, forfaldsdato og fortløbende numre. CVR-opslag udfylder kundedata automatisk, og PDF’en sendes direkte til kundens e-mail. Alt lever op til den danske bogføringslov.',
    benefits: [
      {
        title: 'Fortløbende numre uden fejl',
        body: 'Bilago tildeler automatisk næste fakturanummer pr. virksomhed, så du aldrig springer en linje over eller laver dubletter.',
      },
      {
        title: 'Dansk moms indbygget',
        body: '25 %, 0 % og momsfri linjer håndteres korrekt. Totaler beregnes automatisk, og momsbeløb vises både på linje og i bund.',
      },
      {
        title: 'PDF klar til kunden',
        body: 'Professionel faktura-PDF med dit logo, betalingsoplysninger og referencenummer — klar til at sende eller downloade.',
      },
      {
        title: 'Status på ét overblik',
        body: 'Se hvilke fakturaer der er sendt, betalt eller forsinket direkte i listen. Påmindelser kan sendes med ét klik.',
      },
    ],
    bullets: [
      'Tilpas virksomhedsoplysninger og logo',
      'Automatisk moms og forfaldsdato',
      'Kreditnotaer med negativ linje-beløb',
      'Send direkte fra Bilago eller download PDF',
    ],
    body: 'Fakturering i Bilago er bygget til dansk hverdag. Du opretter en faktura, vælger kunde fra CVR-opslaget, tilføjer linjer med moms — og er færdig på under et minut. Bilago gemmer hver udgave i bogføringsregisteret, så du altid kan trække den frem igen ved revision.',
    mockupLabel: 'Eksempel',
    faq: [
      {
        q: 'Kan jeg sende fakturaer som EAN?',
        a: 'Ja. Du kan skrive EAN-nummeret på kunden, og Bilago genererer en OIOUBL-kompatibel version til brug mod offentlige kunder. Direkte NemHandel-integration kommer senere.',
      },
      {
        q: 'Hvad sker der hvis jeg sletter en faktura?',
        a: 'Sendte fakturaer kan ikke slettes — kun krediteres. Det følger bogføringsloven. Du kan lave en kreditnota med negative beløb, som sendes til kunden ligesom en normal faktura.',
      },
      {
        q: 'Bliver fakturaerne gemt i de påkrævede 5 år?',
        a: 'Ja. Bilago opbevarer alle dine fakturaer digitalt i mindst 5 regnskabsår, som bogføringsloven kræver. Du kan altid hente PDF og JSON-data ud.',
      },
      {
        q: 'Kan jeg tilføje flere momssatser på samme faktura?',
        a: 'Ja. Hver linje kan have sin egen momssats (25 %, 0 % eller momsfri), og Bilago summerer korrekt i bunden pr. sats.',
      },
    ],
    seo: {
      title: 'Fakturering — dansk fakturaprogram med moms og CVR',
      description:
        'Opret og send danske fakturaer med korrekt moms, forfaldsdato og fortløbende numre. CVR-opslag, PDF, kreditnotaer — bygget til dansk bogføringslov.',
      keywords:
        'fakturering, faktura program, dansk faktura, CVR opslag, moms, fortløbende numre, EAN faktura, kreditnota',
    },
  },
  bilag: {
    slug: 'bilag',
    eyebrow: 'Udgifter & bilag',
    headline: 'Upload kvitteringer og hold styr på dine udgifter',
    intro:
      'Drop skuffen med gamle kvitteringer. Upload et billede fra telefonen eller en PDF fra e-mailen, placér det på rette konto — og det er bogført i overensstemmelse med bogføringsloven.',
    benefits: [
      {
        title: 'Scan fra telefonen',
        body: 'Tag billede af kvitteringen med din telefon — Bilago gemmer det som digitalt bilag med tidsstempel og kan læses igen om 5 år.',
      },
      {
        title: 'PDF fra e-mail',
        body: 'Træk PDF-kvitteringer direkte ind i Bilago. Vi understøtter både kvitterings-PDF’er og indscannede billeder.',
      },
      {
        title: 'Kategoriseret pr. konto',
        body: 'Vælg kontoen (fx software, rejser, materialer) og Bilago holder styr på moms og bogføring for dig.',
      },
      {
        title: 'Altid klar til revisor',
        body: 'Alle bilag ligger digitalt og søgbart. Din bogholder eller revisor kan inviteres direkte og tilgå samme data.',
      },
    ],
    bullets: [
      'Upload billede eller PDF',
      'Moms trækkes fra automatisk',
      'Opbevaring der følger bogføringsloven',
      'Eksport til revisor med ét klik',
    ],
    body: 'Bilag er et af de steder hvor mindre virksomheder typisk bruger mest tid — og laver flest fejl. Bilago gør det simpelt: upload, vælg konto, færdig. Købsmomsen bogføres automatisk, og du kan altid finde bilaget igen via fritekstsøgning.',
    mockupLabel: 'Bilagsarkiv',
    faq: [
      {
        q: 'Hvor længe opbevares mine bilag?',
        a: 'Mindst 5 regnskabsår, som bogføringsloven kræver. Du kan altid downloade dem ud — enten enkeltvis som PDF eller samlet som zip.',
      },
      {
        q: 'Kan jeg uploade flere bilag ad gangen?',
        a: 'Ja. Du kan drag-and-drop flere filer samtidig. Hver fil bliver et separat bilag, som du kategoriserer individuelt.',
      },
      {
        q: 'Understøtter I automatisk læsning af kvitteringer (OCR)?',
        a: 'OCR på beløb, dato og leverandør er på vej. I dag skriver du tallene selv — det tager typisk under 10 sekunder pr. bilag.',
      },
      {
        q: 'Kan min bogholder se bilagene?',
        a: 'Ja. Invitér hende som medlem på virksomheden med læse-rettigheder, og hun har samme adgang til bilagsarkivet som du selv har.',
      },
    ],
    seo: {
      title: 'Bilag — digital kvittering og udgiftsbogføring',
      description:
        'Scan kvitteringer og upload PDF-bilag direkte i Bilago. Momsen trækkes automatisk fra, og alt opbevares digitalt efter bogføringsloven.',
      keywords:
        'bilag, kvitteringer, udgiftsbogføring, scan bilag, digital kvittering, bogføringslov, købsmoms',
    },
  },
  'bank-afstemning': {
    slug: 'bank-afstemning',
    eyebrow: 'Bank',
    headline: 'Afstem banken på få minutter — uden Excel',
    intro:
      'Importér dit kontoudtog som CSV fra din bank, og Bilago foreslår matches mod dine fakturaer og bilag. Du godkender — systemet bogfører. Perfekt til månedsafslutning uden stress.',
    benefits: [
      {
        title: 'CSV fra danske banker',
        body: 'Importér direkte fra Danske Bank, Nordea, Jyske Bank, Spar Nord og de fleste andre. Træk bare filen ind.',
      },
      {
        title: 'Auto-match på beløb og reference',
        body: 'Bilago finder den mest sandsynlige faktura eller bilag for hver linje. Du ser forslaget og godkender eller vælger manuelt.',
      },
      {
        title: 'Færre fejl ved månedsafslutning',
        body: 'Fordi matchene laves løbende, forsvinder den sædvanlige "jeg ved ikke hvad denne indbetaling er"-situation.',
      },
      {
        title: 'Klar bogføring til revisor',
        body: 'Hver match bliver en bogført postering. Ved årsafslutning er banken afstemt — ingen efterarbejde.',
      },
    ],
    bullets: [
      'CSV-import fra danske banker',
      'Match på beløb og reference',
      'Manuelt match når auto-match er usikker',
      'Status: matchet, foreslået, afventer',
    ],
    body: 'Bank-afstemning er ofte det mest tidskrævende ved manuel bogføring — især hvis du har mange småbeløb. Bilago samler hele flowet: importér, se forslag, godkend. Du sparer timer hver måned og kommer i mål uden fejl.',
    mockupLabel: 'Bankafstemning',
    faq: [
      {
        q: 'Hvornår er bank-afstemning klar?',
        a: 'Vi åbner CSV-import i løbet af Q2 2026. Skriv dig op til ventelisten, så får du besked så snart det er klart til dig.',
      },
      {
        q: 'Understøtter I PSD2/open banking?',
        a: 'Vores første version kører på CSV-import fordi det dækker alle danske banker. Direkte bank-integration via PSD2 kommer senere.',
      },
      {
        q: 'Hvad hvis auto-match foreslår forkert?',
        a: 'Du kan altid vælge manuelt blandt dine åbne fakturaer og bilag. Bilago lærer af dine valg og bliver mere præcis over tid.',
      },
    ],
    seo: {
      title: 'Bank-afstemning — match banken mod fakturaer automatisk',
      description:
        'Importér kontoudtog som CSV fra danske banker og lad Bilago matche linjerne mod dine fakturaer og bilag. Ingen Excel, færre fejl ved månedsafslutning.',
      keywords:
        'bank afstemning, CSV import, danske banker, kontoudtog, bogføring, månedsafslutning, PSD2',
    },
  },
  'cvr-opslag': {
    slug: 'cvr-opslag',
    eyebrow: 'Kunder',
    headline: 'Slå kunder op via CVR — ingen copy-paste',
    intro:
      'Skriv CVR-nummeret, og Bilago henter navn, adresse, branchekode og status direkte fra Virk.dk. Kunden oprettes med korrekte data på sekunder — klar til fakturering.',
    benefits: [
      {
        title: 'Data direkte fra Virk.dk',
        body: 'Officielle data fra Erhvervsstyrelsens register. Intet copy-paste, ingen stavefejl i kundens navn eller adresse.',
      },
      {
        title: 'Status og branche med',
        body: 'Se om virksomheden er aktiv, under likvidation eller ophørt — før du sender fakturaen og risikerer at brænde inde med pengene.',
      },
      {
        title: 'Adresse klar til fakturaen',
        body: 'Postadresse og by udfyldes automatisk og bruges direkte på fakturaens adressefelt.',
      },
      {
        title: 'Gratis i Bilago',
        body: 'CVR-opslaget koster ikke ekstra. Du kan slå så mange kunder op du vil — også udenfor fakturering-flowet.',
      },
    ],
    bullets: [
      'Officielle data fra Virk.dk',
      'Autoudfyldning af kundeformular',
      'Status: aktiv, ophørt, under konkurs',
      'Branchekode og P-nummer',
    ],
    body: 'CVR-opslaget er måske den mindste feature i Bilago — men en af dem brugere siger de elsker mest. Det fjerner alle de små fejl der sniger sig ind når man skriver kundedata af fra en hjemmeside eller visitkort.',
    mockupLabel: 'CVR-opslag',
    faq: [
      {
        q: 'Er data fra Virk.dk altid opdateret?',
        a: 'Vi henter live fra Erhvervsstyrelsens API når du slår op, så data er så friske som muligt. Erhvervsstyrelsen opdaterer selv registret dagligt.',
      },
      {
        q: 'Kan jeg slå udenlandske virksomheder op?',
        a: 'Nej — CVR dækker kun danske virksomheder. Udenlandske kunder kan oprettes manuelt med VAT-nummer.',
      },
      {
        q: 'Bliver opslaget logget?',
        a: 'Nej. Vi sender opslaget til Virk.dk og viser dig resultatet, men gemmer ikke din opslagshistorik.',
      },
    ],
    seo: {
      title: 'CVR-opslag — udfyld kundedata automatisk',
      description:
        'Slå danske kunder op via CVR-nummer og få navn, adresse og status direkte fra Virk.dk. Indbygget gratis i Bilago — klar til fakturering.',
      keywords:
        'CVR opslag, Virk.dk, kundeoprettelse, dansk CVR, autoudfyldning, fakturering',
    },
  },
  'moms-rapporter': {
    slug: 'moms-rapporter',
    eyebrow: 'Moms',
    headline: 'Moms og rapporter — uden regneark',
    intro:
      'Se salgsmoms, købsmoms og tilsvar pr. periode direkte i Bilago. Tal der matcher dine fakturaer og bilag linje for linje. Indberetning til SKAT direkte fra appen kommer snart.',
    benefits: [
      {
        title: 'Moms pr. periode',
        body: 'Månedsvis, kvartalsvis eller halvårligt — vælg den periode der matcher din momsafregning, og se opgørelsen med det samme.',
      },
      {
        title: 'Bogførte linjer i bund',
        body: 'Klik på et tal og se de underliggende fakturaer og bilag. Intet sort boks — du kan altid spore tilbage til kilden.',
      },
      {
        title: 'Eksport til SKAT',
        body: 'Eksportér en CSV der matcher SKAT’s indberetning, så du kan klippe tallene direkte ind på Tastselv.',
      },
      {
        title: 'SKAT-indberetning (snart)',
        body: 'Vi arbejder på direkte indberetning med NemID/MitID, så du kan indberette uden at logge ind på Tastselv.',
      },
    ],
    bullets: [
      'Salgsmoms og købsmoms pr. periode',
      'Drill-down til linje-niveau',
      'CSV-eksport klar til Tastselv',
      'Automatisk korrekt dansk momssats',
    ],
    body: 'Moms er der hvor de fleste små fejl bliver dyre. Bilago samler alt hvad der er bogført i perioden, beregner tilsvaret, og viser dig præcis hvilke linjer der tæller med. Ingen regneark, ingen krydstjek manuelt.',
    mockupLabel: 'Momsopgørelse',
    faq: [
      {
        q: 'Hvornår kan jeg indberette direkte fra Bilago?',
        a: 'Vi arbejder på direkte integration med SKAT via MitID Erhverv. Målet er Q3 2026. Indtil da kan du eksportere CSV og indtaste på Tastselv.',
      },
      {
        q: 'Kan jeg se tidligere momsperioder?',
        a: 'Ja. Alle dine momsopgørelser gemmes, så du kan gå tilbage og se hvad der blev indberettet for fx 2. kvartal 2025.',
      },
      {
        q: 'Hvad hvis en faktura bliver krediteret efter momsafregning?',
        a: 'Kreditnotaen bogføres i den periode den udstedes, og du får negativ salgsmoms på den næste opgørelse — ligesom det skal være.',
      },
    ],
    seo: {
      title: 'Moms og rapporter — dansk momsopgørelse pr. periode',
      description:
        'Salgsmoms, købsmoms og tilsvar pr. periode — med drill-down til de fakturaer og bilag der ligger bag. Eksport klar til SKAT’s Tastselv.',
      keywords:
        'moms, momsopgørelse, salgsmoms, købsmoms, SKAT, Tastselv, dansk moms, momsindberetning',
    },
  },
  'medlemmer-roller': {
    slug: 'medlemmer-roller',
    eyebrow: 'Samarbejde',
    headline: 'Invitér bogholder eller partner — og styr rollerne',
    intro:
      'Giv din bogholder, revisor eller forretningspartner adgang til virksomheden i Bilago. Du bestemmer hvem der kan læse, redigere eller administrere — og kan fjerne adgang når som helst.',
    benefits: [
      {
        title: 'Invitér via e-mail',
        body: 'Skriv modtagerens e-mail og send invitationen. De får et link, opretter en konto, og er inde i din virksomhed.',
      },
      {
        title: 'Roller med klare grænser',
        body: 'Ejer, administrator, bogholder, læser. Hver rolle ser kun det de skal — din bogholder behøver ikke se team-settings.',
      },
      {
        title: 'Flere virksomheder pr. konto',
        body: 'Har du to ApS’er? Opret dem begge og skift mellem dem i menuen. Hver virksomhed har sit eget team og sine egne tal.',
      },
      {
        title: 'Historik på ændringer',
        body: 'Alle ændringer logges med tidsstempel og bruger — perfekt til revisor-sporbarhed og til at finde "hvem gjorde det der?".',
      },
    ],
    bullets: [
      'Invitér via e-mail',
      'Ejer / admin / bogholder / læser',
      'Fjern adgang når som helst',
      'Aktivitetslog pr. virksomhed',
    ],
    body: 'Bilago er bygget til at mindre virksomheder samarbejder — med bogholder, revisor eller forretningspartner. Roller og rettigheder betyder at alle får adgang til det de skal bruge, uden at du mister kontrol.',
    mockupLabel: 'Medlemmer',
    faq: [
      {
        q: 'Koster det ekstra at tilføje medlemmer?',
        a: 'Nej. Du kan invitere så mange medlemmer som du vil uden ekstra betaling — din bogholder tæller også med.',
      },
      {
        q: 'Kan min bogholder have adgang uden at være i vores virksomhed?',
        a: 'Ja. Bogholder-rollen er lavet specifikt til eksterne — de kan se og bogføre, men ikke ændre virksomhedsindstillinger.',
      },
      {
        q: 'Hvordan fjerner jeg et medlem?',
        a: 'Gå til Medlemmer, klik på personen, og fjern adgangen. De kan ikke længere se data — men deres tidligere handlinger er stadig i aktivitetsloggen.',
      },
      {
        q: 'Kan én person være med i flere virksomheder?',
        a: 'Ja. Én konto kan være medlem af vilkårligt mange virksomheder. Det er ideelt for bogholdere der har mange kunder.',
      },
    ],
    seo: {
      title: 'Medlemmer og roller — invitér bogholder og styr adgang',
      description:
        'Invitér bogholder, revisor eller partner som medlem i din Bilago-virksomhed. Roller og rettigheder sikrer at alle ser præcis det de skal — intet mere.',
      keywords:
        'medlemmer, roller, adgang, bogholder invitation, regnskabssamarbejde, revisor adgang',
    },
  },
}

export function getFeatureDetail(slug: string): FeatureDetail | null {
  return FEATURE_DETAILS[slug] ?? null
}

export const FEATURE_SLUGS = Object.keys(FEATURE_DETAILS)
