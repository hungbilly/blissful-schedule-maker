import { Link as LinkIcon } from "lucide-react";
import { formatInstagramUrl, isInstagramUsername } from "@/utils/socialMediaUtils";

interface VendorSocialMediaProps {
  socialMedia: string;
}

export const VendorSocialMedia = ({ socialMedia }: VendorSocialMediaProps) => {
  if (!socialMedia) return null;

  const isInstagram = isInstagramUsername(socialMedia);
  const displayUrl = isInstagram ? formatInstagramUrl(socialMedia) : socialMedia;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <LinkIcon className="h-4 w-4 text-wedding-gray" />
      <a
        href={displayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-wedding-purple hover:underline"
      >
        {socialMedia}
      </a>
    </div>
  );
};