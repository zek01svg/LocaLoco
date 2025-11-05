import React, { useState } from 'react';
import { Store, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useThemeStore } from '../../store/themeStore'; // 1. Import theme store

interface ForgotPasswordPageProps {
  onBack: () => void;
  onEmailSent: (email: string) => void;
}

// 2. Remove isDarkMode from props, as we'll get it from the store
export function ForgotPasswordPage({ onBack, onEmailSent }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 3. Get theme state from the store
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // 4. Copy all color variables from LoginPage
  const headerBgColor = isDarkMode ? '#3a3a3a' : '#ffffff';
  const headerTextColor = isDarkMode ? '#ffffff' : '#000000';
  const bgColor = isDarkMode ? '#3a3a3a' : ''; // Background is handled by className
  const cardBgColor = isDarkMode ? '#2a2a2a' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const mutedTextColor = isDarkMode ? '#a1a1aa' : '#6b7280';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Password reset link sent! Redirecting...');
      onEmailSent(email);
    }, 1500);
  };

  return (
    // 5. Apply conditional background class and style
    <div 
      className={`min-h-screen relative ${!isDarkMode ? 'bg-gradient-to-br from-pink-50 via-pink-100 to-orange-50' : ''}`}
      style={isDarkMode ? { backgroundColor: bgColor } : {}}
    >
      {/* Background pattern (same as LoginPage) */}
      {!isDarkMode && (
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFA1A3" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* Header (same as LoginPage) */}
      <header className="shadow-md relative z-10" style={{ backgroundColor: headerBgColor, color: headerTextColor }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl">LocalLoco</h1>
              <p className="text-sm opacity-90">
                Discover and support local businesses in your community - or nearby you!
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Forgot Password Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* 6. Apply card background and text color */}
          <form onSubmit={handleSubmit} className="rounded-lg shadow-lg p-8 space-y-6" style={{ backgroundColor: cardBgColor, color: textColor }}>
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl">Forgot Password?</h2>
              {/* 7. Apply muted text color */}
              <p className="text-sm" style={{ color: mutedTextColor }}>
                No worries! Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
            
            {/* Back to Login */}
            <div className="text-center pt-4">
              <button
                type="button"
                className="text-sm hover:text-foreground flex items-center gap-2 mx-auto"
                style={{ color: mutedTextColor }}
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}