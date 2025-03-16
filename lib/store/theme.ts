import { THEMES } from "@/types";
import { create } from "zustand";
import { ThemeConfig } from "../../types/index";

interface StylesState {
  themeConfig: ThemeConfig | Partial<ThemeConfig>;
  setTheme: (themeConfig: Partial<ThemeConfig>) => void;
}

export const useTheme = create<StylesState>((set) => ({
  themeConfig: {
    theme: THEMES.DEFAULT,
    alignment: "left",
    primaryColor: "#000000",
  },
  setTheme: (themeConfig) => {
    set((state) => ({
      themeConfig: { ...state.themeConfig, ...themeConfig },
    }));
  },
}));
