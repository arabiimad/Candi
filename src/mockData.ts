import { UserProfile, JobOffer, Application } from './types';

export const EMPTY_PROFILE: UserProfile = {
  userId: "",
  fullName: "",
  email: "",
  title: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  overleafUser: "",
  summary: "",
  skills: [],
  experiences: [],
  education: [],
  projects: [],
  languages: [],
  targetRoles: [],
  preferredContracts: ["cdi", "alternance", "stage"],
  autoApplyEnabled: false,
  minMatchScore: 80,
  preferredTemplate: "moderncv"
};

export const INITIAL_PROFILE: UserProfile = EMPTY_PROFILE;

export const INITIAL_APPLICATIONS: Application[] = [];

export const INITIAL_REAL_JOBS: JobOffer[] = [
  {
    id: "job-real-ooti",
    title: "Alternant(e) Développeur(euse) Fullstack (Python / Django & React)",
    company: "OOTI",
    location: "Paris 2ème (M° Sentier / Bourse) & Télétravail",
    contractType: "alternance",
    remote: "hybride",
    salary: "1 350€ - 1 650€ / mois + 50% Pass Navigo",
    description: "Rejoignez l'équipe tech d'OOTI (SaaS de gestion pour architectes). Vous développerez de nouvelles fonctionnalités sur l'API Python/Django et l'interface React TypeScript, avec une attention forte à la qualité et aux tests automatisés.",
    skillsRequired: ["Python", "Django", "React", "TypeScript", "PostgreSQL", "Git"],
    source: "Welcome to the Jungle",
    applyUrl: "https://www.welcometothejungle.com/fr/companies/ooti/jobs",
    publishedAt: "Publié ce matin",
    matchScore: 95,
    matchedKeywords: ["Python", "React", "TypeScript", "PostgreSQL", "Git"],
    missingKeywords: ["Django"],
    companyLocationInfo: {
      address: "18 Rue du Sentier, 75002 Paris",
      metro: "Métro Ligne 3 (Sentier) ou Ligne 8/9 (Grands Boulevards)",
      commuteEstimate: "Accessible en ~15-20 min depuis Châtelet / Gare du Nord",
      summary: "Quartier du Sentier dynamique, rooftop d'entreprise et restaurants."
    }
  },
  {
    id: "job-real-partoo",
    title: "Lead / Senior Developer (Python, FastAPI & React)",
    company: "Partoo",
    location: "Paris 9ème (M° Cadet / Notre-Dame-de-Lorette)",
    contractType: "cdi",
    remote: "hybride",
    salary: "55 000€ - 70 000€ / an + Titres Swile + BSPCE",
    description: "Conception de l'architecture micro-services pour la plateforme SaaS Partoo. Stack : Python (FastAPI, Celery workers), frontend React TypeScript, base PostgreSQL, conteneurs Docker et déploiements Kubernetes.",
    skillsRequired: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Docker", "Celery"],
    source: "Welcome to the Jungle",
    applyUrl: "https://www.welcometothejungle.com/fr/companies/partoo/jobs",
    publishedAt: "Il y a 3 heures",
    matchScore: 94,
    matchedKeywords: ["Python", "React", "TypeScript", "PostgreSQL", "Docker"],
    missingKeywords: ["FastAPI", "Celery"],
    companyLocationInfo: {
      address: "32 Rue de Trévise, 75009 Paris",
      metro: "Métro Ligne 7 (Cadet) ou Ligne 12 (Notre-Dame-de-Lorette)",
      commuteEstimate: "À 10 min de la Gare du Nord / Gare de l'Est",
      summary: "Locaux modernes au cœur du 9ème arrondissement avec cafétéria et espace chill."
    }
  },
  {
    id: "job-real-scaleway",
    title: "Full Stack Software Engineer (Python / React)",
    company: "Scaleway",
    location: "Paris 8ème (M° Franklin D. Roosevelt) & Remote flexible",
    contractType: "cdi",
    remote: "hybride",
    salary: "50 000€ - 65 000€ / an",
    description: "Développement des consoles de gestion Cloud Scaleway (Compute, Kubernetes, Object Storage). Écriture d'APIs résilientes en Python et d'interfaces web ultra-rapides en React.",
    skillsRequired: ["Python", "React", "TypeScript", "REST APIs", "Cloud Computing", "CI/CD"],
    source: "Welcome to the Jungle",
    applyUrl: "https://www.welcometothejungle.com/fr/companies/scaleway/jobs",
    publishedAt: "Il y a 4 heures",
    matchScore: 92,
    matchedKeywords: ["React", "TypeScript", "Python", "CI/CD"],
    missingKeywords: ["Cloud Computing"],
    companyLocationInfo: {
      address: "11bis Rue Roquépine, 75008 Paris",
      metro: "Métro Ligne 9 (Saint-Augustin) ou Ligne 1/9 (Franklin D. Roosevelt)",
      commuteEstimate: "Accessible en 15 min depuis Saint-Lazare",
      summary: "Siège moderne Scaleway avec laboratoire matériel et data centers haute densité."
    }
  },
  {
    id: "job-real-finovox",
    title: "Développeur Python Backend & Data (Stage 6 mois)",
    company: "Finovox",
    location: "Paris 11ème (M° Bastille / Ledru-Rollin)",
    contractType: "stage",
    remote: "hybride",
    salary: "1 300€ - 1 500€ / mois + Carte Swile",
    description: "Finovox lutte contre la fraude documentaire grâce à l'IA. Vous participerez au développement des pipelines d'analyse d'images et de métadonnées, à la création d'APIs Python et à l'optimisation des flux de détection.",
    skillsRequired: ["Python", "FastAPI", "Algorithmique", "Docker", "Git", "Computer Vision"],
    source: "Welcome to the Jungle",
    applyUrl: "https://www.welcometothejungle.com/fr/companies/finovox/jobs",
    publishedAt: "Il y a 1 jour",
    matchScore: 89,
    matchedKeywords: ["Python", "Docker", "Git"],
    missingKeywords: ["FastAPI", "Computer Vision"],
    companyLocationInfo: {
      address: "24 Rue de Lappe, 75011 Paris",
      metro: "Métro Ligne 1, 5, 8 (Bastille)",
      commuteEstimate: "Accessible en 10 min depuis Châtelet",
      summary: "Ambiance scale-up en plein cœur de Bastille, proximité immédiate de nombreux transports."
    }
  },
  {
    id: "job-real-bpifrance",
    title: "Développeur Python & IA (F/H) - Stage Fin d'Études",
    company: "Bpifrance",
    location: "Maisons-Alfort (M° Maisons-Alfort Stade) & Télétravail",
    contractType: "stage",
    remote: "hybride",
    salary: "1 400€ - 1 700€ / mois",
    description: "Au sein du pôle Data & IA de Bpifrance, vous développerez des outils de scoring et des assistants basés sur les LLMs pour automatiser l'analyse des dossiers de financement d'entreprises.",
    skillsRequired: ["Python", "LLMs", "RAG", "SQL", "Git", "Data Analysis"],
    source: "Welcome to the Jungle",
    applyUrl: "https://www.welcometothejungle.com/fr/companies/bpifrance/jobs",
    publishedAt: "Il y a 6 heures",
    matchScore: 91,
    matchedKeywords: ["Python", "SQL", "Git", "LLMs"],
    missingKeywords: ["RAG"],
    companyLocationInfo: {
      address: "27-31 Avenue du Général Leclerc, 94700 Maisons-Alfort",
      metro: "Métro Ligne 8 (Maisons-Alfort - Stade) ou RER D (Maisons-Alfort - Alfortville)",
      commuteEstimate: "18 min depuis Gare de Lyon en RER D",
      summary: "Grand campus Bpifrance avec restaurant d'entreprise, salle de sport et espaces collaboratifs."
    }
  },
  {
    id: "job-real-licorne",
    title: "Fullstack Python / React Developer (SaaS Healthtech & IA)",
    company: "Licorne Society",
    location: "Paris 10ème (M° République)",
    contractType: "cdi",
    remote: "hybride",
    salary: "48 000€ - 62 000€ / an + Equity",
    description: "Conception et accélération d'une plateforme SaaS santé innovante avec intégration de modules d'IA générative et flux de traitement temps réel en Python et React.",
    skillsRequired: ["Python", "React", "TypeScript", "FastAPI", "Docker", "LLMs"],
    source: "Welcome to the Jungle",
    applyUrl: "https://www.welcometothejungle.com/fr/companies/licorne-society/jobs",
    publishedAt: "Il y a 2 jours",
    matchScore: 93,
    matchedKeywords: ["React", "TypeScript", "Python", "Docker"],
    missingKeywords: ["FastAPI"],
    companyLocationInfo: {
      address: "Place de la République, 75010 Paris",
      metro: "Métro Lignes 3, 5, 8, 9, 11 (République)",
      commuteEstimate: "Carrefour majeur de transport parisien",
      summary: "Hub d'innovation parisien avec accès direct à 5 lignes de métro."
    }
  },
  {
    id: "job-real-doctolib",
    title: "Software Engineer Fullstack (TypeScript, React & Rails)",
    company: "Doctolib",
    location: "Levallois-Perret (M° Pont de Levallois) & Télétravail",
    contractType: "cdi",
    remote: "hybride",
    salary: "55 000€ - 70 000€ / an + Mutuelle Alan + Swile",
    description: "Rejoignez l'équipe Consultation pour concevoir les briques logicielles critiques utilisées par plus de 350 000 professionnels de santé. Forte exigence sur l'accessibilité, les temps de rendu et la tolérance aux pannes.",
    skillsRequired: ["TypeScript", "React", "Node.js", "PostgreSQL", "Tests unitaires", "Docker"],
    source: "Direct ATS",
    applyUrl: "https://careers.doctolib.fr/jobs",
    publishedAt: "Il y a 5 heures",
    matchScore: 96,
    matchedKeywords: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    missingKeywords: [],
    companyLocationInfo: {
      address: "54 Quai Charles Pasqua, 92300 Levallois-Perret",
      metro: "Métro Ligne 3 (Pont de Levallois-Bécon)",
      commuteEstimate: "Accessible en 20 min depuis Saint-Lazare",
      summary: "Campus moderne avec vue sur la Seine, cafétéria bio, salle de sport et rooftop."
    }
  },
  {
    id: "job-real-qobra",
    title: "Fullstack Engineer (React / TypeScript / Python)",
    company: "Qobra",
    location: "Paris 2ème (M° Sentier)",
    contractType: "cdi",
    remote: "hybride",
    salary: "52 000€ - 68 000€ / an",
    description: "Qobra révolutionne le calcul et la transparence des commissions commerciales. Vous créerez des interfaces de visualisation de données complexes et des moteurs de calcul distribués.",
    skillsRequired: ["React", "TypeScript", "Python", "GraphQL", "PostgreSQL", "CI/CD"],
    source: "Welcome to the Jungle",
    applyUrl: "https://www.welcometothejungle.com/fr/companies/qobra/jobs",
    publishedAt: "Il y a 1 jour",
    matchScore: 92,
    matchedKeywords: ["React", "TypeScript", "Python", "PostgreSQL", "CI/CD"],
    missingKeywords: ["GraphQL"],
    companyLocationInfo: {
      address: "Rue Réaumur, 75002 Paris",
      metro: "Métro Ligne 3 (Sentier) ou Ligne 4 (Strasbourg - Saint-Denis)",
      commuteEstimate: "En plein cœur de la Silicon Sentier",
      summary: "Locaux conviviaux avec cour intérieure arborée et équipe internationale."
    }
  },
  {
    id: "job-real-francetravail",
    title: "Développeur Web & Mobile Junior (Alternance 12-24 mois)",
    company: "France Travail Projets Numériques",
    location: "Paris 11ème (M° Voltaire / Charonne)",
    contractType: "alternance",
    remote: "hybride",
    salary: "1 200€ - 1 600€ / mois (Selon barème conventionnel)",
    description: "Poste en contrat d'apprentissage pour préparer un Titre RNCP Développeur Web ou Mastère. Développement de portails web usagers, intégration de maquettes Figma et tests de non-régression.",
    skillsRequired: ["JavaScript", "React", "HTML/CSS", "Git", "Node.js"],
    source: "France Travail",
    applyUrl: "https://candidat.francetravail.fr/offres/recherche?motsCles=developpeur+web+alternance&lieux=75D",
    publishedAt: "Il y a 12 heures",
    matchScore: 90,
    matchedKeywords: ["React", "Git", "Node.js"],
    missingKeywords: [],
    companyLocationInfo: {
      address: "Boulevard Voltaire, 75011 Paris",
      metro: "Métro Ligne 9 (Voltaire) ou Ligne 2 (Nation)",
      commuteEstimate: "15 min depuis Châtelet / Nation",
      summary: "Environnement de travail public orienté utilité citoyenne et accessibilité RGAA."
    }
  },
  {
    id: "job-real-datadog",
    title: "Software Engineer Frontend - Real-Time Observability",
    company: "Datadog",
    location: "Paris 13ème (M° Bibliothèque François Mitterrand)",
    contractType: "cdi",
    remote: "hybride",
    salary: "62 000€ - 80 000€ / an + Stocks (RSU)",
    description: "Développement des visualisations graphiques de métriques et logs haute fréquence. Optimisation du rendu Canvas/WebGL et gestion d'état réactive complexe.",
    skillsRequired: ["TypeScript", "React", "WebGL", "State Management", "Jest", "CI/CD"],
    source: "Greenhouse",
    applyUrl: "https://careers.datadoghq.com",
    publishedAt: "Aujourd'hui",
    matchScore: 91,
    matchedKeywords: ["React", "TypeScript", "CI/CD"],
    missingKeywords: ["WebGL"],
    companyLocationInfo: {
      address: "6 Rue Saint-Fargeau / Avenue de France, 75013 Paris",
      metro: "Métro Ligne 14 ou RER C (Bibliothèque François Mitterrand)",
      commuteEstimate: "À 8 min de Châtelet avec la ligne 14",
      summary: "Superbes bureaux Datadog Paris avec vue panoramique, barista et espaces tech de premier plan."
    }
  },
  {
    id: "job-real-blablacar",
    title: "Data Analyst & Analytics Engineer (Alternance Fin de Cursus)",
    company: "BlaBlaCar",
    location: "Paris 2ème (M° Bourse / Grands Boulevards)",
    contractType: "alternance",
    remote: "hybride",
    salary: "1 350€ - 1 700€ / mois + Forfait Mobilité Durable",
    description: "Participation aux analyses produit sur le covoiturage et les lignes de bus. Requêtage SQL complexe sur BigQuery, modélisation DBT et reporting Tableau.",
    skillsRequired: ["SQL", "Python", "Tableau", "BigQuery", "Git", "Statistiques"],
    source: "LinkedIn",
    applyUrl: "https://www.blablacar.com/about-us/careers",
    publishedAt: "Il y a 2 jours",
    matchScore: 88,
    matchedKeywords: ["Python", "SQL", "Git"],
    missingKeywords: ["Tableau", "BigQuery"],
    companyLocationInfo: {
      address: "84 Avenue de la République, 75011 Paris",
      metro: "Métro Ligne 3 (Parmentier) ou Ligne 9 (Saint-Ambroise)",
      commuteEstimate: "Accessible en 12 min depuis République",
      summary: "Locaux éco-conçus BlaBlaCar avec parking vélos sécurisé et terrasse."
    }
  },
  {
    id: "job-real-payfit",
    title: "Backend Software Engineer (Node.js & TypeScript)",
    company: "Payfit",
    location: "Paris 17ème (M° Pereire) & Full Remote possible",
    contractType: "cdi",
    remote: "total",
    salary: "50 000€ - 65 000€ / an",
    description: "Calcul automatisé des bulletins de paie et conformité légale en temps réel. Conception d'architectures orientées événements, micro-services Node.js et bases relationnelles robustes.",
    skillsRequired: ["TypeScript", "Node.js", "PostgreSQL", "Docker", "Event-Driven", "Jest"],
    source: "Welcome to the Jungle",
    applyUrl: "https://payfit.com/fr/carrieres",
    publishedAt: "Il y a 3 jours",
    matchScore: 93,
    matchedKeywords: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
    missingKeywords: ["Event-Driven"],
    companyLocationInfo: {
      address: "9 Boulevard Malesherbes, 75008 Paris",
      metro: "Métro Ligne 3 (Pereire) ou RER C (Pereire - Levallois)",
      commuteEstimate: "Accès direct Ligne 3 et RER C",
      summary: "Politique Work From Anywhere avec hubs collaboratifs parisiens."
    }
  }
];
