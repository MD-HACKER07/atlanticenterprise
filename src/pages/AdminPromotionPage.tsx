import React, { useState, useEffect } from 'react';
import { Clock, Save, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { companyInfo as initialCompanyInfo } from '../data/companyInfo';
import CountdownTimer from '../components/CountdownTimer';
import { PromotionSettings, getPromotionSettings, savePromotionSettings, disablePromotionTimer } from '../utils/settingsUtils';

const AdminPromotionPage: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [settings, setSettings] = useState<PromotionSettings>({
    enabled: false,
    message: 'HURRY UP! Limited-time offer available.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ctaText: 'Apply Now',
    ctaLink: '/internships'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const promotionSettings = await getPromotionSettings();
      setSettings(promotionSettings);
      // Also update companyInfo
      setCompanyInfo(prevInfo => ({
        ...prevInfo,
        promotion: promotionSettings
      }));
    };
    
    loadSettings();
  }, []);

  // Format the date to a format that works with input[type="datetime-local"]
  const formatDateForInput = (isoString: string) => {
    const date = new Date(isoString);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const success = await savePromotionSettings(settings);
      
      if (!success) throw new Error('Failed to save settings');
      
      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSaveStatus({
        success: true,
        message: 'Promotion settings saved successfully!'
      });
      
      // Update the companyInfo object in state
      setCompanyInfo(prevInfo => ({
        ...prevInfo,
        promotion: settings
      }));
      
    } catch (error) {
      console.error('Error saving promotion settings:', error);
      setSaveStatus({
        success: false,
        message: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear any previous save status
    setSaveStatus(null);
  };

  const handleRemoveTimer = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      // Create the updated settings with enabled: false
      const updatedSettings = {
        ...settings,
        enabled: false
      };
      
      // Save to database
      const success = await savePromotionSettings(updatedSettings);
      
      if (!success) throw new Error('Failed to disable timer');
      
      // Update local state
      setSettings(updatedSettings);
      setCompanyInfo(prevInfo => ({
        ...prevInfo,
        promotion: updatedSettings
      }));
      
      setShowConfirmDelete(false);
      
      setSaveStatus({
        success: true,
        message: 'Timer disabled successfully!'
      });
      
    } catch (error) {
      console.error('Error removing timer:', error);
      setSaveStatus({
        success: false,
        message: 'Failed to remove timer. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin: Promotion Settings</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-blue-600" />
                Configure Promotion Timer
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enabled"
                      name="enabled"
                      checked={settings.enabled}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enabled" className="ml-2 block text-sm font-medium text-gray-700">
                      Enable promotion banner
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Promotion Message
                    </label>
                    <input
                      type="text"
                      id="message"
                      name="message"
                      value={settings.message}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="E.g., HURRY UP! Limited-time offer available."
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      This message will be displayed in the promotion banner.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="deadline"
                      name="deadline"
                      value={formatDateForInput(settings.deadline)}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value).toISOString();
                        setSettings(prev => ({ ...prev, deadline: selectedDate }));
                      }}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      The countdown will end at this date and time.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700 mb-1">
                        Call-to-Action Text
                      </label>
                      <input
                        type="text"
                        id="ctaText"
                        name="ctaText"
                        value={settings.ctaText}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Apply Now"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700 mb-1">
                        Call-to-Action Link
                      </label>
                      <input
                        type="text"
                        id="ctaLink"
                        name="ctaLink"
                        value={settings.ctaLink}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="/internships"
                      />
                    </div>
                  </div>
                </div>
                
                {saveStatus && (
                  <div className={`p-4 mb-6 rounded-md ${saveStatus.success ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {saveStatus.success ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${saveStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                          {saveStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                  {settings.enabled ? (
                    <div className="bg-blue-700 rounded-lg overflow-hidden text-white p-5 mb-6">
                      <CountdownTimer 
                        targetDate={settings.deadline}
                        message={settings.message}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 border border-gray-200 p-4 rounded-md text-gray-500 text-center mb-6">
                      Promotion banner is currently disabled
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  {/* Confirmation Dialog for Remove Timer */}
                  {showConfirmDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Are you sure?</span>
                      <button
                        type="button"
                        onClick={handleRemoveTimer}
                        disabled={isSaving}
                        className="px-3 py-2 border border-transparent rounded-md shadow-sm text-white font-medium bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Yes, Disable
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmDelete(false)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(true)}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <Trash2 size={18} className="mr-2 text-red-500" />
                      Remove Timer
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white font-medium ${
                      isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    <Save size={18} className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromotionPage; 