
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { NoteCard } from "@/components/NoteCard";
import { ImageCard } from "@/components/ImageCard";
import { NoteEditor } from "@/components/NoteEditor";
import { ImageUploader } from "@/components/ImageUploader";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const {
    notes,
    images,
    activeCategory,
    viewMode,
    contentType,
    setSelectedNote,
  } = useApp();
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

  // Filter notes or images based on the active category
  const filteredItems = contentType === "notes"
    ? notes.filter((note) => activeCategory === "All" || note.category === activeCategory)
    : images.filter((image) => activeCategory === "All" || image.category === activeCategory);

  // Handle creating a new note
  const handleNewNote = () => {
    setSelectedNote(null); // This will open the editor with a blank note
  };

  // Handle creating a new image
  const handleNewImage = () => {
    setIsImageUploaderOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-screen-2xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {contentType === "notes" ? "My Notes" : "My Images"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeCategory === "All"
                ? `All ${contentType}`
                : `${activeCategory} ${contentType}`}
              {" — "}
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
            </p>
          </div>
          
          <div className="flex">
            <Button
              onClick={contentType === "notes" ? handleNewNote : handleNewImage}
              className="inline-flex items-center gap-2"
            >
              <Plus size={16} />
              <span>New {contentType === "notes" ? "Note" : "Image"}</span>
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              {contentType === "notes" ? (
                <FileText size={28} className="text-muted-foreground" />
              ) : (
                <ImageIcon size={28} className="text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">No {contentType} found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {contentType === "notes"
                ? "You haven't created any notes in this category yet. Create your first note to get started."
                : "You haven't uploaded any images in this category yet. Upload your first image to get started."}
            </p>
            <Button
              onClick={contentType === "notes" ? handleNewNote : handleNewImage}
              className="inline-flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Create {contentType === "notes" ? "Note" : "Image"}</span>
            </Button>
          </div>
        )}

        {/* Content grid/list */}
        {filteredItems.length > 0 && (
          <div
            className={cn(
              "grid gap-4 animate-enter",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}
          >
            {contentType === "notes"
              ? filteredItems.map((note) => (
                  <NoteCard key={note.id} note={note} view={viewMode} />
                ))
              : filteredItems.map((image) => (
                  <ImageCard key={image.id} image={image} view={viewMode} />
                ))}
          </div>
        )}
      </div>

      {/* Editors and uploaders */}
      <NoteEditor />
      <ImageUploader 
        open={isImageUploaderOpen} 
        onOpenChange={setIsImageUploaderOpen} 
      />
    </Layout>
  );
};

export default Index;
