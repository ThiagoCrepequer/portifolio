import Link from "next/link";
import { 
    FaInstagram, 
    FaLinkedin, 
    FaGithub  
} from "react-icons/fa6";
import links from "@/constants/social_media.json";

export default function SocialMedia() {
    return (
        <div className="flex gap-2">
            <Link href={links.instagram}>
                <FaInstagram className="icon-size" />
            </Link>
            <Link href={links.linkedin}>
                <FaLinkedin className="icon-size" />
            </Link>
            <Link href={links.github}>
                <FaGithub className="icon-size" />
            </Link>
        </div>
    )
}