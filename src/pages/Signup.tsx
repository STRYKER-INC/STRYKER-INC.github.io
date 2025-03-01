
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus } from "lucide-react";

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    message: "Too weak",
    color: "bg-destructive",
  });
  
  const { signup } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const requirements = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
    
    const score = Object.values(requirements).filter(Boolean).length;
    
    setPasswordStrength({
      score,
      message: getPasswordStrengthMessage(score),
      color: getPasswordStrengthColor(score),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    
    if (passwordStrength.score < 3) {
      toast.error("Password is too weak");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(username, email, password);
      if (success) {
        toast.success("Account created successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordStrength = () => {
    const { score } = passwordStrength;
    
    return (
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            Password strength: {passwordStrength.message}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${passwordStrength.color}`} 
            style={{ width: `${(score / 5) * 100}%` }}
          ></div>
        </div>
        
        <div className="mt-3 space-y-1">
          <PasswordRequirement 
            text="At least 8 characters" 
            met={password.length >= 8} 
          />
          <PasswordRequirement 
            text="At least one uppercase letter" 
            met={/[A-Z]/.test(password)} 
          />
          <PasswordRequirement 
            text="At least one lowercase letter" 
            met={/[a-z]/.test(password)} 
          />
          <PasswordRequirement 
            text="At least one number" 
            met={/[0-9]/.test(password)} 
          />
          <PasswordRequirement 
            text="At least one special character" 
            met={/[^A-Za-z0-9]/.test(password)} 
          />
        </div>
      </div>
    );
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="animated-background"></div>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
        <div className="w-full max-w-md">
          <div className="p-8 rounded-xl shadow-xl bg-card/80 backdrop-blur-sm border">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
              <p className="text-muted-foreground">Sign up to start using Stryker Utility</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                
                {password && renderPasswordStrength()}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    disabled={isLoading}
                  />
                </div>
                
                {password && confirmPassword && (
                  <div className="mt-2">
                    {password !== confirmPassword ? (
                      <p className="text-xs text-destructive">Passwords do not match</p>
                    ) : (
                      <p className="text-xs text-green-500">Passwords match</p>
                    )}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </span>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper component for password requirements
const PasswordRequirement = ({ text, met }: { text: string; met: boolean }) => (
  <div className="flex items-center gap-2">
    <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500' : 'bg-muted-foreground/50'}`}></div>
    <span className={`text-xs ${met ? 'text-green-500' : 'text-muted-foreground'}`}>{text}</span>
  </div>
);

// Helper functions for password strength
const getPasswordStrengthMessage = (score: number): string => {
  if (score === 0) return "Too weak";
  if (score === 1) return "Weak";
  if (score === 2) return "Fair";
  if (score === 3) return "Good";
  if (score === 4) return "Strong";
  return "Very strong";
};

const getPasswordStrengthColor = (score: number): string => {
  if (score < 2) return "bg-destructive";
  if (score < 3) return "bg-yellow-500";
  if (score < 4) return "bg-blue-500";
  return "bg-green-500";
};

export default Signup;
