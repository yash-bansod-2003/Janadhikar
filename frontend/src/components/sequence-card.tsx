import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SequenceCard = ({
  title,
  sequence,
}: {
  title: string;
  sequence: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const maskSequence = (value: string) => {
    if (!value) {
      return "";
    }

    if (value.length <= 8) {
      return `${value.slice(0, 2)}••••${value.slice(-2)}`;
    }

    if (value.length <= 20) {
      return `${value.slice(0, 4)}••••${value.slice(-4)}`;
    }

    return `${value.slice(0, 6)}••••••${value.slice(-6)}`;
  };

  const displayedSequence = isVisible ? sequence : maskSequence(sequence);

  const onCopy = () => {
    navigator.clipboard.writeText(sequence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group flex transition-colors hover:bg-muted/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xs font-semibold tracking-widest uppercase">
            {title}
            <Badge variant="destructive" className="ml-2">
              {sequence.length} AA
            </Badge>
          </CardTitle>
          <CardAction className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setIsVisible((current) => !current)}
              aria-label={isVisible ? "Hide sequence" : "Show sequence"}
              title={isVisible ? "Hide sequence" : "Show sequence"}
            >
              {isVisible ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              onClick={onCopy}
              aria-label="Copy sequence"
              title="Copy sequence"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="flex-1 bg-background/50 py-2">
        <p className="break-all font-mono text-xs leading-relaxed tracking-widest text-foreground/80 sm:text-[13px]">
          {displayedSequence}
        </p>
      </CardContent>
    </Card>
  );
};
