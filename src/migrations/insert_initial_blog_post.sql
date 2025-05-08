-- Insert initial blog post about Web Development internship
INSERT INTO blog_posts (
  slug,
  title,
  date,
  author,
  excerpt,
  content,
  category,
  tags,
  featured_image,
  published,
  created_at
)
VALUES (
  'web-development-internship-opportunities-2025',
  'Web Development Internship Opportunities at Atlantic Enterprise: Build Your Future in 2025',
  'April 20, 2025',
  'Atlantic Enterprise Team',
  'Discover our comprehensive 2-month web development internship program designed for Computer Science, AIML, AIDS, Cybersecurity, and Cloud Computing students. Learn how this remote-friendly opportunity can accelerate your career.',
  '<h2>Unlock Your Web Development Potential with Atlantic Enterprise</h2>
      
      <p>In today''s rapidly evolving digital landscape, web development skills have become essential across virtually all technology domains. Whether you''re specializing in AI, cybersecurity, or cloud computing, understanding modern web technologies provides a foundation that enhances your primary expertise.</p>
      
      <p>Atlantic Enterprise is thrilled to announce our intensive 2-month Web Development Internship program starting May 2, 2025. This program is specifically designed for students and graduates from Computer Science, AIML, AIDS, Cybersecurity, and Cloud Computing backgrounds who want to build practical, in-demand skills that complement their academic knowledge.</p>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h3 class="text-lg font-semibold text-blue-800">Quick Facts</h3>
        <ul class="list-disc pl-5 mt-2 text-gray-700">
          <li><strong>Duration:</strong> 2 months (May 2 - July 2, 2025)</li>
          <li><strong>Location:</strong> Remote work option available</li>
          <li><strong>Department:</strong> Computer Science / AIML / AIDS / Cybersecurity / Cloud Computing</li>
          <li><strong>Application Fee:</strong> ₹5000 (Discounts available with coupon)</li>
          <li><strong>Application Deadline:</strong> May 20, 2025</li>
          <li><strong>Eligibility:</strong> Minimum 6 CGPA / Computer Field Background</li>
        </ul>
      </div>
      
      <h3>Why Web Development Matters Across Tech Domains</h3>
      
      <p>Web development isn''t just for those pursuing careers as dedicated web developers. Here''s why it''s valuable across various technical specializations:</p>
      
      <ul>
        <li><strong>For AI/ML Specialists:</strong> Deploying machine learning models via web interfaces makes them accessible to users. Frameworks like TensorFlow.js allow AI implementations directly in browsers.</li>
        <li><strong>For Cybersecurity Experts:</strong> Understanding web application architecture is crucial for identifying vulnerabilities and implementing secure coding practices.</li>
        <li><strong>For Cloud Computing Professionals:</strong> Modern web applications are increasingly cloud-native, requiring expertise in both web technologies and cloud services.</li>
        <li><strong>For Data Scientists:</strong> Data visualization and interactive dashboards often rely on web technologies to make complex insights accessible.</li>
      </ul>
      
      <h3>What You''ll Learn</h3>
      
      <p>Our comprehensive curriculum covers both front-end and back-end development, giving you a full-stack perspective with practical applications relevant to your field:</p>
      
      <h4>Front-End Development</h4>
      <ul>
        <li><strong>Modern HTML5 & CSS3:</strong> Creating responsive, accessible web interfaces</li>
        <li><strong>JavaScript Fundamentals:</strong> Core concepts and ES6+ features</li>
        <li><strong>React.js Framework:</strong> Building component-based user interfaces</li>
        <li><strong>Responsive Design:</strong> Ensuring applications work across all devices</li>
        <li><strong>Web Performance Optimization:</strong> Techniques for faster-loading applications</li>
      </ul>
      
      <h4>Back-End Development</h4>
      <ul>
        <li><strong>Node.js & Express:</strong> Building efficient server-side applications</li>
        <li><strong>API Development:</strong> RESTful and GraphQL approaches</li>
        <li><strong>Database Integration:</strong> Working with SQL and NoSQL databases</li>
        <li><strong>Authentication & Authorization:</strong> Implementing secure user systems</li>
        <li><strong>Performance & Scalability:</strong> Best practices for robust applications</li>
      </ul>
      
      <h4>Specialized Tracks</h4>
      <p>Based on your background, you''ll also explore specialized applications:</p>
      <ul>
        <li><strong>AI/ML Track:</strong> Integrating machine learning models with web applications</li>
        <li><strong>Cybersecurity Track:</strong> Web application security, OWASP Top 10, secure coding</li>
        <li><strong>Cloud Computing Track:</strong> Deploying web applications to AWS, Azure, or GCP</li>
      </ul>
      
      <h3>Ready to Transform Your Career?</h3>
      
      <p>Don''t miss this opportunity to gain valuable, in-demand skills that will complement your specialty and make you stand out in the job market.</p>
      
      <div class="bg-blue-600 text-white p-6 rounded-lg my-8">
        <h3 class="text-xl font-bold mb-2">Important Dates</h3>
        <ul class="list-disc pl-5">
          <li><strong>Application Deadline:</strong> May 20, 2025</li>
          <li><strong>Program Start Date:</strong> May 2, 2025</li>
          <li><strong>Program End Date:</strong> July 2, 2025</li>
        </ul>
        <div class="mt-4">
          <a href="/internships/web-development-2025" class="bg-white text-blue-600 px-4 py-2 rounded font-medium inline-block hover:bg-gray-100 transition-colors">Apply Now</a>
        </div>
      </div>
      
      <p>For any additional questions or to request more information, please <a href="/contact" class="text-blue-600 hover:underline">contact us</a>. We''re excited to help you begin your web development journey!</p>',
  'Internships',
  ARRAY['web development internship', 'remote internship', 'computer science internship', 'AIML internship', 'cybersecurity internship'],
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1744&q=80',
  TRUE,
  NOW()
); 