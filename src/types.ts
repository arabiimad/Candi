export type ContractType = 'stage' | 'alternance' | 'cdi' | 'cdd' | 'freelance';

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  title: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  overleafUser: string;
  summary: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  languages: string[];
  targetRoles: string[];
  preferredContracts: ContractType[];
  autoApplyEnabled: boolean;
  minMatchScore: number;
  preferredTemplate: 'moderncv' | 'awesome-cv' | 'clean-academic';
  updatedAt?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  contractType: ContractType;
  remote: 'total' | 'hybride' | 'sur-site';
  salary?: string;
  description: string;
  skillsRequired: string[];
  source: 'LinkedIn' | 'Indeed' | 'Welcome to the Jungle' | 'France Travail' | 'Greenhouse' | 'Direct ATS' | 'Hellowork';
  applyUrl: string;
  publishedAt: string;
  matchScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  companyLocationInfo?: {
    address?: string;
    metro?: string;
    commuteEstimate?: string;
    summary?: string;
  };
}

export interface InterviewQuestion {
  question: string;
  category: 'Technique' | 'Comportemental / Culture' | 'Projet' | 'Motivation';
  whyTheyAsk: string;
  suggestedAnswer: string;
  keyPoints: string[];
}

export interface InterviewPrepKit {
  companySynthesis: {
    summary: string;
    coreChallenges: string[];
    techStackAnticipated: string[];
    culturalValues: string[];
  };
  elevatorPitch: string;
  topQuestions: InterviewQuestion[];
  smartQuestionsToAskInterviewer: string[];
}

export type ApplicationStatus = 'detected' | 'prepared' | 'applied' | 'interview' | 'rejected' | 'offer';

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  contractType: ContractType;
  jobUrl: string;
  matchScore: number;
  status: ApplicationStatus;
  latexResumeCode: string;
  coverLetter: string;
  overleafSnippetUrl: string;
  interviewPrep?: InterviewPrepKit;
  appliedAt?: string;
  createdAt: string;
  matchedKeywords: string[];
  logEvents: { timestamp: string; message: string }[];
}

export interface AgentLog {
  id: string;
  timestamp: string;
  type: 'scan' | 'match' | 'latex' | 'apply' | 'success' | 'alert';
  message: string;
  jobTitle?: string;
  company?: string;
  score?: number;
}
