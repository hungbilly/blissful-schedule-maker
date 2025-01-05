import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

interface UndoButtonProps {
  onUndo: () => void;
  disabled?: boolean;
}

export function UndoButton({ onUndo, disabled }: UndoButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onUndo}
      disabled={disabled}
      className="h-8 w-8"
      title="Undo last change"
    >
      <Undo2 className="h-4 w-4" />
    </Button>
  );
}