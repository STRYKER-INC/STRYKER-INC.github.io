
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Note, ImageItem, CategoryType, ViewMode, ContentType } from "@/lib/types";
import { toast } from "sonner";

// Sample data
const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Welcome to Noteverse",
    content: "This is your personal space for thoughts, ideas, and inspiration. Start by creating a new note or uploading an image.",
    category: "Personal",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "note-2",
    title: "Getting Started",
    content: "Click on the + button to create a new note or upload an image. You can organize your content using categories.",
    category: "Ideas",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
];

const INITIAL_IMAGES: ImageItem[] = [
  {
    id: "image-1",
    title: "Inspiration",
    url: "/placeholder.svg",
    category: "Ideas",
    createdAt: new Date(),
  },
];

interface User {
  id: string;
  username: string;
  email: string;
}

interface AppContextType {
  notes: Note[];
  images: ImageItem[];
  activeCategory: CategoryType;
  viewMode: ViewMode;
  contentType: ContentType;
  selectedNote: Note | null;
  sidebarOpen: boolean;
  isMobile: boolean;
  user: User | null;
  isAuthenticated: boolean;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addImage: (image: Omit<ImageItem, "id" | "createdAt">) => void;
  deleteImage: (id: string) => void;
  updateImage: (id: string, image: Partial<ImageItem>) => void;
  setActiveCategory: (category: CategoryType) => void;
  setViewMode: (mode: ViewMode) => void;
  setContentType: (type: ContentType) => void;
  setSelectedNote: (note: Note | null) => void;
  setSidebarOpen: (open: boolean) => void;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("noteverse-notes");
    return savedNotes ? JSON.parse(savedNotes) : INITIAL_NOTES;
  });
  
  const [images, setImages] = useState<ImageItem[]>(() => {
    const savedImages = localStorage.getItem("noteverse-images");
    return savedImages ? JSON.parse(savedImages) : INITIAL_IMAGES;
  });
  
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [contentType, setContentType] = useState<ContentType>("notes");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("noteverse-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const isAuthenticated = user !== null;

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("noteverse-notes", JSON.stringify(notes));
  }, [notes]);

  // Save images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("noteverse-images", JSON.stringify(images));
  }, [images]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("noteverse-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("noteverse-user");
    }
  }, [user]);

  // User authentication functions
  // In a real app, these would connect to a backend
  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo: Get users from localStorage
    const users = JSON.parse(localStorage.getItem("noteverse-users") || "[]");
    
    // Find user with case-insensitive username match
    const foundUser = users.find((u: any) => 
      u.username.toLowerCase() === username.toLowerCase()
    );
    
    if (foundUser && foundUser.password === password) {
      // Don't include password in the user state
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast.success("Login successful");
      return true;
    }
    
    toast.error("Invalid username or password");
    return false;
  };
  
  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("noteverse-users") || "[]");
    
    // Check if username or email already exists (case-insensitive for username)
    const usernameExists = users.some((u: any) => 
      u.username.toLowerCase() === username.toLowerCase()
    );
    
    const emailExists = users.some((u: any) => u.email === email);
    
    if (usernameExists) {
      toast.error("Username already exists");
      return false;
    }
    
    if (emailExists) {
      toast.error("Email already exists");
      return false;
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password, // In a real app, this would be hashed
    };
    
    // Add to users list
    users.push(newUser);
    localStorage.setItem("noteverse-users", JSON.stringify(users));
    
    // Log in the user (without password in state)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    
    toast.success("Account created successfully");
    return true;
  };
  
  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  const addNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setNotes((prev) => [newNote, ...prev]);
    toast.success("Note created successfully");
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
    toast.success("Note updated successfully");
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
    toast.success("Note deleted successfully");
  };

  const addImage = (image: Omit<ImageItem, "id" | "createdAt">) => {
    const newImage: ImageItem = {
      ...image,
      id: `image-${Date.now()}`,
      createdAt: new Date(),
    };
    
    setImages((prev) => [newImage, ...prev]);
    toast.success("Image added successfully");
  };

  const updateImage = (id: string, updates: Partial<ImageItem>) => {
    setImages((prev) =>
      prev.map((image) =>
        image.id === id
          ? { ...image, ...updates }
          : image
      )
    );
    toast.success("Image updated successfully");
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
    toast.success("Image deleted successfully");
  };

  return (
    <AppContext.Provider
      value={{
        notes,
        images,
        activeCategory,
        viewMode,
        contentType,
        selectedNote,
        sidebarOpen,
        isMobile,
        user,
        isAuthenticated,
        addNote,
        updateNote,
        deleteNote,
        addImage,
        updateImage,
        deleteImage,
        setActiveCategory,
        setViewMode,
        setContentType,
        setSelectedNote,
        setSidebarOpen,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
