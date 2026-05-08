export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface CVData {
  fullName: string;
  phone: string;
  email: string;
  address: {
    neighborhood: string;
    city: string;
    state: string;
  };
  photo?: string;
  photoConfig?: {
    scale: number;
    position: { x: number; y: number };
    crop?: { x: number; y: number };
  };
  objective: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  complementary: string[];
}
