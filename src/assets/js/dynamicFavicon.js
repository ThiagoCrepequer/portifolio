const icons = [
    "react",
    "javascript",
    "nodejs",
    "html",
    "css",
]

export function dynamicFavicon() {
    let i = 0;
    const icon = document.querySelector("link[rel='shortcut icon']");

    setInterval(() => {
        if(i === 5) i = 0;

        icon.href = `/assets/icons/${icons[i]}.svg`;
        
        i++
    }, 1000)
}