export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

export const DEFAULT_LANGUAGE = 'de';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    news: 'News',
    download: 'Download',
    community: 'Community',
    support: 'Support',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    selectLanguage: 'Select Language',
    languageChanged: 'Language changed successfully',

    // Auth
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Your Account',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    confirmYourPassword: 'Confirm your password',
    creatingAccount: 'Creating Account...',
    signingIn: 'Signing In...',
    register: 'Register',
    login: 'Login',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',

    // Home
    welcomeTitle: 'Welcome to Rappelz',
    welcomeDescription: 'Embark on an epic journey in a world of magic and adventure. Join millions of players in this legendary MMORPG.',
    playNow: 'Play Now',
    gameFeatures: 'Game Features',
    vastWorld: 'Vast World',
    vastWorldDesc: 'Explore a massive world filled with dungeons, cities, and mysterious locations.',
    epicGuilds: 'Epic Guilds',
    epicGuildsDesc: 'Join forces with other players to create powerful guilds and alliances.',
    pvpCombat: 'PvP Combat',
    pvpCombatDesc: 'Engage in thrilling player versus player combat with unique class abilities.',
    
    // News
    latestNews: 'Latest News',
    newsDescription: 'Stay updated with the latest announcements and updates',
    viewAllNews: 'View All News',
    readMore: 'Read More',
    announcement: 'Announcement',
    gameUpdates: 'Game Updates',
    events: 'Events',
    maintenance: 'Maintenance',
    community: 'Community',
    searchNews: 'Search news...',
    noArticlesFound: 'No articles found matching your criteria.',
    
    // News Categories
    update: 'Game Updates',
    event: 'Events',
    maintenance: 'Maintenance',
    communityNews: 'Community',

    // Featured News Articles
    majorUpdateTitle: 'Major Content Update: Rise of the Ancient Dragons',
    majorUpdateContent: 'Experience epic new dungeons, powerful gear, and challenging raid bosses in our biggest update yet.\n\nThe Ancient Dragons have awakened from their millennial slumber, bringing with them powerful artifacts and forgotten magic. This major content update introduces:\n\n• 3 New High-Level Dungeons\n• Ancient Dragon Raid Boss Encounters\n• Legendary Weapon Sets\n• New Character Progression Systems\n• Enhanced Graphics and Effects\n\nPrepare yourself for the ultimate challenge as you face these legendary creatures and claim their power for your own. Team up with other players to tackle the most difficult content we\'ve ever created.\n\nThe update also includes numerous quality of life improvements, balance changes, and bug fixes to ensure the best possible gaming experience.',
    majorUpdateDate: 'March 20, 2024',
    adminTeam: 'Admin Team',
    
    newClassTitle: 'New Class Revealed: Shadow Assassin',
    newClassContent: 'Master the arts of stealth and deadly precision with our newest character class.\n\nThe Shadow Assassin brings a whole new playstyle to Rappelz, combining agility, stealth, and devastating critical strikes. This class specializes in:\n\n• Stealth Mechanics: Disappear from sight and strike from the shadows\n• Poison Systems: Apply deadly toxins that weaken and damage enemies\n• Combo Attacks: Chain together abilities for increased damage\n• Mobility Skills: Unparalleled movement abilities for positioning\n\nThe Shadow Assassin will be available with the next major update. Stay tuned for more details about skills and gameplay mechanics.',
    newClassDate: 'March 18, 2024',
    gameDesignTeam: 'Game Design Team',
    
    springEventTitle: 'Spring Festival Event Details',
    springEventContent: 'Join us for two weeks of special events, unique rewards, and festive celebrations.\n\nThe Spring Festival brings new life to the world of Rappelz with:\n\n• Daily Login Rewards\n• Special Spring-themed Cosmetics\n• Limited Time Dungeons\n• Community Events and Competitions\n• Double XP Weekends\n\nDon\'t miss out on these exclusive rewards and festivities!',
    springEventDate: 'March 15, 2024',
    eventTeam: 'Event Team',
    
    balanceUpdateTitle: 'Balance Changes and Bug Fixes',
    balanceUpdateContent: 'Important updates to class balance and various quality of life improvements.\n\nThis patch focuses on improving game balance and fixing reported issues:\n\nClass Balance:\n• Warrior: Adjusted defensive cooldowns\n• Mage: Improved mana regeneration\n• Ranger: Rebalanced critical hit mechanics\n• Summoner: Enhanced pet AI behavior\n\nBug Fixes:\n• Fixed inventory sorting issues\n• Resolved party finder disconnects\n• Corrected item tooltip information\n• Improved client stability\n\nQuality of Life:\n• Added new UI customization options\n• Improved party finder functionality\n• Enhanced minimap features',
    balanceUpdateDate: 'March 12, 2024',
    developmentTeam: 'Development Team',

    // Support
    supportCenter: 'Support Center',
    supportDescription: 'Get help with your account, technical issues, or game-related questions',
    supportAccessRestricted: 'Support Access Restricted',
    pleaseLoginToAccessSupport: 'Please sign in to access the support center and submit tickets.',
    signInToAccess: 'Sign In to Access Support',
    submitNewTicket: 'Create new Ticket',
    submitTicket: 'Submit Ticket',
    knowledgeBase: 'Knowledge Base',
    knowledgeBaseDesc: 'Browse our comprehensive guides and tutorials',
    faq: 'FAQ',
    faqDesc: 'Find answers to common questions',
    searchFAQ: 'Search FAQ...',
    category: 'Category',
    subject: 'Subject',
    message: 'Message',
    enterSubject: 'Enter subject',
    enterMessage: 'Enter your message',
    technical: 'Technical',
    account: 'Account',
    billing: 'Billing',
    gameplay: 'Gameplay',
    submitting: 'Submitting...',
    ticketSubmitted: 'Ticket submitted successfully',
    errorSubmittingTicket: 'Error submitting ticket',
    
    // FAQ
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    faqQuestion1: 'How do I reset my password?',
    faqAnswer1: 'To reset your password, click the "Forgot Password" link on the login page and follow the instructions sent to your email.',
    faqQuestion2: 'What are the system requirements?',
    faqAnswer2: 'The minimum requirements include: Windows 10, 8GB RAM, DirectX 11 compatible graphics card, and 20GB free disk space.',
    faqQuestion3: 'How do I join a guild?',
    faqAnswer3: 'You can join a guild by receiving an invitation from a guild leader or officer, or by applying to a guild through the guild finder.',
    needMoreHelp: 'Still need help? Contact our support team',
    contactSupport: 'Contact Support',

    // Download
    downloadTitle: 'Download Rappelz',
    downloadDescription: 'Choose your platform and begin your adventure',
    downloadStarted: 'Download started',
    downloadFailed: 'Failed to start download',
    noDownloadsAvailable: 'Downloads Coming Soon',
    checkBackLater: "We're preparing the downloads. Please check back later!",
    
    // System Requirements
    systemRequirements: 'System Requirements',
    minimumRequirements: 'Minimum Requirements',
    recommendedRequirements: 'Recommended Requirements',
    cpu: 'Processor',
    ram: 'Memory',
    gpu: 'Graphics Card',
    storage: 'Storage',
    network: 'Internet',
    
    // Requirements Details
    minCpu: 'Intel Core i3 or AMD equivalent',
    minRam: '4 GB RAM',
    minGpu: 'NVIDIA GeForce GTX 750 or AMD equivalent',
    minStorage: '10 GB available space',
    minNetwork: 'Broadband Internet connection',
    
    recCpu: 'Intel Core i5 or AMD equivalent',
    recRam: '8 GB RAM',
    recGpu: 'NVIDIA GeForce GTX 1060 or AMD equivalent',
    recStorage: '10 GB available space',
    recNetwork: 'Broadband Internet connection',
    
    // Download Categories
    gameClient: 'Game Client',
    gameLauncher: 'Game Launcher',
    luminaCore: 'LuminaCore',
    
    // Download Features
    secureDownload: 'Secure Download',
    secureDownloadDesc: 'All files are scanned and verified for your safety',
    globalServers: 'Global Servers',
    globalServersDesc: 'Connect to servers in your region for the best experience',
    autoUpdates: 'Auto Updates',
    autoUpdatesDesc: 'Stay up to date with automatic game updates',
    
    // Admin Downloads
    manageDownloads: 'Manage Downloads',
    uploadNewFile: 'Add New Download',
    addDownload: 'Add Download',
    addingDownload: 'Adding download...',
    downloadUrl: 'Download URL',
    fileSize: 'File Size (MB)',
    availableDownloads: 'Available Downloads',
    noDownloadsYet: 'No downloads available yet',
    editDownloadUrl: 'Edit download URL',
    openDownloadUrl: 'Open download URL',
    enterDownloadUrl: 'Enter download URL',
    downloadDeleted: 'Download deleted successfully',
    downloadAdded: 'Download added successfully',
    downloadUpdated: 'Download URL updated successfully',
    confirmDeleteFile: 'Are you sure you want to delete this download?',
    deletingDownload: 'Deleting download...',
    requiredField: 'Required field',
    cancel: 'Cancel',
    save: 'Save',

    // Footer
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    copyright: '© 2024 Rappelz. All rights reserved.',

    // Cookie Consent
    cookieMessage: 'We use cookies to enhance your gaming experience and provide personalized content. By using our website, you agree to our',
    decline: 'Decline',
    acceptAll: 'Accept All',

    // Error Messages
    somethingWentWrong: 'Something went wrong',
    tryRefreshingPage: "We're sorry for the inconvenience. Please try refreshing the page.",
    refreshPage: 'Refresh Page',
    sessionExpired: 'Your session has expired. Please sign in again.',
    networkError: 'Network error. Please check your connection.',
    
    // Loading States
    loading: 'Loading...',
    processing: 'Processing...',
    pleaseWait: 'Please wait...'
  },
  
  de: {
    // Navigation
    home: 'Startseite',
    news: 'Neuigkeiten',
    download: 'Herunterladen',
    community: 'Community',
    support: 'Support',
    signIn: 'Anmelden',
    signOut: 'Abmelden',
    selectLanguage: 'Sprache auswählen',
    languageChanged: 'Sprache erfolgreich geändert',

    // Auth
    welcomeBack: 'Willkommen zurück',
    createAccount: 'Konto erstellen',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    enterEmail: 'E-Mail-Adresse eingeben',
    enterPassword: 'Passwort eingeben',
    confirmYourPassword: 'Passwort bestätigen',
    creatingAccount: 'Konto wird erstellt...',
    signingIn: 'Anmeldung läuft...',
    register: 'Registrieren',
    login: 'Anmelden',
    dontHaveAccount: 'Noch kein Konto?',
    alreadyHaveAccount: 'Bereits ein Konto?',

    // Home
    welcomeTitle: 'Willkommen bei Rappelz',
    welcomeDescription: 'Begib dich auf eine epische Reise in eine Welt voller Magie und Abenteuer. Schließe dich Millionen von Spielern in diesem legendären MMORPG an.',
    playNow: 'Jetzt spielen',
    gameFeatures: 'Spielfeatures',
    vastWorld: 'Riesige Welt',
    vastWorldDesc: 'Erkunde eine riesige Welt voller Dungeons, Städte und mysteriöser Orte.',
    epicGuilds: 'Epische Gilden',
    epicGuildsDesc: 'Verbünde dich mit anderen Spielern, um mächtige Gilden und Allianzen zu gründen.',
    pvpCombat: 'PvP-Kämpfe',
    pvpCombatDesc: 'Erlebe spannende Spieler-gegen-Spieler-Kämpfe mit einzigartigen Klassenfähigkeiten.',

    // News
    latestNews: 'Aktuelle Neuigkeiten',
    newsDescription: 'Bleibe auf dem Laufenden mit den neuesten Ankündigungen und Updates',
    viewAllNews: 'Alle Neuigkeiten',
    readMore: 'Weiterlesen',
    announcement: 'Ankündigung',
    gameUpdates: 'Spiel-Updates',
    events: 'Events',
    maintenance: 'Wartung',
    community: 'Community',
    searchNews: 'Neuigkeiten suchen...',
    noArticlesFound: 'Keine Artikel gefunden, die deinen Kriterien entsprechen.',

    // News Categories
    update: 'Spiel-Updates',
    event: 'Events',
    maintenance: 'Wartung',
    communityNews: 'Community',

    // Featured News Articles
    majorUpdateTitle: 'Großes Content-Update: Aufstieg der Uralten Drachen',
    majorUpdateContent: 'Erlebe epische neue Dungeons, mächtige Ausrüstung und herausfordernde Raid-Bosse in unserem bisher größten Update.\n\nDie Uralten Drachen sind aus ihrem jahrtausendealten Schlummer erwacht und bringen mächtige Artefakte und vergessene Magie mit sich. Dieses große Content-Update bringt:\n\n• 3 Neue Hochstufige Dungeons\n• Begegnungen mit Uralten Drachen-Raid-Bossen\n• Legendäre Waffensets\n• Neue Charakterentwicklungssysteme\n• Verbesserte Grafik und Effekte\n\nBereite dich auf die ultimative Herausforderung vor, wenn du dich diesen legendären Kreaturen stellst und ihre Macht für dich beanspruchst. Schließe dich mit anderen Spielern zusammen, um den schwierigsten Content zu meistern, den wir je erschaffen haben.\n\nDas Update enthält auch zahlreiche Verbesserungen der Lebensqualität, Balancing-Änderungen und Fehlerbehebungen, um das bestmögliche Spielerlebnis zu gewährleisten.',
    majorUpdateDate: '20. März 2024',
    adminTeam: 'Admin-Team',

    newClassTitle: 'Neue Klasse enthüllt: Schattenassassin',
    newClassContent: 'Beherrsche die Kunst der Heimlichkeit und tödlichen Präzision mit unserer neuesten Charakterklasse.\n\nDer Schattenassassin bringt einen völlig neuen Spielstil nach Rappelz, der Beweglichkeit, Heimlichkeit und vernichtende kritische Treffer kombiniert. Diese Klasse spezialisiert sich auf:\n\n• Tarnmechaniken: Verschwinde aus der Sicht und schlage aus den Schatten zu\n• Giftsysteme: Wende tödliche Gifte an, die Gegner schwächen und Schaden zufügen\n• Komboangriffe: Verkette Fähigkeiten für erhöhten Schaden\n• Bewegungsfähigkeiten: Unübertroffene Bewegungsmöglichkeiten für die Positionierung\n\nDer Schattenassassin wird mit dem nächsten großen Update verfügbar sein. Bleib dran für weitere Details zu Fähigkeiten und Spielmechaniken.',
    newClassDate: '18. März 2024',
    gameDesignTeam: 'Spieldesign-Team',

    springEventTitle: 'Details zum Frühlingsfest-Event',
    springEventContent: 'Nimm an zwei Wochen voller besonderer Events, einzigartiger Belohnungen und festlicher Feierlichkeiten teil.\n\nDas Frühlingsfest bringt neues Leben in die Welt von Rappelz mit:\n\n• Täglichen Login-Belohnungen\n• Speziellen Frühlings-Kosmetika\n• Zeitlich begrenzten Dungeons\n• Community-Events und Wettbewerben\n• Doppel-EP-Wochenenden\n\nVerpasse nicht diese exklusiven Belohnungen und Festlichkeiten!',
    springEventDate: '15. März 2024',
    eventTeam: 'Event-Team',

    balanceUpdateTitle: 'Balance-Änderungen und Fehlerbehebungen',
    balanceUpdateContent: 'Wichtige Updates zur Klassenbalance und verschiedene Verbesserungen der Lebensqualität.\n\nDieser Patch konzentriert sich auf die Verbesserung der Spielbalance und die Behebung gemeldeter Probleme:\n\nKlassenbalance:\n• Krieger: Angepasste Verteidigungsabklingzeiten\n• Magier: Verbesserte Manaregeneration\n• Waldläufer: Neu ausbalancierte Kritische-Treffer-Mechanik\n• Beschwörer: Verbesserte Begleiter-KI\n\nFehlerbehebungen:\n• Inventarsortierungsprobleme behoben\n• Gruppensuche-Verbindungsabbrüche behoben\n• Gegenstandstooltip-Informationen korrigiert\n• Clientstabilität verbessert\n\nLebensqualität:\n• Neue UI-Anpassungsoptionen hinzugefügt\n• Gruppensuche-Funktionalität verbessert\n• Minimap-Funktionen erweitert',
    balanceUpdateDate: '12. März 2024',
    developmentTeam: 'Entwicklungsteam',

    // Support
    supportCenter: 'Support-Center',
    supportDescription: 'Erhalte Hilfe zu deinem Konto, technischen Problemen oder spielbezogenen Fragen',
    supportAccessRestricted: 'Support-Zugriff eingeschränkt',
    pleaseLoginToAccessSupport: 'Bitte melde dich an, um auf das Support-Center zuzugreifen und Tickets zu erstellen.',
    signInToAccess: 'Anmelden für Support-Zugriff',
    submitNewTicket: 'Neues Ticket erstellen',
    submitTicket: 'Ticket erstellen',
    submitTicketDesc: 'Erstelle ein neues Support-Ticket für Hilfe',
    knowledgeBase: 'Wissensdatenbank',
    knowledgeBaseDesc: 'Durchsuche unsere umfassenden Anleitungen und Tutorials',
    faq: 'FAQ',
    faqDesc: 'Finde Antworten auf häufig gestellte Fragen',
    searchFAQ: 'FAQ durchsuchen...',
    category: 'Kategorie',
    subject: 'Betreff',
    message: 'Nachricht',
    enterSubject: 'Betreff eingeben',
    enterMessage: 'Deine Nachricht eingeben',
    technical: 'Technisch',
    account: 'Konto',
    billing: 'Abrechnung',
    gameplay: 'Gameplay',
    submitting: 'Wird gesendet...',
    ticketSubmitted: 'Ticket erfolgreich gesendet',
    errorSubmittingTicket: 'Fehler beim Senden des Tickets',

    // FAQ
    frequentlyAskedQuestions: 'Häufig gestellte Fragen',
    faqQuestion1: 'Wie setze ich mein Passwort zurück?',
    faqAnswer1: 'Um dein Passwort zurückzusetzen, klicke auf den Link "Passwort vergessen" auf der Login-Seite und folge den Anweisungen, die an deine E-Mail gesendet werden.',
    faqQuestion2: 'Was sind die Systemanforderungen?',
    faqAnswer2: 'Die Mindestanforderungen sind: Windows 10, 8GB RAM, DirectX 11 kompatible Grafikkarte und 20GB freier Festplattenspeicher.',
    faqQuestion3: 'Wie trete ich einer Gilde bei?',
    faqAnswer3: 'Du kannst einer Gilde beitreten, indem du eine Einladung von einem Gildenleiter oder Offizier erhältst oder dich über die Gildensuche bei einer Gilde bewirbst.',
    needMoreHelp: 'Brauchst du weitere Hilfe? Kontaktiere unser Support-Team',
    contactSupport: 'Support kontaktieren',

    // Download
    downloadTitle: 'Rappelz herunterladen',
    downloadDescription: 'Wähle deine Plattform und beginne dein Abenteuer',
    downloadStarted: 'Download gestartet',
    downloadFailed: 'Download konnte nicht gestartet werden',
    noDownloadsAvailable: 'Downloads in Kürze verfügbar',
    checkBackLater: 'Die Downloads werden vorbereitet. Bitte schaue später wieder vorbei!',
    
    // System Requirements
    systemRequirements: 'Systemanforderungen',
    minimumRequirements: 'Mindestanforderungen',
    recommendedRequirements: 'Empfohlene Anforderungen',
    cpu: 'Prozessor',
    ram: 'Arbeitsspeicher',
    gpu: 'Grafikkarte',
    storage: 'Speicherplatz',
    network: 'Internet',
    
    // Requirements Details
    minCpu: 'Intel Core i3 oder AMD gleichwertig',
    minRam: '4 GB RAM',
    minGpu: 'NVIDIA GeForce GTX 750 oder AMD gleichwertig',
    minStorage: '10 GB freier Speicherplatz',
    minNetwork: 'Breitband-Internetverbindung',
    
    recCpu: 'Intel Core i5 oder AMD gleichwertig',
    recRam: '8 GB RAM',
    recGpu: 'NVIDIA GeForce GTX 1060 oder AMD gleichwertig',
    recStorage: '10 GB freier Speicherplatz',
    recNetwork: 'Breitband-Internetverbindung',
    
    // Download Categories
    gameClient: 'Spiel-Client',
    gameLauncher: 'Spiel-Launcher',
    luminaCore: 'LuminaCore',
    
    // Download Features
    secureDownload: 'Sicherer Download',
    secureDownloadDesc: 'Alle Dateien werden auf Sicherheit überprüft',
    globalServers: 'Globale Server',
    globalServersDesc: 'Verbinde dich mit Servern in deiner Region für das beste Spielerlebnis',
    autoUpdates: 'Automatische Updates',
    autoUpdatesDesc: 'Bleibe mit automatischen Spiel-Updates auf dem neuesten Stand',
    
    // Admin Downloads
    manageDownloads: 'Downloads verwalten',
    uploadNewFile: 'Neuen Download hinzufügen',
    addDownload: 'Download hinzufügen',
    addingDownload: 'Download wird hinzugefügt...',
    downloadUrl: 'Download-URL',
    fileSize: 'Dateigröße (MB)',
    availableDownloads: 'Verfügbare Downloads',
    noDownloadsYet: 'Noch keine Downloads verfügbar',
    editDownloadUrl: 'Download-URL bearbeiten',
    openDownloadUrl: 'Download-URL öffnen',
    enterDownloadUrl: 'Download-URL eingeben',
    downloadDeleted: 'Download erfolgreich gelöscht',
    downloadAdded: 'Download erfolgreich hinzugefügt',
    downloadUpdated: 'Download-URL erfolgreich aktualisiert',
    confirmDeleteFile: 'Möchten Sie diesen Download wirklich löschen?',
    deletingDownload: 'Download wird gelöscht...',
    requiredField: 'Pflichtfeld',
    cancel: 'Abbrechen',
    save: 'Speichern',

    // Footer
    termsOfService: 'Nutzungsbedingungen',
    privacyPolicy: 'Datenschutzerklärung',
    copyright: '© 2024 Rappelz. Alle Rechte vorbehalten.',

    // Cookie Consent
    cookieMessage: 'Wir verwenden Cookies, um dein Spielerlebnis zu verbessern und personalisierte Inhalte bereitzustellen. Durch die Nutzung unserer Website stimmst du unserer',
    decline: 'Ablehnen',
    acceptAll: 'Alle akzeptieren',

    // Error Messages
    somethingWentWrong: 'Etwas ist schiefgelaufen',
    tryRefreshingPage: 'Wir entschuldigen uns für die Unannehmlichkeiten. Bitte aktualisiere die Seite.',
    refreshPage: 'Seite aktualisieren',
    sessionExpired: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.',
    networkError: 'Netzwerkfehler. Bitte überprüfe deine Verbindung.',
    
    // Loading States
    loading: 'Lädt...',
    processing: 'Wird verarbeitet...',
    pleaseWait: 'Bitte warten...'
  }
};