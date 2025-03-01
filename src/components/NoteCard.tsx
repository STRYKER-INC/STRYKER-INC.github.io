
import { Note } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Calendar } from "lucide-react";
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

interface NoteCardProps {
  note: Note;
  view: "grid" | "list";
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, view }) => {
  const { deleteNote, setSelectedNote } = useApp();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Format the content to show a preview
  const contentPreview = note.content.length > 150
    ? note.content.substring(0, 150) + "..."
    : note.content;

  const handleEdit = () => {
    setSelectedNote(note);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteNote(note.id);
    setIsDeleteDialogOpen(false);
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

  // Helper function to ensure we have a proper Date object
  const getFormattedDate = (dateValue: Date | string) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return format(date, "MMM d, yyyy");
  };

  return (
    <>
      <div 
        className={cn(
          "group relative border rounded-xl overflow-hidden transition-all duration-300 animate-enter glass-card",
          view === "grid" ? "h-[280px]" : "h-auto"
        )}
        onClick={handleEdit}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-foreground/5 transition-opacity duration-300" />
        
        <div className="px-6 py-5 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded", getCategoryColor(note.category))}>
                {note.category}
              </span>
            </div>
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
          
          {/* Content */}
          <h3 className="text-lg font-medium mb-2 line-clamp-1">{note.title}</h3>
          <div className="text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4 mb-auto">
            {contentPreview}
          </div>
          
          {/* Footer */}
          <div className="flex items-center mt-3 pt-3 border-t text-xs text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <time dateTime={new Date(note.updatedAt).toISOString()}>
              {getFormattedDate(note.updatedAt)}
            </time>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
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
    </>
  );
};
