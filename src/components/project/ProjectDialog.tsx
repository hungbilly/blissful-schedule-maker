import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  mode: "create" | "edit";
}

export const ProjectDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialName = "",
  mode,
}: ProjectDialogProps) => {
  const [projectName, setProjectName] = useState(initialName);

  useEffect(() => {
    setProjectName(initialName);
  }, [initialName]);

  const handleSubmit = () => {
    onSubmit(projectName);
    setProjectName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Project" : "Edit Project"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <Button onClick={handleSubmit} className="w-full">
            {mode === "create" ? "Create Project" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};