import { create } from "zustand";
import { Link } from "@prisma/client";

interface DashboardState {
  // Profile State
  displayName: string | null;
  bio: string | null;
  profileImage: string | null;
  alignment: string;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;

  // Links State
  links: Link[];

  // Track Changes
  hasUnsavedChanges: boolean;

  // Actions
  setProfile: (profile: { displayName: string | null; bio: string | null; profileImage: string | null; alignment: string }) => void;
  setSocialLinks: (links: Array<{ platform: string; url: string }>) => void;
  setLinks: (links: Link[]) => void;
  updateLink: (link: Link) => void;
  addLink: (link: Link) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: Link[]) => void;

  // Save Changes
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial State
  displayName: null,
  bio: null,
  profileImage: null,
  alignment: "center",
  socialLinks: [],
  links: [],
  hasUnsavedChanges: false,

  // Actions
  setProfile: (profile) => {
    set({
      displayName: profile.displayName,
      bio: profile.bio,
      profileImage: profile.profileImage,
      alignment: profile.alignment,
      hasUnsavedChanges: true,
    });
  },

  setSocialLinks: (links) => {
    set({ socialLinks: links, hasUnsavedChanges: true });
  },

  setLinks: (links) => {
    set({ links, hasUnsavedChanges: true });
  },

  updateLink: (link) => {
    const links = get().links.map((l) => (l.id === link.id ? link : l));
    set({ links, hasUnsavedChanges: true });
  },

  addLink: (link) => {
    set((state) => ({ links: [...state.links, link], hasUnsavedChanges: true }));
  },

  removeLink: (id) => {
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
      hasUnsavedChanges: true,
    }));
  },

  reorderLinks: (links) => {
    set({ links, hasUnsavedChanges: true });
  },

  // Save Changes
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
          profileImage: state.profileImage,
          alignment: state.alignment,
          socialLinks: state.socialLinks,
        }),
      });

      if (!profileResponse.ok) {
        const error = await profileResponse.text();
        throw new Error(error || "Failed to update profile");
      }

      // Save links changes
      const linksResponse = await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.links),
      });

      if (!linksResponse.ok) {
        const error = await linksResponse.text();
        throw new Error(error || "Failed to update links");
      }

      set({ hasUnsavedChanges: false });
    } catch (error) {
      console.error("Failed to save changes:", error);
      throw error;
    }
  },

  // Reset Changes
  resetChanges: () => {
    set({ hasUnsavedChanges: false });
  },
}));
