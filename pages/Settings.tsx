import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  User as UserIcon, 
  Database, 
  Save, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Sliders,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'data' | 'configuration';

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { equipment, tickets, teams, activities, options, addSystemOption } = useData();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  });

  // Notification State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifs: true,
    weeklyDigest: false,
    newDevice: true,
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Configuration Form State
  const [newConfigItem, setNewConfigItem] = useState({
    categories: '',
    departments: '',
    locations: ''
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(profileForm);
      showSuccess('Profile updated successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      systemVersion: '1.0.0',
      stats: {
        equipmentCount: equipment.length,
        ticketCount: tickets.length,
        teamCount: teams.length,
      },
      data: {
        equipment,
        tickets,
        teams,
        activities,
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gearguard_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess('Data export started');
  };

  const handleAddConfig = (type: 'categories' | 'departments' | 'locations') => {
    if (!newConfigItem[type].trim()) return;
    addSystemOption(type, newConfigItem[type]);
    setNewConfigItem(prev => ({...prev, [type]: ''}));
    showSuccess(`Added new ${type.slice(0, -1)}`);
  };

  const ToggleSwitch = ({ 
    label, 
    checked, 
    onChange 
  }: { label: string, checked: boolean, onChange: () => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
          checked ? 'bg-brand-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const ConfigSection = ({ title, type, items, value, onChange, onAdd }: any) => (
     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex gap-2 mb-4">
           <Input 
             label="" 
             placeholder={`New ${title.slice(0, -1)}`} 
             value={value} 
             onChange={onChange}
             className="mb-0"
           />
           <Button onClick={onAdd} className="w-auto px-4 self-end h-[42px]" disabled={!value.trim()}>
              <Plus className="h-5 w-5" />
           </Button>
        </div>
        <div className="flex flex-wrap gap-2">
           {items.map((item: string, idx: number) => (
             <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
               {item}
             </span>
           ))}
        </div>
     </div>
  );

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon size={18} /> },
    { id: 'configuration', label: 'Configuration', icon: <Sliders size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'data', label: 'System Data', icon: <Database size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
          <nav className="flex flex-col p-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingsTab)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full text-left ${
                  activeTab === item.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${activeTab === item.id ? 'text-brand-600' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Success Toast */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center shadow-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              {successMsg}
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>
              <div className="flex items-center space-x-6 mb-8">
                <img 
                  src={user?.avatarUrl} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full border-4 border-gray-100 shadow-sm"
                />
                <div>
                  <Button variant="outline" className="text-xs h-8">Change Avatar</Button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                <Input 
                  label="Full Name" 
                  value={profileForm.name} 
                  onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                />
                <Input 
                  label="Email Address" 
                  type="email"
                  value={profileForm.email} 
                  onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                />
                <Input 
                  label="Department" 
                  value={profileForm.department} 
                  onChange={e => setProfileForm({...profileForm, department: e.target.value})}
                />
                <div className="pt-2">
                  <Button type="submit" isLoading={isLoading} className="w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Configuration Settings */}
          {activeTab === 'configuration' && (
             <div className="space-y-6">
                <ConfigSection 
                   title="Equipment Categories" 
                   items={options.categories}
                   value={newConfigItem.categories}
                   onChange={(e: any) => setNewConfigItem({...newConfigItem, categories: e.target.value})}
                   onAdd={() => handleAddConfig('categories')}
                />
                <ConfigSection 
                   title="Departments" 
                   items={options.departments}
                   value={newConfigItem.departments}
                   onChange={(e: any) => setNewConfigItem({...newConfigItem, departments: e.target.value})}
                   onAdd={() => handleAddConfig('departments')}
                />
                <ConfigSection 
                   title="Locations" 
                   items={options.locations}
                   value={newConfigItem.locations}
                   onChange={(e: any) => setNewConfigItem({...newConfigItem, locations: e.target.value})}
                   onAdd={() => handleAddConfig('locations')}
                />
             </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Notification Preferences</h2>
              <p className="text-gray-500 text-sm mb-6">Choose how and when you want to be notified.</p>
              
              <div className="max-w-2xl">
                <ToggleSwitch 
                  label="Email Alerts for Critical Failures" 
                  checked={notifications.emailAlerts}
                  onChange={() => setNotifications(p => ({...p, emailAlerts: !p.emailAlerts}))}
                />
                <ToggleSwitch 
                  label="Push Notifications for Assignments" 
                  checked={notifications.pushNotifs}
                  onChange={() => setNotifications(p => ({...p, pushNotifs: !p.pushNotifs}))}
                />
                <ToggleSwitch 
                  label="Weekly Maintenance Digest" 
                  checked={notifications.weeklyDigest}
                  onChange={() => setNotifications(p => ({...p, weeklyDigest: !p.weeklyDigest}))}
                />
                <ToggleSwitch 
                  label="Alert on New Device Login" 
                  checked={notifications.newDevice}
                  onChange={() => setNotifications(p => ({...p, newDevice: !p.newDevice}))}
                />
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button className="w-auto" onClick={() => showSuccess('Notification preferences saved')}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h2>
              
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-blue-700 mt-1">Add an extra layer of security to your account. We recommend enabling this.</p>
                  <button className="text-sm font-semibold text-blue-800 hover:text-blue-900 mt-2 underline">Enable 2FA</button>
                </div>
              </div>

              <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); showSuccess('Password updated successfully'); setPasswordForm({current: '', new: '', confirm: ''}); }}>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Change Password</h3>
                <Input 
                  type="password"
                  label="Current Password" 
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                />
                <Input 
                  type="password"
                  label="New Password" 
                  value={passwordForm.new}
                  onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                />
                <Input 
                  type="password"
                  label="Confirm New Password" 
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                />
                <div className="pt-2">
                  <Button type="submit" className="w-auto" variant="secondary">
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Data Settings */}
          {activeTab === 'data' && (
            <div className="space-y-6">
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Export System Data</h2>
                    <p className="text-gray-500 text-sm">Download a JSON file containing all equipment, maintenance requests, and team configurations.</p>
                  </div>
                  <div className="p-3 bg-brand-50 rounded-lg">
                    <Database className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
                <div className="mt-6">
                  <Button onClick={handleExportData} className="w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 opacity-75">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Danger Zone</h2>
                <p className="text-gray-500 text-sm mb-4">Irreversible actions for your account and data.</p>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="w-auto border-red-200 text-red-600 hover:bg-red-50">
                    Reset All Data
                  </Button>
                  <Button variant="outline" className="w-auto border-red-200 text-red-600 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};