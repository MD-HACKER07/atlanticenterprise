import { CompanyInfo } from '../types';

export const companyInfo: CompanyInfo = {
  name: 'ATLANTIC ENTERPRISE',
  tagline: 'Building the Future with Innovation and Quality',
  description: 'Incorporated in the year 2019, Atlantic Enterprise is one of the foremost Wholesaler, Supplier, Trader and Retailer of impeccable compilation of hardware, fittings, bearings and many more. We also deal with healthcare and safety products. Our vendors have innovative production unit to make these products according to our patrons and industry demands. We are now expanding into AI automation products and tools, offering exciting internship opportunities.',
  founded: '2019',
  location: '270/B, SEC NO 25, PCNTDA SINDHU NAGAR, NIGDI, Pune-411044, Maharashtra',
  contact: {
    email: 'atlanticenterprise7@gmail.com',
    phone: '7666906951',
    website: 'atlanticenterprise.in'
  },
  legalInfo: {
    gst: '27ARWPN4452G1Z9',
    pan: 'ARWPN4452G'
  },
  vision: 'Atlantic Enterprise is committed to do business responsibly is built into core values of the company to conduct every aspect of business responsibly and sustainably.',
  mission: 'We are committed to grow through our personal passion, reinforced by a professional mindset, creating the value for all those we touch.',
  strengths: [
    'Premium quality',
    'On-time delivery',
    'Cost effectiveness',
    'Experienced team',
    'Sophisticated infrastructure facility',
    'Reliable products',
    'Strong logistic support',
    'Premium grade products',
    'Ethical business practices',
    'Years of experience',
    'Customization facility',
    'Professional approach'
  ],
  productCategories: [
    'Privacy Policy',
    'Terms and Conditions',
    'Cancellation and Refund',
    'Shipping and Delivery',
    'Contact Us'
  ],
  team: [
    {
      id: '1',
      name: 'Atlantic Leadership',
      role: 'Management Team',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ],
  promotion: {
    enabled: true,
    message: 'HURRY UP! Limited-time offer on AI Automation internship seats.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    ctaText: 'Apply Now',
    ctaLink: '/internships'
  }
};