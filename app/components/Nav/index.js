import Link from "next/link";
import "./styles.css";
import LanguagehBox from "./LanguageBox";

export default function Nav() {
    return (
        <nav className="flex justify-center md:absolute md:right-0 md:mr-12 mt-4">
            <ul className="flex gap-2 items-center">
                <li className="default-padding text-white bg-black rounded-[4px]">
                    <Link href="#home" className="default-size">
                        Hire me!
                    </Link>
                </li>

                <li className="default-padding">
                    <Link href="#about" className="default-size">
                        About
                    </Link>
                </li>

                <li className="default-padding">
                    <Link href="#blog" className="default-size">
                        Blog
                    </Link>
                </li>

                <li className="default-padding">
                    <LanguagehBox/>
                </li>
            </ul>
        </nav>
    )
}