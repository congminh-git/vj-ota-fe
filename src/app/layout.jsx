import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Booking demo',
    icons: {
        icon: '/favicon.png',
    },
};

export default function RootLayout({
    children,
  }) {
    return (
        <html lang="en">
            <body className={`${inter.className} h-screen`}>
                <Toaster position="bottom-right" />
                {children}
            </body>
        </html>
    )
  }