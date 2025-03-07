import { create } from "zustand";
import { Page, Content } from "@prisma/client";

interface DashboardState {
  // Page State
  page: Page | Partial<Page> | null;
  pageId: string | null;
  contents: Content[];

  // Track Changes
  hasUnsavedChanges: boolean;

  // Actions
  setPage: (updates: Partial<Page>) => void;
  setPageId: (pageId: string) => void;

  setContents: (contents: Content[]) => void;
  addContent: (content: Content) => void;
  removeContent: (id: string) => void;
  reorderContents: (contents: Content[]) => void;

  updateContent: (content: Content) => void;

  // Save Changes
  saveChanges: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial State
  page: null,
  pageId: null,

  contents: [],

  hasUnsavedChanges: false,

  // Actions
  setPage(updates) {
    set((state) => {
      if (!state.page) {
        // If there's no page yet, initialize it
        return {
          page: { ...updates },
          hasUnsavedChanges: true,
        };
      }
      return {
        page: { ...state.page, ...updates },
        hasUnsavedChanges: true,
      };
    });
  },

  setPageId: (pageId: string) => set({ pageId }),

  updateContent: (content) => {
    set((state) => ({
      contents: state.contents.map((l) => (l.id === content.id ? content : l)),
      hasUnsavedChanges: true,
    }));
  },
  setContents: (contents) => set({ contents, hasUnsavedChanges: true }),
  addContent: (content) => set((state) => ({ contents: [...state.contents, content], hasUnsavedChanges: true })),
  removeContent: (id) => set((state) => ({ contents: state.contents.filter((l) => l.id !== id), hasUnsavedChanges: true })),
  reorderContents: (contents) => set({ contents, hasUnsavedChanges: true }),

  // Save Changes
  saveChanges: async () => {
    try {
      const state = get();
      const pageId = state.pageId;

      if (!pageId) {
        console.error("No page ID found. Cannot save changes.");
        return;
      }
      console.log("saveChanges called with state:", state.page, state.contents);

      // Ensure localContents & localPage are always defined
      const updatedPage = state.page || {};
      const updatedContents = state.contents || [];

      // 🚀 Send update requests
      await fetch("/api/page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPage),
      });

      // Updated Contents call with /api/contents/[pageId]/route.ts
      await fetch(`/api/contents/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContents),
      });

      // ✅ Clear local state correctly after saving
      set((state) => ({
        page: state.page ? { ...state.page, ...updatedPage } : null,
        contents: [...updatedContents],
        hasUnsavedChanges: false,
      }));

      console.log("✅ Changes saved successfully!");
    } catch (error) {
      console.error("❌ Error saving changes:", error);
    }
  },
}));
