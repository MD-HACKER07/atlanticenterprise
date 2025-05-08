/**
 * Utility functions for coupon management
 */
import { supabase } from './supabase';

// Import the admin client with service role credentials (if available)
try {
  // Dynamic import to handle cases where the admin client isn't available
  import('./adminSupabase').then(module => {
    module.adminSupabase && (window.adminSupabase = module.adminSupabase);
  }).catch(err => {
    console.warn('Admin Supabase client not available:', err);
  });
} catch (e) {
  console.warn('Admin Supabase import failed:', e);
}

// Use admin client when available, fallback to regular client
const getClient = () => {
  return typeof window !== 'undefined' && window.adminSupabase ? window.adminSupabase : supabase;
};

/**
 * Increment the usage count for a coupon code
 * Handles both camelCase and snake_case column formats
 * 
 * @param couponCode The coupon code to increment usage for
 */
export async function incrementCouponUsage(couponCode: string): Promise<void> {
  if (!couponCode) return;
  
  try {
    // Get the appropriate client that can bypass RLS
    const client = getClient();
    
    // First try using the RPC function if it exists
    try {
      await client.rpc('increment_coupon_usage_by_code', {
        coupon_code: couponCode.toUpperCase()
      });
      return; // Success with RPC
    } catch (rpcError) {
      console.warn('RPC increment failed, trying direct update:', rpcError);
    }
    
    // Get current coupon data
    const { data } = await client
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .single();
      
    if (!data) {
      console.warn('Coupon not found for usage increment:', couponCode);
      return;
    }
    
    // Determine which column to use for the update and increment it
    const currentUses = data.current_uses ?? data.currentUses ?? 0;
    const newUses = currentUses + 1;
    
    // Try updating both column formats to ensure it works
    const updateData = {
      current_uses: newUses,
      currentUses: newUses
    };
    
    await client
      .from('coupons')
      .update(updateData)
      .eq('code', couponCode.toUpperCase());
      
  } catch (error) {
    console.error('Failed to increment coupon usage:', error);
    // We don't throw here because this shouldn't block the main flow
  }
}

/**
 * Validate a coupon code and return discount information
 * 
 * @param couponCode The coupon code to validate
 * @returns Object with validation results
 */
export async function validateCoupon(couponCode: string): Promise<{
  valid: boolean;
  discountPercent?: number;
  discountAmount?: number;
  originalAmount?: number;
  finalAmount?: number;
  error?: string;
}> {
  if (!couponCode?.trim()) {
    return { valid: false, error: 'Coupon code is required' };
  }
  
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('active', true)
      .single();
    
    if (error) {
      return { 
        valid: false, 
        error: 'Invalid coupon code' 
      };
    }
    
    if (!data) {
      return { 
        valid: false, 
        error: 'Coupon not found' 
      };
    }
    
    // Check if coupon is expired
    const currentDate = new Date();
    const expiryDate = new Date(data.expiryDate || data.expiry_date);
    
    if (isNaN(expiryDate.getTime())) {
      return {
        valid: false,
        error: 'Coupon has invalid expiry date'
      };
    }
    
    if (expiryDate < currentDate) {
      return { 
        valid: false, 
        error: 'Coupon has expired' 
      };
    }
    
    // Check if coupon has reached maximum uses
    const currentUses = data.currentUses ?? data.current_uses ?? 0;
    const maxUses = data.maxUses ?? data.max_uses ?? 0;
    
    if (currentUses >= maxUses) {
      return { 
        valid: false, 
        error: 'Coupon has reached maximum uses' 
      };
    }
    
    // Get discount percent from either camelCase or snake_case
    const discountPercent = data.discountPercent ?? data.discount_percent ?? 0;
    
    return {
      valid: true,
      discountPercent
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      valid: false,
      error: 'Failed to validate coupon'
    };
  }
}

// Declare the adminSupabase on window for global access
declare global {
  interface Window {
    adminSupabase: any;
  }
} 