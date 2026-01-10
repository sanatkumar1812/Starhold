import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarMap } from '@/components/StarMap';
import { generateCoordinates, formatRA, formatDec, getTimeUntilUnlock } from '@/lib/coordinates';
import { Calendar, Lock, Star, Sparkles, ArrowRight, ArrowLeft, Check, ImagePlus, X, Save, Loader2, Film } from 'lucide-react';
import { toast } from 'sonner';
import { useMemories } from '@/hooks/useMemories';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface MemoryData {
  recipientName: string;
  message: string;
  unlockDate: Date;
  unlockTime: string;
  senderName: string;
  mediaFiles: File[];
}

export const MemoryCreator = () => {
  const [step, setStep] = useState(1);
  const [memoryData, setMemoryData] = useState<MemoryData>({
    recipientName: '',
    message: '',
    unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    unlockTime: '00:00',
    senderName: '',
    mediaFiles: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createMemory } = useMemories();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const oversizedFiles = newFiles.filter(f => f.size > 50 * 1024 * 1024); // 50MB

      if (oversizedFiles.length > 0) {
        toast.error('Some files are too large', {
          description: 'Maximum size per file is 50MB.'
        });
        return;
      }

      setMemoryData(prev => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...newFiles].slice(0, 10) // Max 10 files
      }));
    }
  };

  const removeFile = (index: number) => {
    setMemoryData(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  };

  const coordinates = memoryData.message && memoryData.recipientName
    ? generateCoordinates(memoryData.message, memoryData.unlockDate, memoryData.recipientName, user?.id)
    : null;

  const timeUntil = getTimeUntilUnlock(memoryData.unlockDate);

  const handleNext = () => {
    if (step === 1 && !memoryData.recipientName) {
      toast.error('Please enter the recipient\'s name');
      return;
    }
    if (step === 2 && !memoryData.message) {
      toast.error('Please write your message');
      return;
    }
    if (step === 3 && memoryData.unlockDate <= new Date()) {
      toast.error('Please select a future date');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreate = () => {
    toast.success('Your cosmic memory has been encoded!', {
      description: 'The star map is ready for download.',
    });
  };

  const handleSaveMemory = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to save your memory', {
        action: {
          label: 'Log in',
          onClick: () => navigate('/auth'),
        },
      });
      return;
    }

    if (!coordinates) return;

    setIsSaving(true);
    setUploadProgress(0);

    try {
      // Upload files to storage
      const uploadedUrls: string[] = [];

      if (memoryData.mediaFiles.length > 0) {
        for (let i = 0; i < memoryData.mediaFiles.length; i++) {
          const file = memoryData.mediaFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${i}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError, data } = await supabase.storage
            .from('memory-attachments')
            .upload(filePath, file, {
              contentType: file.type,
              upsert: true
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error(`Failed to upload ${file.name}`);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from('memory-attachments')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            uploadedUrls.push(urlData.publicUrl);
          }

          setUploadProgress(((i + 1) / memoryData.mediaFiles.length) * 100);
        }
      }

      const success = await createMemory({
        recipient_name: memoryData.recipientName,
        title: memoryData.senderName ? `From ${memoryData.senderName}` : undefined,
        message: memoryData.message,
        constellation: coordinates.constellation,
        star_coordinates: { ra: coordinates.ra, dec: coordinates.dec },
        unlock_date: memoryData.unlockDate.toISOString().split('T')[0],
        unlock_time: memoryData.unlockTime + ':00',
        attachment_url: uploadedUrls.length > 0 ? uploadedUrls.join(',') : undefined,
      });

      if (success) {
        toast.success('Memory saved to the cosmos!', {
          description: 'View it in your dashboard anytime.',
          action: {
            label: 'View Dashboard',
            onClick: () => navigate('/dashboard'),
          },
        });
      }
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error('Failed to save memory');
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${s === step
                ? 'gradient-gold text-primary-foreground scale-110'
                : s < step
                  ? 'bg-primary/30 text-primary'
                  : 'bg-muted text-muted-foreground'
                }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`w-16 h-0.5 mx-2 transition-colors duration-500 ${s < step ? 'bg-primary/50' : 'bg-muted'
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="glass-strong rounded-2xl p-8 md:p-12">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-3">
              <Star className="w-12 h-12 text-primary mx-auto" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Who is this memory for?
              </h2>
              <p className="text-muted-foreground">
                The stars will encode this name into your unique celestial coordinates
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-sm text-muted-foreground">
                  Recipient's Name
                </Label>
                <Input
                  id="recipient"
                  value={memoryData.recipientName}
                  onChange={(e) => setMemoryData({ ...memoryData, recipientName: e.target.value })}
                  placeholder="Enter their name..."
                  className="h-14 text-lg bg-background/50 border-border/50 text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender" className="text-sm text-muted-foreground">
                  Your Name (optional)
                </Label>
                <Input
                  id="sender"
                  value={memoryData.senderName}
                  onChange={(e) => setMemoryData({ ...memoryData, senderName: e.target.value })}
                  placeholder="From..."
                  className="h-12 bg-background/50 border-border/50 text-center"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-3">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Write your memory
              </h2>
              <p className="text-muted-foreground">
                A message that will travel through time, waiting among the stars
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <Textarea
                value={memoryData.message}
                onChange={(e) => setMemoryData({ ...memoryData, message: e.target.value })}
                placeholder="Dear future self... / To my beloved... / When you read this..."
                className="min-h-[200px] text-lg bg-background/50 border-border/50 resize-none leading-relaxed"
              />
              <p className="text-right text-sm text-muted-foreground">
                {memoryData.message.length} characters
              </p>

              {/* Media Upload Section */}
              <div className="space-y-3 pt-4 border-t border-border/30">
                <Label className="text-sm text-muted-foreground">
                  Attach Photos or Videos (optional)
                </Label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3">
                  {memoryData.mediaFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative group w-20 h-20 rounded-lg overflow-hidden bg-background/50 border border-border/50"
                    >
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary">
                          <Film className="w-6 h-6 mb-1" />
                          <span className="text-[10px] text-center px-1 font-mono line-clamp-2">
                            {file.name}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {memoryData.mediaFiles.length < 10 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ImagePlus className="w-5 h-5" />
                      <span className="text-xs">Add</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {memoryData.mediaFiles.length}/10 files attached
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-3">
              <Lock className="w-12 h-12 text-primary mx-auto" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                When should it unlock?
              </h2>
              <p className="text-muted-foreground">
                Choose the moment when the stars will reveal your message
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="unlockDate" className="text-sm text-muted-foreground">
                    Unlock Date
                  </Label>
                  <Input
                    id="unlockDate"
                    type="date"
                    value={memoryData.unlockDate.toISOString().split('T')[0]}
                    onChange={(e) => setMemoryData({ ...memoryData, unlockDate: new Date(e.target.value) })}
                    min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="h-14 text-lg bg-background/50 border-border/50 text-center"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label htmlFor="unlockTime" className="text-sm text-muted-foreground">
                    Time
                  </Label>
                  <Input
                    id="unlockTime"
                    type="time"
                    value={memoryData.unlockTime}
                    onChange={(e) => setMemoryData({ ...memoryData, unlockTime: e.target.value })}
                    className="h-14 text-lg bg-background/50 border-border/50 text-center"
                  />
                </div>
              </div>

              {/* Time countdown preview */}
              <div className="glass rounded-xl p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">Time until unlock</p>
                <div className="flex justify-center gap-6">
                  {timeUntil.years > 0 && (
                    <div>
                      <p className="text-3xl font-serif text-primary">{timeUntil.years}</p>
                      <p className="text-xs text-muted-foreground">years</p>
                    </div>
                  )}
                  {(timeUntil.months > 0 || timeUntil.years > 0) && (
                    <div>
                      <p className="text-3xl font-serif text-primary">{timeUntil.months}</p>
                      <p className="text-xs text-muted-foreground">months</p>
                    </div>
                  )}
                  <div>
                    <p className="text-3xl font-serif text-primary">{timeUntil.days}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                </div>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: '1 Year', days: 365 },
                  { label: '5 Years', days: 365 * 5 },
                  { label: '10 Years', days: 365 * 10 },
                  { label: '18th Birthday', days: 365 * 18 },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setMemoryData({
                        ...memoryData,
                        unlockDate: new Date(Date.now() + preset.days * 24 * 60 * 60 * 1000),
                      })
                    }
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && coordinates && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Your memory is encoded
              </h2>
              <p className="text-muted-foreground">
                Located in the constellation {coordinates.constellation}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <StarMap
                ra={coordinates.ra}
                dec={coordinates.dec}
                size={280}
                showDownload
                recipientName={memoryData.recipientName}
                unlockDate={memoryData.unlockDate}
                unlockTime={memoryData.unlockTime}
                constellation={coordinates.constellation}
              />

              <div className="space-y-6 text-center md:text-left">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Celestial Address
                  </p>
                  <p className="font-mono text-lg text-primary">
                    α {formatRA(coordinates.ra)}
                  </p>
                  <p className="font-mono text-lg text-primary">
                    δ {formatDec(coordinates.dec)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    For
                  </p>
                  <p className="text-xl font-serif text-foreground">
                    {memoryData.recipientName}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Unlocks
                  </p>
                  <p className="text-foreground">
                    {memoryData.unlockDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button variant="gold" size="lg" onClick={handleCreate}>
                <Calendar className="w-5 h-5 mr-2" />
                Download Star Map
              </Button>
              <Button variant="outline" size="lg">
                Order Physical Print
              </Button>
            </div>

            {/* Save Memory Button */}
            <div className="border-t border-border/30 pt-6 mt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Save this memory to your account to access it anytime
                </p>
                {isSaving && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full max-w-xs mx-auto">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading attachments... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleSaveMemory}
                  disabled={isSaving}
                  className="w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {uploadProgress > 0 ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Complete & Save Memory
                    </>
                  )}
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground">
                    You'll need to log in to save your memory
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between mt-12">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className={step === 1 ? 'invisible' : ''}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="gold" onClick={handleNext}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
