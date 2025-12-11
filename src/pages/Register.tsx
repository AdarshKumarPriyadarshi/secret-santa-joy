import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Mail, Lock, Phone, User, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { Snowflakes } from '@/components/decorations/Snowflakes';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Account created! 🎉",
        description: "Welcome to Secret Santa! Please login to continue.",
      });
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Snowflakes />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <Gift className="h-10 w-10 text-primary gift-bounce" />
          </div>
          <h1 className="text-4xl font-bold text-primary font-display">Secret Santa</h1>
          <p className="text-muted-foreground mt-2">Join the gift-giving fun! 🎁</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8 border animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-center mb-6 font-display">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              placeholder="Santa Claus"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              icon={<User className="h-4 w-4" />}
            />
            <FormInput
              label="Email"
              type="email"
              placeholder="santa@northpole.com"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              icon={<Mail className="h-4 w-4" />}
            />
            <FormInput
              label="Phone Number"
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange('phone')}
              error={errors.phone}
              icon={<Phone className="h-4 w-4" />}
            />
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              icon={<Lock className="h-4 w-4" />}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              icon={<Lock className="h-4 w-4" />}
            />

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Snowflake className="h-5 w-5 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
