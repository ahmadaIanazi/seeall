import { SiGithub, SiInstagram, SiYoutube } from "@icons-pack/react-simple-icons";
import { Linkedin, Twitter } from "lucide-react";

export function getSocialIcon(platform: string) {
  switch (platform) {
    case "twitter":
      return <Twitter size={24} color='currentColor' />;
    case "github":
      return <SiGithub size={24} color='currentColor' />;
    case "linkedin":
      return <Linkedin size={24} color='currentColor' />;
    case "instagram":
      return <SiInstagram size={24} color='currentColor' />;
    case "youtube":
      return <SiYoutube size={24} color='currentColor' />;
    default:
      return null;
  }
}
