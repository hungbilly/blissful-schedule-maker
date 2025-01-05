import { Button } from "@/components/ui/button";

interface EmptyProjectStateProps {
  onNewProject: () => void;
}

export const EmptyProjectState = ({ onNewProject }: EmptyProjectStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wedding-pink">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-4 text-wedding-purple">Welcome to your Wedding Planner</h2>
        <p className="mb-4 text-wedding-purple/80">Create your first itinerary to get started</p>
        <Button onClick={onNewProject}>Create Itinerary</Button>
      </div>
    </div>
  );
};