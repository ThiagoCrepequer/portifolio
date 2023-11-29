import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Thiago | Portifólio',
    description: 'Thiago Crepequer, desenvolvedor Full-Stack'
}

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
