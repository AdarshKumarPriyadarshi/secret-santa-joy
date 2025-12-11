import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Mail, Lock, Phone, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Snowflakes } from '@/components/decorations/Snowflakes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      login('demo-token', {
        id: '1',
        name: 'Demo User',
        email: email,
        phone: '+1234567890',
        uniqueId: 'USR-001234',
      });
      toast({
        title: "Welcome back! 🎄",
        description: "You've successfully logged in.",
      });
      navigate('/dashboard');
    }, 1000);
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
          <p className="text-muted-foreground mt-2">Spread the holiday joy! 🎅</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8 border animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-center mb-6 font-display">Welcome Back!</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {isOtpMode ? (
              <FormInput
                label="Phone Number"
                type="tel"
                placeholder="+1 234 567 8900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Phone className="h-4 w-4" />}
              />
            ) : (
              <>
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="santa@northpole.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                />
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                />
              </>
            )}

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Snowflake className="h-5 w-5 animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="mt-4 space-y-3">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsOtpMode(!isOtpMode)}
            >
              {isOtpMode ? 'Login with Password' : 'Login with OTP'}
            </Button>

            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
