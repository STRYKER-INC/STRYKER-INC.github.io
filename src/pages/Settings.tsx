
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Palette, 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Moon, 
  Sun, 
  Check, 
  KeyRound,
  Eye, 
  EyeOff, 
  Download, 
  Trash2,
  Calendar,
  Globe,
  Languages
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FONT_SIZES = [
  { value: "sm", label: "Small" },
  { value: "base", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

const THEMES = [
  { value: "default", label: "Default" },
  { value: "purple", label: "Purple" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
];

const DATE_FORMATS = [
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
  { value: "dd.MM.yyyy", label: "DD.MM.YYYY" },
];

const Settings = () => {
  const { user } = useApp();
  
  // State for Appearance settings
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("base");
  const [theme, setTheme] = useState("default");
  
  // State for Profile settings
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // State for Account Preferences
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
  
  // State for Privacy & Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [dataCollection, setDataCollection] = useState(true);
  
  // Profile picture state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdatingProfile(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };
  
  // Handle password update
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    setIsUpdatingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    }, 1000);
  };
  
  // Handle preferences update
  const handlePreferencesUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPreferences(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdatingPreferences(false);
      toast.success("Preferences updated successfully");
    }, 1000);
  };
  
  // Handle 2FA toggle
  const handleToggle2FA = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    toast.success(`Two-factor authentication ${checked ? 'enabled' : 'disabled'}`);
  };
  
  // Handle dark mode toggle
  const handleToggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    // Apply dark mode to document
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.success(`Dark mode ${checked ? 'enabled' : 'disabled'}`);
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    // In a real app, you would show a confirmation dialog
    toast.error("This would delete your account (not implemented in demo)");
  };
  
  // Handle data download
  const handleDownloadData = () => {
    toast.success("Your data export has been initiated. You will receive an email soon.");
  };
  
  // Apply font size classes based on selection
  const applyFontSize = (size: string) => {
    document.documentElement.style.setProperty(
      '--font-size-base', 
      size === 'sm' ? '0.875rem' : 
      size === 'lg' ? '1.125rem' : 
      size === 'xl' ? '1.25rem' : 
      '1rem'
    );
    toast.success(`Font size updated to ${size}`);
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto pb-12">
        <div className="flex flex-col items-start gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how Stryker Utility looks and feels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes.
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={handleToggleDarkMode}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Font Size Selector */}
                  <div className="space-y-4">
                    <div>
                      <Label>Font Size</Label>
                      <p className="text-sm text-muted-foreground">
                        Adjust the text size of the application.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {FONT_SIZES.map((size) => (
                        <Button
                          key={size.value}
                          type="button"
                          variant={fontSize === size.value ? "default" : "outline"}
                          className="flex-1 min-w-20"
                          onClick={() => {
                            setFontSize(size.value);
                            applyFontSize(size.value);
                          }}
                        >
                          {fontSize === size.value && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          {size.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Theme Selector */}
                  <div className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose a color theme for the application.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {THEMES.map((t) => (
                        <div
                          key={t.value}
                          className={cn(
                            "cursor-pointer relative flex h-16 items-center justify-center rounded-md border-2",
                            theme === t.value
                              ? "border-primary"
                              : "border-muted hover:border-muted-foreground/50"
                          )}
                          onClick={() => setTheme(t.value)}
                        >
                          <div
                            className={cn(
                              "w-full h-full rounded-sm",
                              t.value === "default" && "bg-gradient-to-br from-primary/20 to-secondary/20",
                              t.value === "purple" && "bg-gradient-to-br from-purple-500/20 to-purple-700/20",
                              t.value === "blue" && "bg-gradient-to-br from-blue-500/20 to-blue-700/20",
                              t.value === "green" && "bg-gradient-to-br from-green-500/20 to-green-700/20"
                            )}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span>{t.label}</span>
                            {theme === t.value && (
                              <Check className="absolute right-2 top-2 h-4 w-4 text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                      {/* Profile Picture */}
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border">
                            {profileImage ? (
                              <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-12 w-12 text-muted-foreground" />
                            )}
                          </div>
                          <label
                            htmlFor="profile-upload"
                            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            <input
                              type="file"
                              id="profile-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        <div className="text-center">
                          <h3 className="font-medium">{username || "Your Name"}</h3>
                          <p className="text-sm text-muted-foreground">{email || "your.email@example.com"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Username */}
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      
                      {/* Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="min-h-32"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                          Updating...
                        </span>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Confirm New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {confirmPassword && newPassword && confirmPassword !== newPassword && (
                        <p className="text-sm text-destructive mt-1">Passwords do not match</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={
                        isUpdatingPassword || 
                        !currentPassword || 
                        !newPassword || 
                        !confirmPassword ||
                        newPassword !== confirmPassword
                      }
                    >
                      {isUpdatingPassword ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                          Updating...
                        </span>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                  {/* Language Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      <Label htmlFor="language">Language</Label>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred language for the interface.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  {/* Timezone Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <Label htmlFor="timezone">Timezone</Label>
                    </div>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Set your timezone for accurate time display.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  {/* Date Format Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <Label htmlFor="date-format">Date Format</Label>
                    </div>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        {DATE_FORMATS.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose how dates are displayed throughout the application.
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={isUpdatingPreferences}>
                    {isUpdatingPreferences ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
                        Saving...
                      </span>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your security and privacy settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Switch
                      id="2fa"
                      checked={twoFactorEnabled}
                      onCheckedChange={handleToggle2FA}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Session Management */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically sign out after period of inactivity.
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="session-timeout"
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        min="1"
                        max="1440"
                        className="w-24"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          toast.success("Session timeout updated");
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Data Collection */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect anonymous usage data to improve our service.
                      </p>
                    </div>
                    <Switch
                      id="data-collection"
                      checked={dataCollection}
                      onCheckedChange={setDataCollection}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Download Data */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Export Your Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of your personal data.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleDownloadData}
                    >
                      <Download className="h-4 w-4" />
                      Download Data
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  {/* Delete Account */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all your data.
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="flex items-center gap-2"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
