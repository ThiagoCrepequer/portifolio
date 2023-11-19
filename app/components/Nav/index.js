import Link from "next/link";
import "./styles.css";

export default function Nav() {
    return (
        <nav className="absolute right-0 mr-12 mt-4">
            <ul className="flex gap-4">
                <li className="default-padding font-bold border-2 border-black rounded-[5px]">
                    <Link href="#home">
                        Home
                    </Link>
                </li>

                <li className="default-padding">
                    <Link href="#about">
                        About
                    </Link>
                </li>

                <li className="default-padding">
                    <Link href="#blog">
                        Blog
                    </Link>
                </li>
            </ul>  
        </nav>
    )
}