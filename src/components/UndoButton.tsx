import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UndoButtonProps {
  onUndo: () => void;
  disabled?: boolean;
}

export function UndoButton({ onUndo, disabled }: UndoButtonProps) {
  const { toast } = useToast();

  const handleUndo = () => {
    onUndo();
    toast({
      title: "Changes undone",
      description: "Your last change has been reverted",
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleUndo}
      disabled={disabled}
      className="h-8 w-8"
      title="Undo last change"
    >
      <Undo2 className="h-4 w-4" />
    </Button>
  );
}