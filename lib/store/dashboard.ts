import { create } from "zustand";
import { Page, SocialLink, Link } from "@prisma/client";

interface DashboardState {
  // Page State
  page: Page | Partial<Page> | null;
  pageId: string | null;
  socialLinks: SocialLink[];
  links: Link[];

  // Local Edits
  localSocialLinks: SocialLink[];

  // Track Changes
  hasUnsavedChanges: boolean;

  // Actions
  setPage: (updates: Partial<Page>) => void;
  setPageId: (pageId: string) => void;
  setSocialLinks: (links: SocialLink[]) => void;

  setLinks: (links: Link[]) => void;
  addLink: (link: Link) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: Link[]) => void;

  updateLink: (link: Link) => void;

  // Save Changes
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial State
  page: null,
  pageId: null,
  socialLinks: [],
  links: [],
  localSocialLinks: [],

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
  setSocialLinks: (links) => {
    set({ localSocialLinks: links, hasUnsavedChanges: true });
  },

  updateLink: (link) => {
    set((state) => ({
      links: state.links.map((l) => (l.id === link.id ? link : l)),
      hasUnsavedChanges: true,
    }));
  },
  setLinks: (links) => set({ links, hasUnsavedChanges: true }),
  addLink: (link) => set((state) => ({ links: [...state.links, link], hasUnsavedChanges: true })),
  removeLink: (id) => set((state) => ({ links: state.links.filter((l) => l.id !== id), hasUnsavedChanges: true })),
  reorderLinks: (links) => set({ links, hasUnsavedChanges: true }),

  // Save Changes
  saveChanges: async () => {
    try {
      const state = get();
      const pageId = state.pageId;

      if (!pageId) {
        console.error("No page ID found. Cannot save changes.");
        return;
      }
      console.log("saveChanges called with state:", state.page, state.links);

      // Ensure localLinks & localPage are always defined
      const updatedPage = state.page || {};
      const updatedLinks = state.links || [];
      // const localSocialLinks = state.localSocialLinks || [];

      // 🚀 Send update requests
      await fetch("/api/page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPage),
      });

      // Updated Links call with /api/links/[pageId]/route.ts
      await fetch(`/api/links/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLinks),
      });

      // await fetch("/api/social-links", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(localSocialLinks),
      // });

      // ✅ Clear local state correctly after saving
      set((state) => ({
        page: state.page ? { ...state.page, ...updatedPage } : null,
        // socialLinks: [...localSocialLinks],
        links: [...updatedLinks],
        localSocialLinks: [],
        hasUnsavedChanges: false,
      }));

      console.log("✅ Changes saved successfully!");
    } catch (error) {
      console.error("❌ Error saving changes:", error);
    }
  },

  // Reset Changes
  resetChanges: () => {
    set((state) => ({
      localSocialLinks: state.socialLinks,
      hasUnsavedChanges: false,
    }));
  },
}));
