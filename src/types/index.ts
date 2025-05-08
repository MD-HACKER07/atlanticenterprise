export interface Internship {
  id: string;
  title: string;
  department: string;
  duration: string;
  stipend?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  applicationDeadline: string;
  startDate: string;
  location: string;
  remote: boolean;
  featured: boolean;
  applicationFee?: number;
  termsAndConditions?: string[];
  paymentRequired?: boolean;
  createdBy?: string;
  createdAt?: string;
  acceptsCoupon?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  testimonial: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  founded: string;
  location: string;
  team: TeamMember[];
  contact?: {
    email: string;
    phone: string;
    website: string;
  };
  legalInfo?: {
    gst: string;
    pan: string;
  };
  vision?: string;
  mission?: string;
  strengths?: string[];
  productCategories?: string[];
  promotion?: {
    enabled: boolean;
    message: string;
    deadline: string; // ISO date string format
    ctaText?: string; // Call to action text
    ctaLink?: string; // Call to action link
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  education: string;
  resume: File | null;
  coverLetter: string;
  internshipId: string;
  college?: string;
  city?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  skills?: string[];
  hearAboutUs?: string;
}

export interface InternshipApplication {
  id: string;
  applicationId: string;
  internshipId: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  college?: string;
  city?: string;
  skills: string[];
  experience?: string;
  message: string;
  resumeUrl?: string;
  resumeFileName?: string;
  linkedInProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'interviewing';
  paymentStatus?: 'unpaid' | 'paid' | 'waived';
  paymentId?: string;
  paymentAmount?: number;
  couponCode?: string;
  receiptUrl?: string;
  appliedAt: string;
  updatedAt?: string;
  hearAboutUs?: string;
  notes?: string;
  interviewDate?: string;
  interviewerName?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  active: boolean;
  createdAt: string;
  internshipId?: string;
}

export interface Receipt {
  id: string;
  applicationId: string;
  studentName: string;
  studentEmail: string;
  internshipTitle: string;
  paymentId: string;
  paymentDate: string;
  amount: number;
  discountAmount?: number;
  originalAmount?: number;
  couponCode?: string;
  pdfUrl?: string;
  createdAt: string;
}