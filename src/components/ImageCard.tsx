
import { ImageItem } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Calendar, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImageCardProps {
  image: ImageItem;
  view: "grid" | "list";
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, view }) => {
  const { deleteImage, updateImage } = useApp();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleEdit = () => {
    // Open edit modal with the current image
    // This would be implemented in a real app
    console.log("Edit image:", image);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteImage(image.id);
    setIsDeleteDialogOpen(false);
  };

  const handleImageClick = () => {
    setIsViewDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Personal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Work":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Ideas":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Archive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
    }
  };

  return (
    <>
      <div 
        className={cn(
          "group relative border rounded-xl overflow-hidden transition-all duration-300 animate-enter glass-card cursor-pointer",
          view === "grid" ? "h-[280px]" : "h-auto"
        )}
        onClick={handleImageClick}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-foreground/5 transition-opacity duration-300" />
        
        <div className="h-full flex flex-col">
          {/* Image container */}
          <div className="relative h-40 bg-muted/50 overflow-hidden flex items-center justify-center">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-shimmer"></div>
            )}
            <div className={cn("absolute inset-0 transition-opacity duration-300", imageLoaded ? "opacity-100" : "opacity-0")}>
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            {!imageLoaded && (
              <ImageIcon size={24} className="text-muted-foreground" />
            )}
          </div>
          
          {/* Content */}
          <div className="px-6 py-4 flex-1">
            <div className="flex justify-between items-start mb-2">
              <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded", getCategoryColor(image.category))}>
                {image.category}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <h3 className="text-lg font-medium line-clamp-1">{image.title}</h3>
            
            {/* Footer */}
            <div className="flex items-center mt-3 pt-3 border-t text-xs text-muted-foreground">
              <Calendar size={14} className="mr-1" />
              <time dateTime={image.createdAt.toISOString()}>
                {format(new Date(image.createdAt), "MMM d, yyyy")}
              </time>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View image dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{image.title}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-2">
            <img
              src={image.url}
              alt={image.title}
              className="max-h-[70vh] max-w-full object-contain rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
