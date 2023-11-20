
import SocialMedia from "./SocialMedia";
import TextTitle from "./TextTitle";

export default function Title() {
    return (
            <section className="flex-center-all gap-[2px] flex-col responsive-width">
                <TextTitle />
                <SocialMedia />
            </section>
    )
}