
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/lib/types";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ open, onOpenChange }) => {
  const { addImage } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryType>("Personal");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setCategory("Personal");
    setImagePreview(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
        
        // Auto-fill title from filename if empty
        if (!title) {
          // Remove extension and replace hyphens/underscores with spaces
          const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          // Capitalize first letter of each word
          const formattedName = fileName.replace(/\b\w/g, (c) => c.toUpperCase());
          setTitle(formattedName);
        }
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!imagePreview) {
      toast.error("Please upload an image");
      return;
    }
    
    addImage({
      title,
      url: imagePreview,
      category,
    });
    
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CategoryType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Ideas">Ideas</SelectItem>
                <SelectItem value="Archive">Archive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Image</Label>
            {!imagePreview ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <div className="mx-auto flex max-w-[180px] flex-col items-center justify-center text-muted-foreground">
                  <UploadCloud className="mb-2 h-10 w-10" />
                  <div className="mb-2 text-sm font-medium">
                    Drag & drop or click to upload
                  </div>
                  <div className="text-xs">
                    Support: JPG, PNG, GIF (max 5MB)
                  </div>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative rounded-md overflow-hidden border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-contain bg-muted/30"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
