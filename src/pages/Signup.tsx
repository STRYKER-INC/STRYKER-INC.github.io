import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Eye, EyeOff, Key, User, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  }>({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
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
      ...requirements,
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
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordStrength = () => {
    const { score } = passwordStrength;
    
    let colorClass = "bg-gray-300";
    let strengthText = "Very weak";
    
    if (score >= 1) {
      colorClass = "bg-red-500";
      strengthText = "Weak";
    }
    if (score >= 3) {
      colorClass = "bg-yellow-500";
      strengthText = "Medium";
    }
    if (score >= 4) {
      colorClass = "bg-green-400";
      strengthText = "Strong";
    }
    if (score >= 5) {
      colorClass = "bg-green-600";
      strengthText = "Very strong";
    }
    
    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`h-1 w-10 rounded-full ${
                  score >= index ? colorClass : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{strengthText}</span>
        </div>
        
        {password.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs">
              {passwordStrength.hasMinLength ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-muted-foreground" />
              )}
              <span className={passwordStrength.hasMinLength ? "text-green-500" : "text-muted-foreground"}>
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {passwordStrength.hasUppercase ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-muted-foreground" />
              )}
              <span className={passwordStrength.hasUppercase ? "text-green-500" : "text-muted-foreground"}>
                Uppercase letter
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {passwordStrength.hasLowercase ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-muted-foreground" />
              )}
              <span className={passwordStrength.hasLowercase ? "text-green-500" : "text-muted-foreground"}>
                Lowercase letter
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {passwordStrength.hasNumber ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-muted-foreground" />
              )}
              <span className={passwordStrength.hasNumber ? "text-green-500" : "text-muted-foreground"}>
                Number
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {passwordStrength.hasSpecialChar ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-muted-foreground" />
              )}
              <span className={passwordStrength.hasSpecialChar ? "text-green-500" : "text-muted-foreground"}>
                Special character
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {password === confirmPassword && confirmPassword ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <AlertCircle size={14} className="text-muted-foreground" />
              )}
              <span className={password === confirmPassword && confirmPassword ? "text-green-500" : "text-muted-foreground"}>
                Passwords match
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
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
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="pl-10"
                  disabled={isLoading}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="pl-10"
                  disabled={isLoading}
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {renderPasswordStrength()}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10"
                  disabled={isLoading}
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
