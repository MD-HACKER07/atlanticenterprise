import React, { useState } from 'react';
import SEO from '../components/SEO';
import { ChevronDown, ChevronUp, HelpCircle, Link as LinkIcon, Home, Briefcase, CreditCard, GraduationCap, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  icon: React.ReactNode;
  faqs: FAQ[];
}

const InternshipFAQPage: React.FC = () => {
  const [openFAQs, setOpenFAQs] = useState<{[key: string]: number[]}>({
    general: [0],
    application: [],
    payment: [],
    academic: [],
    experience: []
  });
  
  const [activeCategory, setActiveCategory] = useState<string>('general');

  const faqCategories: FAQCategory[] = [
    {
      name: 'general',
      icon: <HelpCircle className="text-blue-600" size={20} />,
      faqs: [
        {
          question: "What internship opportunities does Atlantic Enterprise offer in Pune?",
          answer: "Atlantic Enterprise offers a variety of internship opportunities in Pune, with a focus on AI automation, hardware engineering, technical development, product development, and business operations. Our internships provide hands-on experience in real-world projects under the mentorship of experienced professionals."
        },
        {
          question: "Is Atlantic Enterprise the best place for internships in Pune?",
          answer: "Atlantic Enterprise has built a reputation for providing some of the best internship experiences in Pune. Our program is designed to offer meaningful work, structured learning, professional mentorship, and valuable industry connections. Many of our past interns have rated their experience highly and gone on to successful careers in their fields."
        },
        {
          question: "How long do internships at Atlantic Enterprise typically last?",
          answer: "Our internships typically range from 2 to 6 months, with the most common duration being 3 months. We also offer flexible arrangements for college students based on their academic schedules. In some cases, exceptional interns may be offered extensions or converted to full-time positions."
        },
        {
          question: "Can I get an internship at Atlantic Enterprise if I'm not from Pune?",
          answer: "Yes, Atlantic Enterprise welcomes applications from candidates outside Pune. We offer both in-person and remote internship opportunities. For in-person internships, candidates are responsible for their relocation and accommodation arrangements, though we can provide guidance and recommendations."
        },
        {
          question: "Does Atlantic Enterprise offer internships to international students?",
          answer: "Yes, Atlantic Enterprise accepts applications from international students, provided they have the necessary permissions to work in India. International candidates should ensure they have the appropriate visa status and work authorization before applying. Remote internships may also be available for international applicants."
        }
      ]
    },
    {
      name: 'application',
      icon: <Briefcase className="text-green-600" size={20} />,
      faqs: [
        {
          question: "How do I apply for an internship at Atlantic Enterprise?",
          answer: "To apply for an internship at Atlantic Enterprise, visit our internships page, select a position that matches your interests and skills, and submit your application through our online form. The application process typically includes submitting your resume and a brief statement explaining why you're interested in the role, followed by a technical assessment and interview for shortlisted candidates."
        },
        {
          question: "What skills or qualifications do I need for an internship at Atlantic Enterprise?",
          answer: "The required skills and qualifications vary depending on the specific internship position. Generally, we look for candidates with relevant academic backgrounds, basic technical knowledge in the field, eagerness to learn, problem-solving abilities, and good communication skills. Specific requirements are detailed in each internship listing."
        },
        {
          question: "What is the selection process for internships at Atlantic Enterprise?",
          answer: "Our selection process typically includes reviewing applications, shortlisting candidates based on their qualifications and statements of interest, conducting technical assessments or assignments related to the role, and finally, personal interviews. The entire process usually takes 2-3 weeks from application to final decision."
        },
        {
          question: "How competitive is the selection process?",
          answer: "The selection process can be competitive, especially for our most popular internship roles. We typically receive a large number of applications and select candidates based on their qualifications, relevant experience, and demonstrated interest in the field. However, we encourage all interested candidates to apply as we evaluate each application on its individual merits."
        },
        {
          question: "Is there a specific application deadline for internships?",
          answer: "Application deadlines vary by position and internship cycle. We typically post internships with clear application deadlines on our website. For rolling internship programs, we accept applications until positions are filled. We recommend applying as early as possible for the best chances of consideration."
        },
        {
          question: "Do I need to submit a cover letter with my application?",
          answer: "While not always mandatory, a well-crafted cover letter or statement of interest significantly strengthens your application. This helps us understand your motivation, relevant skills, and why you're interested in the specific internship position. It's an opportunity to showcase your communication skills and stand out from other applicants."
        }
      ]
    },
    {
      name: 'payment',
      icon: <CreditCard className="text-purple-600" size={20} />,
      faqs: [
        {
          question: "Are Atlantic Enterprise internships paid or unpaid?",
          answer: "Atlantic Enterprise offers both paid and unpaid internships, depending on the position and duration. All internship listings clearly indicate the compensation structure. For paid internships, we offer competitive stipends based on the role and the intern's qualifications. Some internships may also have performance-based incentives."
        },
        {
          question: "Why do some internships require an application fee?",
          answer: "Some of our specialized internships require an application fee to cover administrative costs, training materials, and mentorship resources. These programs typically involve intensive training components, specialized software access, or dedicated mentorship. The application fee helps ensure committed participation and contributes to providing high-quality resources for interns."
        },
        {
          question: "Can the application fee be waived or reduced?",
          answer: "We offer fee waivers or reductions for exceptional candidates demonstrating financial need. Additionally, we run periodic promotions with coupon codes for application fee discounts. Contact our admissions team directly if you're facing financial constraints but are passionate about a specific internship opportunity."
        },
        {
          question: "When are stipends typically paid to interns?",
          answer: "For paid internships, stipends are typically disbursed monthly. The first payment is made at the end of the first month of the internship. Payment details, including amount and frequency, are clearly communicated in the internship offer letter and during onboarding."
        },
        {
          question: "Are there any additional financial benefits for interns?",
          answer: "Depending on the internship program, additional benefits may include performance bonuses, project completion incentives, travel allowances for in-office interns, or professional development budgets. Some of our longer-term internships also include health insurance coverage."
        }
      ]
    },
    {
      name: 'academic',
      icon: <GraduationCap className="text-amber-600" size={20} />,
      faqs: [
        {
          question: "Can I get academic credit for my internship at Atlantic Enterprise?",
          answer: "Yes, many educational institutions offer academic credit for internships at Atlantic Enterprise. We're happy to provide any documentation required by your university, including performance evaluations and verification of hours. Please inform us at the beginning of your internship if you're seeking academic credit so we can prepare accordingly."
        },
        {
          question: "Do you offer internships specifically for students?",
          answer: "Yes, we have several internship programs designed specifically for students at various educational levels. These include summer internships, semester-based programs, and part-time opportunities that can be balanced with academic commitments. We also offer special programs for final-year projects that align with our business objectives."
        },
        {
          question: "What educational backgrounds are most suitable for your internships?",
          answer: "We offer internships across various disciplines, including Computer Science, Engineering, Business Administration, Marketing, Design, and more. While technical roles often require relevant educational backgrounds, we also value diversity of thought and consider candidates from non-traditional backgrounds who demonstrate aptitude and passion."
        },
        {
          question: "Can I do an internship while still studying?",
          answer: "Absolutely! We offer flexible part-time internships specifically designed for current students. These opportunities allow you to gain practical experience while completing your studies. We work with you to create a schedule that accommodates your academic commitments while ensuring you get valuable work experience."
        },
        {
          question: "Do you provide training for interns with limited experience?",
          answer: "Yes, we provide comprehensive onboarding and training for all our interns. For those with limited experience, we offer additional structured learning opportunities, including workshops, online courses, and paired mentorship. Our goal is to help you build practical skills regardless of your starting point."
        }
      ]
    },
    {
      name: 'experience',
      icon: <Users className="text-red-600" size={20} />,
      faqs: [
        {
          question: "What is the work environment like for interns at Atlantic Enterprise?",
          answer: "We pride ourselves on maintaining a collaborative, innovative, and supportive work environment. Interns are treated as valuable team members and are integrated into their respective departments. We foster a culture of learning where questions are encouraged, feedback is constructive, and achievements are celebrated."
        },
        {
          question: "Will I work on real projects during my internship?",
          answer: "Absolutely! We believe in providing meaningful work experiences. Our interns work on actual business projects and contribute directly to our products and services. You'll tackle real challenges, collaborate with experienced professionals, and see your work make a tangible impact."
        },
        {
          question: "Can an internship at Atlantic Enterprise lead to a full-time job?",
          answer: "Yes, many of our full-time employees started as interns. We view our internship program as a talent pipeline and regularly offer full-time positions to exceptional interns who demonstrate strong performance, cultural fit, and growth potential during their internship period."
        },
        {
          question: "What kind of mentorship and guidance will I receive?",
          answer: "Each intern is assigned a direct supervisor who provides day-to-day guidance and a mentor who offers broader career advice and support. You'll receive regular feedback through structured check-ins, performance reviews, and informal coaching. We're committed to your professional development and growth."
        },
        {
          question: "Are there networking opportunities for interns?",
          answer: "Yes, we organize various networking events specifically for interns, including lunch-and-learns with leadership, cross-departmental projects, and social events. You'll have opportunities to build relationships with professionals across the organization and expand your professional network."
        },
        {
          question: "What do former interns say about their experience at Atlantic Enterprise?",
          answer: "Former interns consistently highlight the valuable hands-on experience, supportive mentorship, and professional growth opportunities they received. Many appreciate the meaningful projects they worked on and the skills they developed. You can read testimonials from previous interns on our website's reviews section."
        }
      ]
    }
  ];

  const toggleFAQ = (category: string, index: number) => {
    setOpenFAQs(prev => {
      const categoryFAQs = [...(prev[category] || [])];
      if (categoryFAQs.includes(index)) {
        return {
          ...prev,
          [category]: categoryFAQs.filter(i => i !== index)
        };
      } else {
        return {
          ...prev,
          [category]: [...categoryFAQs, index]
        };
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <SEO 
        title="Internship FAQs | Everything You Need to Know About Internships in Pune"
        description="Find answers to frequently asked questions about internships at Atlantic Enterprise in Pune. Learn about our application process, internship types, and why we offer some of the best internship opportunities in Pune."
        keywords={["internship FAQs", "internship in Pune", "best internship questions", "atlanticenterprise internship", "AI automation internship FAQ", "how to apply for internship", "internship application process"]}
        canonicalUrl="https://atlanticenterprise.in/internship-faq"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to navigation button - visible on mobile */}
        <div className="mb-6">
          <Link 
            to="/internships" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Internships
          </Link>
        </div>
        
        <div className="mb-8 text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            INTERNSHIP PROGRAM
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about internships at Atlantic Enterprise in Pune
          </p>
        </div>
        
        {/* FAQ Category Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center bg-white rounded-lg shadow-sm p-2 border border-gray-200">
            {faqCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === category.name 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                <span className="capitalize">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mb-12">
          {faqCategories.map((category) => (
            <div 
              key={category.name}
              className={`bg-white rounded-lg shadow-md overflow-hidden mb-8 transition-opacity duration-300 ${
                activeCategory === category.name ? 'block' : 'hidden'
              }`}
            >
              <div className="border-b border-gray-200 py-4 px-6 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {category.icon}
                  <span className="capitalize">{category.name} Questions</span>
                </h2>
              </div>
              
              {category.faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(category.name, index)}
                    className="flex justify-between items-start w-full p-4 sm:p-6 text-left focus:outline-none"
                  >
                    <div className="flex items-start gap-3 pr-2">
                      <HelpCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {openFAQs[category.name]?.includes(index) ? (
                        <ChevronUp className="text-gray-500" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-500" size={20} />
                      )}
                    </div>
                  </button>
                  
                  <div 
                    className={`px-4 sm:px-6 pb-4 sm:pb-6 pt-0 text-gray-700 transition-all duration-200 ${
                      openFAQs[category.name]?.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="pl-8">
                      <p className="mb-4 text-sm sm:text-base">{faq.answer}</p>
                      
                      {/* Add schema markup for search engines */}
                      <script type="application/ld+json" dangerouslySetInnerHTML={{ 
                        __html: JSON.stringify({
                          "@context": "https://schema.org",
                          "@type": "Question",
                          "name": faq.question,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.answer
                          }
                        })
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Application Process Overview */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Internship Application Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">1</div>
                <h3 className="text-lg font-semibold mb-2">Submit Application</h3>
                <p className="text-gray-600 text-sm">Browse open positions and submit your application with required documents.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">2</div>
                <h3 className="text-lg font-semibold mb-2">Assessment & Interview</h3>
                <p className="text-gray-600 text-sm">Complete a relevant assessment and participate in an interview with our team.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">3</div>
                <h3 className="text-lg font-semibold mb-2">Offer & Onboarding</h3>
                <p className="text-gray-600 text-sm">Receive your offer and complete the onboarding process to start your internship.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map and Address Information */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2547158278226!2d73.88108687379287!3d18.562551782466336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e!2sPhoenix%20Marketcity%20Pune!5m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e!2s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="flex items-start gap-4">
                  <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Atlantic Enterprise Headquarters</h3>
                    <p className="text-gray-700 mb-1">Phoenix Marketcity, East Court</p>
                    <p className="text-gray-700 mb-1">Viman Nagar, Pune, Maharashtra 411014</p>
                    <p className="text-gray-700 mb-4">India</p>
                    
                    <div className="flex gap-3">
                      <Link
                        to="/contact"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center text-sm"
                      >
                        Contact Us
                      </Link>
                      <a
                        href="https://maps.app.goo.gl/JJPQmhCGWtcefgrh7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors inline-flex items-center text-sm"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-100">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="bg-blue-100 rounded-full p-3">
              <LinkIcon className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
              <p className="text-gray-700 mb-4">
                Can't find the answer you're looking for? Please reach out to our team or visit our internship page for more information.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  to="/contact"
                  className="bg-white hover:bg-gray-50 text-blue-700 px-4 py-2 rounded-md border border-blue-200 transition-colors inline-flex items-center text-sm"
                >
                  Contact Us
                </Link>
                <Link
                  to="/internships"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center text-sm"
                >
                  Browse Internships
                </Link>
                <Link
                  to="/"
                  className="bg-white hover:bg-gray-50 text-blue-700 px-4 py-2 rounded-md border border-blue-200 transition-colors inline-flex items-center gap-1 text-sm"
                >
                  <Home size={16} />
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Structured data for FAQPage */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ 
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqCategories.flatMap(category => 
              category.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            )
          })
        }} />
      </div>
    </div>
  );
};

export default InternshipFAQPage; 