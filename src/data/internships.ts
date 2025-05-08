import { Internship } from '../types';

export const internships: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    department: 'Engineering',
    duration: '3 months',
    stipend: '₹5,000/month',
    description: 'Join our engineering team to build beautiful, responsive user interfaces using modern web technologies like React, TypeScript, and Tailwind CSS.',
    requirements: [
      'Currently pursuing a degree in Computer Science or related field',
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Familiarity with React is a plus',
      'Strong problem-solving skills and attention to detail',
      'Good communication skills'
    ],
    responsibilities: [
      'Develop and maintain responsive user interfaces',
      'Collaborate with designers to implement UI/UX designs',
      'Write clean, efficient, and reusable code',
      'Participate in code reviews and team meetings',
      'Document your work for future reference'
    ],
    applicationDeadline: '2025-05-30',
    startDate: '2025-06-15',
    location: 'Bangalore',
    remote: true,
    featured: true
  },
  {
    id: '2',
    title: 'Backend Developer Intern',
    department: 'Engineering',
    duration: '6 months',
    stipend: '₹8,000/month',
    description: 'Work with our backend team to build scalable APIs, integrate with databases, and implement business logic using Node.js and Express.',
    requirements: [
      'Currently pursuing a degree in Computer Science or related field',
      'Basic knowledge of JavaScript or TypeScript',
      'Understanding of RESTful APIs',
      'Familiarity with databases (SQL or NoSQL)',
      'Eager to learn and grow'
    ],
    responsibilities: [
      'Develop and maintain backend services and APIs',
      'Work with databases to store and retrieve data efficiently',
      'Implement authentication and authorization features',
      'Write unit tests for code reliability',
      'Collaborate with the frontend team for integration'
    ],
    applicationDeadline: '2025-05-15',
    startDate: '2025-06-01',
    location: 'Delhi',
    remote: true,
    featured: false
  },
  {
    id: '3',
    title: 'UI/UX Design Intern',
    department: 'Design',
    duration: '3 months',
    stipend: '₹6,000/month',
    description: 'Join our design team to create beautiful, intuitive user interfaces and experiences for our web and mobile applications.',
    requirements: [
      'Currently pursuing a degree in Design, HCI, or related field',
      'Portfolio demonstrating UI/UX design skills',
      'Proficiency with design tools like Figma or Adobe XD',
      'Understanding of design principles and user-centered design',
      'Good communication and teamwork skills'
    ],
    responsibilities: [
      'Create wireframes, mockups, and prototypes',
      'Conduct user research and usability testing',
      'Collaborate with developers to implement designs',
      'Create visual assets and design systems',
      'Present design concepts to stakeholders'
    ],
    applicationDeadline: '2025-05-20',
    startDate: '2025-06-10',
    location: 'Mumbai',
    remote: true,
    featured: true
  },
  {
    id: '4',
    title: 'Digital Marketing Intern',
    department: 'Marketing',
    duration: '4 months',
    stipend: '₹5,500/month',
    description: 'Work with our marketing team to develop and execute digital marketing campaigns across various channels.',
    requirements: [
      'Currently pursuing a degree in Marketing, Communications, or related field',
      'Basic understanding of digital marketing concepts',
      'Excellent written and verbal communication skills',
      'Creative mindset and attention to detail',
      'Familiarity with social media platforms'
    ],
    responsibilities: [
      'Assist in creating and scheduling social media content',
      'Help manage email marketing campaigns',
      'Analyze marketing data and prepare reports',
      'Research market trends and competitor activities',
      'Support the team with various marketing initiatives'
    ],
    applicationDeadline: '2025-05-25',
    startDate: '2025-06-05',
    location: 'Hyderabad',
    remote: true,
    featured: false
  }
];