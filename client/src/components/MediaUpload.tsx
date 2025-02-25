import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function MediaUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image or PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      setFile(null);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
        <Button
          onClick={handleUpload}
          disabled={!file}
          className="w-full"
        >
          Upload File
        </Button>
      </div>
    </Card>
  );
}
