import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Upload, X, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionUploadProps {
  onUploadComplete?: (url: string) => void;
  existingUrl?: string;
  className?: string;
}

export const PrescriptionUpload = ({ onUploadComplete, existingUrl, className }: PrescriptionUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingUrl || null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Ungültiger Dateityp",
          description: "Nur JPG, PNG und PDF-Dateien sind erlaubt",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Datei zu groß",
          description: "Die Datei darf maximal 5 MB groß sein",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Benutzer nicht angemeldet');
      }

      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;
      setUploadedUrl(publicUrl);
      onUploadComplete?.(publicUrl);

      toast({
        title: "Upload erfolgreich",
        description: "Die Verordnung wurde hochgeladen",
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload fehlgeschlagen",
        description: error.message || "Ein Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!uploadedUrl) return;

    try {
      // Extract file path from URL
      const url = new URL(uploadedUrl);
      const filePath = url.pathname.split('/storage/v1/object/public/prescriptions/')[1];
      
      if (filePath) {
        await supabase.storage
          .from('prescriptions')
          .remove([filePath]);
      }

      setUploadedUrl(null);
      onUploadComplete?.(null);

      toast({
        title: "Datei entfernt",
        description: "Die Verordnung wurde entfernt",
      });
    } catch (error: any) {
      console.error('Remove error:', error);
      toast({
        title: "Entfernen fehlgeschlagen",
        description: error.message || "Ein Fehler ist aufgetreten",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <Label>Verordnung hochladen</Label>
          
          {!uploadedUrl ? (
            <div>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="prescription-upload"
              />
              <Label
                htmlFor="prescription-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Klicken zum Hochladen</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG oder PDF (max. 5MB)
                  </p>
                </div>
              </Label>
              {uploading && (
                <p className="text-sm text-muted-foreground mt-2">
                  Uploading...
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm truncate">Verordnung hochgeladen</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(uploadedUrl, '_blank')}
                >
                  Anzeigen
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};