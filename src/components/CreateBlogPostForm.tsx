import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, Image, Tag as TagIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { BlogPost } from './AdminBlogManager';
import useFormPersistence from '../hooks/useFormPersistence';

interface CreateBlogPostFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  postToEdit: BlogPost | null;
}

const CreateBlogPostForm: React.FC<CreateBlogPostFormProps> = ({ 
  onSuccess, 
  onCancel,
  postToEdit 
}) => {
  const isEditMode = !!postToEdit;
  
  const initialFormData: Partial<BlogPost> = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Atlantic Enterprise Team',
    date: new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    category: 'Internships',
    tags: [],
    featuredImage: '',
    published: false
  };
  
  // Use our custom hook for form persistence instead of useState
  // The unique key includes the post ID when in edit mode to have different storage for each post
  const formStorageKey = isEditMode 
    ? `blog_post_form_${postToEdit?.id}` 
    : 'blog_post_form_new';
    
  const [formData, setFormData] = useFormPersistence<Partial<BlogPost>>(formStorageKey, initialFormData);
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (postToEdit) {
      setFormData({
        ...postToEdit
      });
    }
  }, [postToEdit, setFormData]);

  // Clear persisted form data on successful submission or cancellation
  const clearPersistedData = () => {
    try {
      localStorage.removeItem(formStorageKey);
      sessionStorage.removeItem(formStorageKey);
    } catch (err) {
      console.error('Error clearing persisted form data:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Generate slug from title if it's a new post
    if (name === 'title' && !isEditMode) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      setFormData({
        ...formData,
        title: value,
        slug
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!formData.title || !formData.content || !formData.excerpt) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      if (!formData.slug) {
        const slug = formData.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-');
        
        formData.slug = slug;
      }

      // Map camelCase fields to snake_case for the database
      const blogPostData = {
        ...formData,
        featured_image: formData.featuredImage, // Map featuredImage to featured_image
        created_at: isEditMode ? postToEdit?.created_at : new Date().toISOString()
      };

      // Remove the camelCase version to avoid duplicate fields
      delete blogPostData.featuredImage;

      let result;
      
      if (isEditMode && postToEdit?.id) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(blogPostData)
          .eq('id', postToEdit.id);
          
        if (result.error) throw result.error;
        setSuccessMessage('Blog post updated successfully!');
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert([{ ...blogPostData, id: uuidv4() }]);
          
        if (result.error) throw result.error;
        setSuccessMessage('Blog post created successfully!');
      }

      // Clear persisted form data after successful submission
      clearPersistedData();

      setTimeout(() => {
        onSuccess();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      setError(`Failed to save blog post: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Ask for confirmation if form has been modified
    if (
      formData.title !== (postToEdit?.title || '') ||
      formData.excerpt !== (postToEdit?.excerpt || '') ||
      formData.content !== (postToEdit?.content || '')
    ) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        clearPersistedData();
        onCancel();
      }
    } else {
      clearPersistedData();
      onCancel();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Blog Posts
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          form="blogPostForm" // Connect to the form by ID
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              {isEditMode ? 'Update Post' : 'Save Post'}
            </>
          )}
        </button>
      </div>

      <form id="blogPostForm" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blog post title"
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter URL slug (e.g., my-blog-post)"
              />
              <p className="mt-1 text-xs text-gray-500">
                This will be used in the URL: https://atlanticenterprise.in/blog/
                <span className="font-medium">{formData.slug}</span>
              </p>
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Publication Date
              </label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., April 15, 2025"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Internships">Internships</option>
                <option value="Career Advice">Career Advice</option>
                <option value="Technology">Technology</option>
                <option value="Company News">Company News</option>
                <option value="Education">Education</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image URL
              </label>
              <div className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="featuredImage"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              {formData.featuredImage && (
                <div className="mt-2">
                  <img 
                    src={formData.featuredImage} 
                    alt="Featured" 
                    className="h-32 w-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief summary of the blog post (displayed in previews)"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a tag and press Enter"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-sm rounded-full px-3 py-1 flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content (HTML) *
              </label>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="<p>Enter your blog post content in HTML format...</p>"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Use HTML tags for formatting. Examples: &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;ul&gt;&lt;li&gt;
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publish immediately (otherwise saved as draft)
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPostForm; 