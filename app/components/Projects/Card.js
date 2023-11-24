export default function Card({title, description, children}) {
    return (
        <div className="flex-center-all flex-col min-w-[200px] border-2 border-black rounded-md">
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm">{description}</p>
            {children}
        </div>
    )
}