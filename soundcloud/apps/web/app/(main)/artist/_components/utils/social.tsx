import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoYoutube,
  IoLogoTwitter,
} from "react-icons/io5";
import { Music, Link as LinkIcon } from "lucide-react";

export const getSocialIcon = (typeCode: string = "") => {
  const code = typeCode.toUpperCase();
  const iconProps = { size: 18 };

  switch (code) {
    case "FACEBOOK":
      return <IoLogoFacebook {...iconProps} />;
    case "INSTAGRAM":
      return <IoLogoInstagram {...iconProps} />;
    case "YOUTUBE":
      return <IoLogoYoutube {...iconProps} />;
    case "TWITTER":
    case "X":
      return <IoLogoTwitter {...iconProps} />;
    case "TIKTOK":
      return <Music {...iconProps} />;
    default:
      return <LinkIcon {...iconProps} />;
  }
};

export const getSocialColorHover = (typeCode: string = "") => {
  const code = typeCode.toUpperCase();

  switch (code) {
    case "FACEBOOK":
      return "hover:bg-[#1877F2] hover:text-white border-transparent hover:border-[#1877F2]";
    case "INSTAGRAM":
      return "hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:text-white border-transparent";
    case "YOUTUBE":
      return "hover:bg-[#FF0000] hover:text-white border-transparent hover:border-[#FF0000]";
    case "TWITTER":
    case "X":
    case "TIKTOK":
      return "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-transparent";
    default:
      return "hover:bg-gray-600 hover:text-white border-transparent";
  }
};
