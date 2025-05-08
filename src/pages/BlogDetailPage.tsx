import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { ArrowLeft, Calendar, User, Tag, Share2, AlertCircle } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
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

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);
  
  const fetchBlogPost = async (postSlug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('published', true)
        .single();
      
      if (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post. Please try again later.');
        setPost(null);
        return;
      }
      
      if (!data) {
        setPost(null);
        return;
      }
      
      // Map the data and convert snake_case to camelCase for featuredImage
      const formattedData = {
        ...data,
        featuredImage: data.featured_image || '', // Map from snake_case to camelCase
        tags: data.tags || []
      };
      
      setPost(formattedData);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again later.');
      setPost(null);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => fetchBlogPost(slug || '')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Try Again
              </button>
              <Link to="/blog" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-700 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog" className="text-blue-600 hover:underline">Return to Blog</Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <SEO 
        title={post.title}
        description={post.excerpt}
        keywords={post.tags}
        canonicalUrl={`https://atlanticenterprise.in/blog/${slug}`}
        ogType="article"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6">
          <ArrowLeft size={18} className="mr-2" /> Back to all posts
        </Link>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-600 mb-8 gap-4">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-blue-600" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User size={18} className="mr-2 text-blue-600" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Tag size={18} className="mr-2 text-blue-600" />
                <span>{post.category}</span>
              </div>
            </div>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags && post.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-sm rounded-full px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share This Article</h3>
              <div className="flex gap-4">
                <button className="text-blue-600 hover:text-blue-800">
                  <Share2 size={20} />
                </button>
                {/* Add social sharing buttons here */}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About {companyInfo.name}</h3>
              <p className="text-gray-700">
                {companyInfo.description}
              </p>
              <div className="mt-4">
                <Link 
                  to="/internships" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View our internship opportunities →
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage; 