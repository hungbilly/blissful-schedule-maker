import { User, Phone, FileText, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vendor } from "../project/types";
import { EditVendorDialog } from "./EditVendorDialog";
import { formatInstagramUrl, isInstagramUsername } from "@/utils/socialMediaUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface VendorCardProps {
  vendor: Vendor;
  onUpdate: (id: number, data: Omit<Vendor, "id">) => void;
  onDelete: (id: number) => void;
}

export const VendorCard = ({ vendor, onUpdate, onDelete }: VendorCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-wedding-purple" />
          <h3 className="font-medium">{vendor.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <EditVendorDialog
            vendor={vendor}
            onSave={(data) => onUpdate(vendor.id, data)}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this vendor? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(vendor.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <p className="text-sm text-wedding-purple">{vendor.role}</p>
      <div className="flex items-center space-x-2 text-sm">
        <Phone className="h-4 w-4 text-wedding-purple" />
        <span className="text-wedding-purple">{vendor.contactNumber}</span>
      </div>
      {vendor.address && (
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="h-4 w-4 text-wedding-purple" />
          <span className="text-wedding-purple">{vendor.address}</span>
        </div>
      )}
      {vendor.socialMedia && (
        <div className="flex items-center space-x-2 text-sm">
          <Instagram className="h-4 w-4 text-wedding-purple" />
          {isInstagramUsername(vendor.socialMedia) ? (
            <a
              href={formatInstagramUrl(vendor.socialMedia)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wedding-purple hover:underline"
            >
              @{vendor.socialMedia.replace('@', '')}
            </a>
          ) : (
            <span className="text-wedding-purple">{vendor.socialMedia}</span>
          )}
        </div>
      )}
      {vendor.serviceDetails && (
        <div className="flex items-start space-x-2 text-sm">
          <FileText className="h-4 w-4 text-wedding-purple mt-1" />
          <p className="text-wedding-purple whitespace-pre-wrap">{vendor.serviceDetails}</p>
        </div>
      )}
    </div>
  );
};