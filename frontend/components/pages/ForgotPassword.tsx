// src/components/pages/forgot-password.tsx
import React, { useState } from 'react';
import { Store, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useThemeStore } from '../../store/themeStore';
// 1. Import the authClient
import { authClient } from '../../lib/authClient';

interface ForgotPasswordPageProps {
  onBack: () => void;
  onEmailSent: (email: string) => void;
}

// 2. Define the URL your backend will send in the reset email.
// This URL must point to your React app's reset password page.
const redirectTo = 'http://localhost:3000/reset-password'; 

export function ForgotPasswordPage({ onBack, onEmailSent }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // ... (all theme color variables remain the same) ...
  const headerBgColor = isDarkMode ? '#3a3a3a' : '#ffffff';
  const headerTextColor = isDarkMode ? '#ffffff' : '#000000';
  const bgColor = isDarkMode ? '#3a3a3a' : '';
  const cardBgColor = isDarkMode ? '#2a2a2a' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const mutedTextColor = isDarkMode ? '#a1a1aa' : '#6b7280';


  // 3. Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await authClient.requestPasswordReset({
        email: email,
        redirectTo: redirectTo,
      });

      if (error) {
        console.error("Reset request failed:", error);
        toast.error(error.message || "Failed to send reset link. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (data) {
        console.log("Password reset link sent");
        toast.success('Password reset link sent! Please check your email.');
        onEmailSent(email);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }

    setIsSubmitting(false);
  };

  return (
    // ... (the rest of your JSX remains exactly the same) ...
    <div 
      className={`min-h-screen relative ${!isDarkMode ? 'bg-gradient-to-br from-pink-50 via-pink-100 to-orange-50' : ''}`}
      style={isDarkMode ? { backgroundColor: bgColor } : {}}
    >
        {/* ... header, background, etc. ... */}
        <header /* ... */ >
            {/* ... */ }
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 relative z-10">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="rounded-lg shadow-lg p-8 space-y-6" style={{ backgroundColor: cardBgColor, color: textColor }}>
                    {/* ... (form content) ... */}
                    <div className="text-center space-y-2">
                        {/* ... */}
                        <h2 className="text-2xl">Forgot Password?</h2>
                        <p className="text-sm" style={{ color: mutedTextColor }}>
                            No worries! Enter your registered email address and we'll send you a link to reset your password.
                        </p>
                    </div>

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

                    <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    
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