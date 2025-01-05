import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
  onDelete?: () => void;
  initialName?: string;
  mode: "create" | "edit";
}

export const ProjectDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  initialName = "",
  mode,
}: ProjectDialogProps) => {
  const [projectName, setProjectName] = useState(initialName);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    setProjectName(initialName);
  }, [initialName]);

  const handleSubmit = () => {
    onSubmit(projectName);
    setProjectName("");
  };

  const handleDelete = () => {
    setShowDeleteAlert(false);
    onDelete?.();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create New Project" : "Edit Project"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create" 
                ? "Enter a name for your new project." 
                : "Edit your project details or delete the project."}
            </DialogDescription>
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
            <div className="flex gap-4">
              <Button onClick={handleSubmit} className="flex-1">
                {mode === "create" ? "Create Project" : "Save Changes"}
              </Button>
              {mode === "edit" && onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteAlert(true)}
                  className="px-3"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};