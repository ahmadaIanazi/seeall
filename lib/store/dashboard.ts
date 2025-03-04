import { create } from "zustand";
import { Page, SocialLink, Link } from "@prisma/client";

interface DashboardState {
  // Page State
  page: Page | null;
  socialLinks: SocialLink[];
  links: Link[];

  // Local Edits
  localPage: Partial<Page> | null;
  localSocialLinks: SocialLink[];
  localLinks: Link[];

  // Track Changes
  hasUnsavedChanges: boolean;
  previousState: Partial<DashboardState>;

  // Actions
  setPage: (page: Partial<Page>) => void;
  setSocialLinks: (links: SocialLink[]) => void;
  setLinks: (links: Link[]) => void;
  updateLink: (link: Link) => void;
  addLink: (link: Link) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: Link[]) => void;

  getPage: (username: string) => Promise<Page | null>;
  // getLinks: (pageId: string) => Link[] | null;
  // getSocialLinks: (pageId: string) => SocialLink[] | null;

  // Save Changes
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial State
  page: null,
  socialLinks: [],
  links: [],
  localPage: null,
  localSocialLinks: [],
  localLinks: [],
  hasUnsavedChanges: false,
  previousState: {},

  // Actions
  setPage: (page) => {
    set((state) => ({
      localPage: { ...state.localPage, ...page },
      hasUnsavedChanges: true,
    }));
  },

  setSocialLinks: (links) => {
    set({ localSocialLinks: links, hasUnsavedChanges: true });
  },

  setLinks: (links) => {
    set({ localLinks: links, hasUnsavedChanges: true });
  },

  updateLink: (link) => {
    set((state) => ({
      localLinks: state.localLinks.map((l) => (l.id === link.id ? link : l)),
      hasUnsavedChanges: true,
    }));
  },

  addLink: (link) => {
    set((state) => ({
      localLinks: [...(state.localLinks || []), link], // Ensure array existence
      links: [...(state.links || []), link], // Update rendered links
      hasUnsavedChanges: true,
    }));
  },

  removeLink: (id) => {
    set((state) => ({
      localLinks: state.localLinks.filter((link) => link.id !== id),
      hasUnsavedChanges: true,
    }));
  },

  reorderLinks: async (updatedLinks) => {
    set({ links: updatedLinks, hasUnsavedChanges: true });

    try {
      const response = await fetch("/api/links/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLinks.map(({ id, order }) => ({ id, order }))),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder links");
      }

      console.log("Links reordered successfully.");
    } catch (error) {
      console.error("Error reordering links:", error);
    }
  },

  getPage: async (username: string) => {
    try {
      const response = await fetch(`/api/${username}/page`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch page");
      return (await response.json()) as Page; // Ensure the return type matches the expected Page type
    } catch (error) {
      console.error("❌ Error Getting Page:", error);
      return null;
    }
  },

  // getLinks: async (pageId: string) => {
  //   try {
  //   } catch (error) {
  //     console.error("❌ Error Getting Links:", error);
  //     return null;
  //   }
  // },
  // getSocialLinks: async (pageId: string) => {
  //   try {
  //   } catch (error) {
  //     console.error("❌ Error Getting Social Links:", error);
  //     return null;
  //   }
  // },

  // Save Changes
  saveChanges: async () => {
    try {
      const state = get();
      console.log("saveChanges called with state:", state);

      // Ensure localLinks & localPage are always defined
      const localPage = state.localPage || {};
      const localLinks = state.localLinks || [];
      const localSocialLinks = state.localSocialLinks || [];

      // 🚀 Send update requests
      await fetch("/api/page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localPage),
      });

      await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localLinks),
      });

      await fetch("/api/social-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localSocialLinks),
      });

      // ✅ Clear local state correctly after saving
      set((state) => ({
        page: state.page ? { ...state.page, ...localPage } : null,
        socialLinks: [...localSocialLinks],
        links: [...localLinks],
        localPage: null,
        localSocialLinks: [],
        localLinks: [],
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
      localPage: state.page, // Reset to original page state
      localSocialLinks: state.socialLinks,
      localLinks: state.links,
      hasUnsavedChanges: false,
    }));
  },
}));
