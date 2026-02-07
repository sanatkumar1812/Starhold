import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Camera, Save, User, MapPin, FileText, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const ProfileSettings = () => {
  const {
    user,
    profile,
    updateProfile,
    uploadAvatar,
    updateEmail,
    updatePassword,
    deleteAccount
  } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
  });

  // City Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCity = (city: any) => {
    const coords = `${parseFloat(city.lat).toFixed(4)},${parseFloat(city.lon).toFixed(4)}`;
    setFormData({ ...formData, location: coords });
    setSearchResults([]);
    setSearchQuery(city.display_name.split(',')[0]);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const url = await uploadAvatar(file);
      // No need for success toast here, useAuth handles it
    } catch (error) {
      console.error('Avatar change error:', error);
      toast.error('An unexpected error occurred during upload');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await updateProfile({
      display_name: formData.display_name || null,
      bio: formData.bio || null,
      location: formData.location || null,
    });

    if (success) {
      toast.success('Profile updated successfully');
    }
    setIsLoading(false);
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Card className="bg-background/60 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Customize your profile and personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <label htmlFor="avatar-upload" className="cursor-pointer block relative">
                <Avatar className="w-20 h-20 transition-opacity group-hover:opacity-80">
                  <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Profile Photo</p>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Uploading...' : 'Click to upload a new photo (max 5MB)'}
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Display Name
            </Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Your display name"
              className="bg-background/50"
            />
          </div>

          {/* Location / City Search */}
          <div className="space-y-4">
            <div className="relative space-y-2">
              <Label htmlFor="city_search" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Search Home City
              </Label>
              <div className="relative">
                <Input
                  id="city_search"
                  placeholder="Enter city name (e.g. London, Tokyo)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-background/50 h-10 pr-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {searchResults.length > 0 && (
                <div className="absolute top-[72px] left-0 right-0 bg-slate-900 border border-border/50 rounded-xl overflow-hidden z-50 shadow-2xl backdrop-blur-xl">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectCity(result)}
                      className="w-full px-4 py-3 text-left hover:bg-primary/20 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="text-sm font-medium">{result.display_name.split(',')[0]}</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {result.display_name.split(',').slice(1).join(',').trim()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                Saved Coordinates (lat, lng)
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="40.7128, -74.0060"
                className="bg-background/50 font-mono text-xs"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="bg-background/50 min-h-[100px]"
            />
          </div>



          <Button type="submit" disabled={isLoading} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>

      <Separator className="bg-white/10" />

      {/* Account Security */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Account Security
        </CardTitle>
        <CardDescription>
          Manage your email and password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_email">New Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="new_email"
                type="email"
                placeholder="new@example.com"
                className="bg-background/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const email = (e.target as HTMLInputElement).value;
                    if (email) updateEmail(email);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  if (input.value) updateEmail(input.value);
                }}
              >
                Update Email
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="flex gap-2">
              <Input
                id="new_password"
                type="password"
                placeholder="••••••••"
                className="bg-background/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const password = (e.target as HTMLInputElement).value;
                    if (password) updatePassword(password);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  if (input.value) updatePassword(input.value);
                }}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <Separator className="bg-white/10" />

      {/* Danger Zone */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            if (confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
              deleteAccount();
            }
          }}
        >
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
};
