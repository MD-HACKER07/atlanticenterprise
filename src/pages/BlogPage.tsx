import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  published: boolean;
}

const BlogPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts. Please try again later.');
        return;
      }
      
      // Map the data and convert snake_case to camelCase for featuredImage
      const formattedData = (data || []).map(post => ({
        ...post,
        featuredImage: post.featured_image || '', // Map from snake_case to camelCase
        tags: post.tags || [],
      }));
      
      setBlogPosts(formattedData);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <SEO 
        title="Blog | Internship Insights and Guidance"
        description="Explore our blog for insights on internships in Pune, career guidance, and information about AI automation, hardware, and technical internships at Atlantic Enterprise."
        keywords={["internship blog", "internship in Pune", "best internship", "atlanticenterprise blog", "AI automation internship", "internship guides"]}
        canonicalUrl="https://atlanticenterprise.in/blog"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Atlantic Enterprise Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, guides, and news about internships, career development, and industry trends
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => fetchBlogPosts()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <Link to={`/blog/${post.slug}`}>
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                
                <div className="p-6">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      <span>{post.author.split(' ')[0]}</span>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {post.category}
                    </span>
                    
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center font-medium"
                    >
                      Read more <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <p className="text-gray-700 mb-4">No blog posts found. Please check back later!</p>
            </div>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Interested in Our Internship Opportunities?</h2>
          <Link 
            to="/internships" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Browse Available Internships
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 