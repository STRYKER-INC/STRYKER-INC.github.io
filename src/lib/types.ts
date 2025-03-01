
export type CategoryType = "All" | "Personal" | "Work" | "Ideas" | "Archive";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: CategoryType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageItem {
  id: string;
  title: string;
  url: string;
  category: CategoryType;
  createdAt: Date;
}

export type ViewMode = "grid" | "list";
export type ContentType = "notes" | "images";
