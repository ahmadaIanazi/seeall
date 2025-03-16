import { create } from "zustand";
import { getThemeStyles, StylesType } from "../utils/style";
import { ContentType } from "@prisma/client";

interface StylesState {
  styles: StylesType;
  setStyles: (page: Partial<ContentType>) => void;
}

export const useStyles = create<StylesState>((set) => ({
  styles: getThemeStyles("DEFAULT", "center", "#000000"),
  setStyles: (page: ContentType) => {
    const getStyles = getThemeStyles(page.style || "DEFAULT", page.alignment || "center", page.primaryColor || "#000000");
    set({ styles: getStyles });
  },
}));
