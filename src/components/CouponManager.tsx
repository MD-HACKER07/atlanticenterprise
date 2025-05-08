import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { prepareDataWithColumnNameFormats } from '../lib/databaseUtils';
import { Coupon } from '../types';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { format, isValid } from 'date-fns';

interface CouponManagerProps {
  internshipId?: string; // Optional, if we want to filter by internship
}

const CouponManager: React.FC<CouponManagerProps> = ({ internshipId }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  // Form state
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [maxUses, setMaxUses] = useState(10);
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [internshipId]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      let query = supabase.from('coupons').select('*');
      
      if (internshipId) {
        query = query.eq('internshipId', internshipId);
      }

      const { data, error } = await query.order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching coupons:', error);
      } else {
        setCoupons(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountPercent(10);
    setMaxUses(10);
    setExpiryDate('');
    setIsActive(true);
    setFormError('');
    setShowForm(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountPercent(coupon.discountPercent);
    setMaxUses(coupon.maxUses);
    setExpiryDate(coupon.expiryDate.split('T')[0]);
    setIsActive(coupon.active);
    setFormError('');
    setShowForm(true);
  };

  const validateForm = () => {
    if (!code.trim()) {
      setFormError('Coupon code is required');
      return false;
    }
    if (discountPercent < 1 || discountPercent > 100) {
      setFormError('Discount must be between 1 and 100');
      return false;
    }
    if (maxUses < 1) {
      setFormError('Maximum uses must be at least 1');
      return false;
    }
    if (!expiryDate) {
      setFormError('Expiry date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const couponData = {
        code: code.toUpperCase(),
        discountPercent,
        maxUses,
        currentUses: editingCoupon?.currentUses || 0,
        expiryDate: new Date(expiryDate).toISOString(),
        active: isActive,
        internshipId: internshipId || null,
      };

      // Prepare data with both camelCase and snake_case formats
      const preparedData = prepareDataWithColumnNameFormats(couponData);

      if (editingCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(preparedData)
          .eq('id', editingCoupon.id);

        if (error) {
          console.error('Error updating coupon:', error);
          
          // Try one more time with only snake_case if there's a column error
          if (error.message && error.message.includes('column')) {
            // Keep only snake_case fields
            const snakeCaseData = Object.fromEntries(
              Object.entries(preparedData).filter(([key]) => !(/[A-Z]/.test(key)))
            );
            
            const { error: retryError } = await supabase
              .from('coupons')
              .update(snakeCaseData)
              .eq('id', editingCoupon.id);
              
            if (retryError) {
              setFormError(retryError.message);
            } else {
              fetchCoupons();
              setShowForm(false);
            }
          } else {
            setFormError(error.message);
          }
        } else {
          fetchCoupons();
          setShowForm(false);
        }
      } else {
        // Create new coupon with timestamp
        const fullData = {
          ...preparedData,
          createdAt: new Date().toISOString(),
        };
        
        // Add formatted timestamps to the data
        const completeData = prepareDataWithColumnNameFormats(fullData);

        const { error } = await supabase
          .from('coupons')
          .insert([completeData]);

        if (error) {
          console.error('Error creating coupon:', error);
          
          // Try one more time with only snake_case if there's a column error
          if (error.message && error.message.includes('column')) {
            // Keep only snake_case fields
            const snakeCaseData = Object.fromEntries(
              Object.entries(completeData).filter(([key]) => !(/[A-Z]/.test(key)))
            );
            
            const { error: retryError } = await supabase
              .from('coupons')
              .insert([snakeCaseData]);
              
            if (retryError) {
              setFormError(retryError.message);
            } else {
              fetchCoupons();
              setShowForm(false);
            }
          } else {
            setFormError(error.message);
          }
        } else {
          fetchCoupons();
          setShowForm(false);
        }
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setFormError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting coupon:', error);
        alert('Failed to delete coupon');
      } else {
        fetchCoupons();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    }
  };

  const toggleCouponStatus = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ active: !coupon.active })
        .eq('id', coupon.id);

      if (error) {
        console.error('Error updating coupon status:', error);
        alert('Failed to update coupon status');
      } else {
        fetchCoupons();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    }
  };

  const renderCouponTable = () => {
    if (loading) {
      return <div className="text-center py-4">Loading coupons...</div>;
    }

    if (coupons.length === 0) {
      return <div className="text-center py-4">No coupons found.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uses</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => {
              // Ensure dates are properly parsed
              const expiryDate = new Date(coupon.expiryDate);
              const isExpired = expiryDate < new Date();
              const formattedExpiryDate = isValid(expiryDate) 
                ? format(expiryDate, 'dd MMM yyyy')
                : 'Invalid Date';

              return (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.discountPercent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coupon.currentUses || 0} / {coupon.maxUses}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                    {formattedExpiryDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => toggleCouponStatus(coupon)}
                      className={`${coupon.active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {coupon.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {formError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code*
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., SUMMER2023"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage*
              </label>
              <input
                id="discountPercent"
                type="number"
                min="1"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Uses*
              </label>
              <input
                id="maxUses"
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(parseInt(e.target.value))}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {editingCoupon && (
                <p className="mt-1 text-sm text-gray-500">
                  Current uses: {editingCoupon.currentUses}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date*
              </label>
              <input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Coupon is active</span>
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (editingCoupon ? 'Update Coupon' : 'Create Coupon')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Coupon Codes</h2>
        <button
          onClick={handleCreateCoupon}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
        >
          <Plus size={18} className="mr-1.5" />
          Add New Coupon
        </button>
      </div>

      {renderCouponTable()}
    </div>
  );
};

export default CouponManager; 