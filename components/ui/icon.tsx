import { icons } from "lucide-react";
import { IconName } from "./icon-picker";

export function Icon({ name, ...props }: { name?: IconName }) {
  if (!name) return null;
  const SelectedIcon = icons[name];
  return <SelectedIcon {...props} />;
}

// Example usage:
// const [icon, setIcon] = useState<IconName | undefined>()
// <IconPicker onValueChange={(val) => setIcon(val)} value={icon} />
// <ContentIcon name={icon} />
