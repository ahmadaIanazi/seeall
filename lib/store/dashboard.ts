import { create } from "zustand";
import { Link, SocialLink } from "@prisma/client";

interface DashboardState {
  // Profile State
  displayName: string;
  bio: string | null;
  socialLinks: SocialLink[];

  // Links State
  links: Link[];

  // Track Changes
  hasUnsavedChanges: boolean;

  // Actions
  setProfile: (profile: { displayName: string; bio: string | null }) => void;
  setSocialLinks: (links: SocialLink[]) => void;
  setLinks: (links: Link[]) => void;
  updateLink: (link: Link) => void;
  addLink: (link: Link) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: Link[]) => void;

  // Save Changes
  saveChanges: () => Promise<void>;
  resetChanges: () => void;

  // Initialize store with fetched data
  initializeStore: (data: { displayName: string; bio: string | null; socialLinks: SocialLink[] }) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial State
  displayName: "",
  bio: null,
  socialLinks: [],
  links: [],
  hasUnsavedChanges: false,

  // Initialize store with fetched data
  initializeStore: (data: { displayName: string; bio: string | null; socialLinks: SocialLink[] }) => {
    set({
      displayName: data.displayName,
      bio: data.bio,
      socialLinks: data.socialLinks,
      hasUnsavedChanges: false,
    });
  },

  // Profile Actions
  setProfile: (profile) => {
    set((state) => ({
      displayName: profile.displayName,
      bio: profile.bio,
      hasUnsavedChanges: true,
    }));
  },

  setSocialLinks: (links) => {
    set((state) => ({
      socialLinks: links,
      hasUnsavedChanges: true,
    }));
  },

  // Links Actions
  setLinks: (links) => {
    set((state) => ({
      links,
      hasUnsavedChanges: true,
    }));
  },

  updateLink: (updatedLink) => {
    set((state) => ({
      links: state.links.map((link) => (link.id === updatedLink.id ? updatedLink : link)),
      hasUnsavedChanges: true,
    }));
  },

  addLink: (newLink) => {
    set((state) => ({
      links: [...state.links, newLink],
      hasUnsavedChanges: true,
    }));
  },

  removeLink: (id) => {
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
      hasUnsavedChanges: true,
    }));
  },

  reorderLinks: (reorderedLinks) => {
    set((state) => ({
      links: reorderedLinks,
      hasUnsavedChanges: true,
    }));
  },

  // Save all changes
  saveChanges: async () => {
    const state = get();

    try {
      // Save profile changes
      const profileResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: state.displayName,
          bio: state.bio,
          socialLinks: state.socialLinks,
        }),
      });

      if (!profileResponse.ok) throw new Error("Failed to update profile");

      // Save links changes
      const linksResponse = await fetch("/api/links/batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: state.links,
        }),
      });

      if (!linksResponse.ok) throw new Error("Failed to update links");

      set({ hasUnsavedChanges: false });
    } catch (error) {
      console.error("Failed to save changes:", error);
      throw error;
    }
  },

  // Reset changes
  resetChanges: () => {
    set({ hasUnsavedChanges: false });
  },
}));
