import { ReactNode } from "react";
import { Terminal } from "lucide-react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const TerminalWindow = ({
  title = "bash",
  children,
  className = "",
}: TerminalWindowProps) => {
  return (
    <div
      className={`border border-border bg-[rgba(0,0,0,0.25)] backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-midground" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            {title}
          </span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 border border-border" />
          <span className="w-2 h-2 border border-border" />
          <span className="w-2 h-2 bg-midground/40" />
        </div>
      </div>
      <div className="overflow-x-auto font-mono text-sm leading-[1.7] p-5">{children}</div>
    </div>
  );
};
