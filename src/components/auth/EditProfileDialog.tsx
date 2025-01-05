import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const EditProfileDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [email, setEmail] = useState(session?.user?.email || "");
  const [password, setPassword] = useState("");
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial profile data
  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('bride_name, groom_name')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setBrideName(data.bride_name || "");
      setGroomName(data.groom_name || "");
    }
  };

  // Fetch profile data when dialog opens
  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open, session?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update email and password if provided
      if (email !== session?.user?.email || password) {
        const updates: { email?: string; password?: string } = {};
        if (email !== session?.user?.email) updates.email = email;
        if (password) updates.password = password;

        const { error: authError } = await supabase.auth.updateUser(updates);
        if (authError) throw authError;
      }

      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bride_name: brideName,
          groom_name: groomName,
        })
        .eq('id', session?.user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">New Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <Separator />
            <div>
              <Label htmlFor="bride_name">Bride's Name</Label>
              <Input
                id="bride_name"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="Enter bride's name"
              />
            </div>
            <div>
              <Label htmlFor="groom_name">Groom's Name</Label>
              <Input
                id="groom_name"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="Enter groom's name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};