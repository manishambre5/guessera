// CUSTOM COPYABLE UI COMPONENT

import { useState } from "react";
import { Item } from "./item";
import { Button } from "./button";
import { Check, Copy } from "lucide-react";

type CopyableProps = {
  target: string;
  className?: string;
};

export function Copyable({
    target,
    className = "",
}: CopyableProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Item variant="outline" className={`flex-1 ${className}`}>
        <p className="font-bold text-lg">{target}</p>
        <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCopy}
            className="text-muted-foreground"
        >
            {copied ? (
                <Check className="size-4" />
            ) : (
                <Copy className="size-4" />
            )}
        </Button>
    </Item>
  );
}