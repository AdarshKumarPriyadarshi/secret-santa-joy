import { useState } from 'react';
import { User, Mail, Phone, Key, Copy, Save, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Profile updated! 🎄", description: "Your changes have been saved." });
    }, 1000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }
    toast({ title: "Password changed!", description: "Your password has been updated." });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const copyUniqueId = () => {
    navigator.clipboard.writeText(user?.uniqueId || '');
    toast({ title: "Copied!", description: "Your unique ID has been copied to clipboard." });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary font-display">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings</p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Your Unique ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-lg">
                {user?.uniqueId || 'USR-001234'}
              </div>
              <Button variant="outline" onClick={copyUniqueId} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Share this ID so others can add you to their organizations
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Full Name"
              value={formData.name}
              onChange={handleChange('name')}
              icon={<User className="h-4 w-4" />}
            />
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              icon={<Mail className="h-4 w-4" />}
            />
            <FormInput
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              icon={<Phone className="h-4 w-4" />}
            />
            <Button onClick={handleSaveProfile} className="w-full gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Snowflake className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
            />
            <FormInput
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange('newPassword')}
            />
            <FormInput
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
            />
            <Button onClick={handleChangePassword} variant="outline" className="w-full">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
