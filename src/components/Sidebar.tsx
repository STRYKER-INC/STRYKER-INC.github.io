
import { useApp } from "@/context/AppContext";
import { CategoryType, ContentType } from "@/lib/types";
import {
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Archive,
  Briefcase,
  User,
  Lightbulb,
  Plus,
  Search,
  Grid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";

export const Sidebar = () => {
  const {
    activeCategory,
    setActiveCategory,
    contentType,
    setContentType,
    viewMode,
    setViewMode,
    notes,
    images,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const categories: { type: CategoryType; icon: JSX.Element; count: number }[] = [
    {
      type: "All",
      icon: <FolderOpen size={18} />,
      count: contentType === "notes" ? notes.length : images.length,
    },
    {
      type: "Personal",
      icon: <User size={18} />,
      count: contentType === "notes"
        ? notes.filter((note) => note.category === "Personal").length
        : images.filter((image) => image.category === "Personal").length,
    },
    {
      type: "Work",
      icon: <Briefcase size={18} />,
      count: contentType === "notes"
        ? notes.filter((note) => note.category === "Work").length
        : images.filter((image) => image.category === "Work").length,
    },
    {
      type: "Ideas",
      icon: <Lightbulb size={18} />,
      count: contentType === "notes"
        ? notes.filter((note) => note.category === "Ideas").length
        : images.filter((image) => image.category === "Ideas").length,
    },
    {
      type: "Archive",
      icon: <Archive size={18} />,
      count: contentType === "notes"
        ? notes.filter((note) => note.category === "Archive").length
        : images.filter((image) => image.category === "Archive").length,
    },
  ];

  return (
    <div className="h-full w-full border-r bg-sidebar flex flex-col">
      {/* Sidebar header */}
      <div className="h-16 flex items-center px-4 border-b">
        <div className="flex-1">
          <h2 className="text-xl font-medium tracking-tight text-sidebar-foreground">
            Noteverse
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9 h-9 bg-secondary text-sm"
          />
        </div>
      </div>

      {/* Content type selection */}
      <div className="px-4 mb-2">
        <div className="flex space-x-1 rounded-md p-1 bg-muted/60">
          <button
            onClick={() => setContentType("notes")}
            className={cn(
              "flex items-center justify-center gap-2 w-1/2 py-1.5 px-2 rounded-sm text-sm font-medium transition-colors",
              contentType === "notes"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <FileText size={16} />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setContentType("images")}
            className={cn(
              "flex items-center justify-center gap-2 w-1/2 py-1.5 px-2 rounded-sm text-sm font-medium transition-colors",
              contentType === "images"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <ImageIcon size={16} />
            <span>Images</span>
          </button>
        </div>
      </div>

      {/* View mode selection */}
      <div className="px-4 mb-4">
        <div className="flex space-x-1 rounded-md p-1 bg-muted/60">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center justify-center gap-2 w-1/2 py-1.5 px-2 rounded-sm text-sm font-medium transition-colors",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Grid size={16} />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center justify-center gap-2 w-1/2 py-1.5 px-2 rounded-sm text-sm font-medium transition-colors",
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <List size={16} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 space-y-1">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 pl-2">
          Categories
        </h3>
        {categories.map((category) => (
          <button
            key={category.type}
            onClick={() => setActiveCategory(category.type)}
            className={cn(
              "w-full flex items-center justify-between text-sm py-2 px-3 rounded-md transition-colors",
              activeCategory === category.type
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <div className="flex items-center gap-3">
              {category.icon}
              <span>{category.type}</span>
            </div>
            <span
              className={cn(
                "text-xs rounded-full px-2",
                activeCategory === category.type
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Create button */}
      <div className="mt-auto px-4 pb-4">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          <span>Create New</span>
        </button>
      </div>
    </div>
  );
};
