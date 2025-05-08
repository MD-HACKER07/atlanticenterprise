import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, Edit, Trash2, ExternalLink, Calendar, Eye, AlertCircle } from 'lucide-react';
import CreateBlogPostForm from './CreateBlogPostForm';
import useFormPersistence from '../hooks/useFormPersistence';

// Blog post interface
export interface BlogPost {
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
  created_at?: string;
}

const AdminBlogManager: React.FC = () => {
  // Use form persistence hook for search and filter state
  const [adminBlogState, setAdminBlogState] = useFormPersistence('admin_blog_manager', {
    searchTerm: '',
    filter: 'all' as 'all' | 'published' | 'draft',
    showCreateForm: false,
    editingPostId: null as string | null
  });
  
  // Destructure state values for convenience
  const { searchTerm, filter, showCreateForm, editingPostId } = adminBlogState;
  
  // Update state helper functions
  const setSearchTerm = (value: string) => {
    setAdminBlogState(prev => ({ ...prev, searchTerm: value }));
  };
  
  const setFilter = (value: 'all' | 'published' | 'draft') => {
    setAdminBlogState(prev => ({ ...prev, filter: value }));
  };
  
  const setShowCreateForm = (value: boolean) => {
    setAdminBlogState(prev => ({ ...prev, showCreateForm: value }));
  };
  
  const setEditingPostId = (value: string | null) => {
    setAdminBlogState(prev => ({ ...prev, editingPostId: value }));
  };
  
  // Regular state for data that doesn't need to be persisted
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Computed state
  const editingPost = blogPosts.find(post => post.id === editingPostId) || null;

  // Event handler for browser visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When the tab becomes visible again, refresh the data
      if (document.visibilityState === 'visible' && !showCreateForm) {
        fetchBlogPosts();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showCreateForm]);

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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts: ' + error.message);
        return;
      }
      
      const formattedData = (data || []).map(post => ({
        ...post,
        featuredImage: post.featured_image || '',
        tags: post.tags || [],
      }));
      
      setBlogPosts(formattedData);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlogPost = () => {
    setEditingPostId(null);
    setShowCreateForm(true);
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setShowCreateForm(true);
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingPostId(null);
    fetchBlogPosts();
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
    setEditingPostId(null);
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog post:', error);
        setError('Failed to delete blog post: ' + error.message);
      } else {
        fetchBlogPosts();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred: ' + (error.message || 'Unknown error'));
    }
  };

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating blog post status:', error);
        setError('Failed to update blog post: ' + error.message);
      } else {
        fetchBlogPosts();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred: ' + (error.message || 'Unknown error'));
    }
  };

  // Filter posts based on search term and publish status
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'published') return matchesSearch && post.published;
    if (filter === 'draft') return matchesSearch && !post.published;
    return matchesSearch;
  });

  if (showCreateForm) {
    return <CreateBlogPostForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} postToEdit={editingPost} />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <button
          onClick={handleCreateBlogPost}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create New Post
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <AlertCircle size={18} />
            </div>
            <div className="ml-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading blog posts...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.featuredImage && (
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="h-10 w-10 rounded-md object-cover mr-3" 
                        />
                      )}
                      <div className="truncate max-w-md">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-xs text-gray-500 truncate">{post.excerpt.substring(0, 60)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {post.date}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePublishStatus(post.id, post.published)}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="View Post"
                      >
                        <Eye size={18} />
                      </a>
                      <button
                        onClick={() => handleEditBlogPost(post)}
                        className="text-amber-600 hover:text-amber-800"
                        title="Edit Post"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No blog posts found</p>
          <button
            onClick={handleCreateBlogPost}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Create your first post
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBlogManager; 