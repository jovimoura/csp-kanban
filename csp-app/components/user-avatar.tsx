import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  size = "sm",
  className,
}: {
  name: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  return (
    <Avatar size={size} className={cn("bg-primary/70", className)}>
      <AvatarFallback className="bg-primary/70 text-[10px] font-semibold text-primary-foreground group-data-[size=default]/avatar:text-xs">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
