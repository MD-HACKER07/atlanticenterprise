import { supabase } from '../lib/supabase';
import { CompanyInfo } from '../types';

export interface PromotionSettings {
  enabled: boolean;
  message: string;
  deadline: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Fetch promotion settings from the database
 * Falls back to default values if no settings are found
 */
export async function getPromotionSettings(): Promise<PromotionSettings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'promotion')
      .single();

    if (error) throw error;
    
    if (data && data.value) {
      return data.value as PromotionSettings;
    }
  } catch (error) {
    console.error('Error fetching promotion settings:', error);
  }
  
  // Default values if no settings found
  return {
    enabled: false,
    message: 'HURRY UP! Limited-time offer available.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ctaText: 'Apply Now',
    ctaLink: '/internships'
  };
}

/**
 * Save promotion settings to the database
 */
export async function savePromotionSettings(settings: PromotionSettings): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        key: 'promotion', 
        value: settings,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving promotion settings:', error);
    return false;
  }
}

/**
 * Update the CompanyInfo object with the latest promotion settings
 */
export async function syncPromotionSettings(companyInfo: CompanyInfo): Promise<CompanyInfo> {
  const settings = await getPromotionSettings();
  
  return {
    ...companyInfo,
    promotion: settings
  };
}

/**
 * Disable the promotion timer
 */
export async function disablePromotionTimer(companyInfo: CompanyInfo): Promise<CompanyInfo> {
  const currentSettings = companyInfo.promotion || await getPromotionSettings();
  const updatedSettings = {
    ...currentSettings,
    enabled: false
  };
  
  await savePromotionSettings(updatedSettings);
  
  return {
    ...companyInfo,
    promotion: updatedSettings
  };
} 