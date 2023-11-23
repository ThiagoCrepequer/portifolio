import Link from "next/link";
import "./styles.css";
import LanguagehBox from "./LanguageBox";

export default function Nav() {
    return (
        <nav className="absolute right-0 mr-12 mt-4">
            <ul className="flex gap-2 items-center">
                <li className="default-padding text-white bg-black rounded-[4px]">
                    <Link href="#home">
                        Hire me!
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

                <li className="default-padding">
                    <LanguagehBox />
                </li>
            </ul>
        </nav>
    )
}