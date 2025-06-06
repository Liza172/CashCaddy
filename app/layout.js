import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
const inter = Inter({subsets: ["latin"]});


export const metadata = {
  title: "CashCaddy",
  description: "One stop Finance Platfrom",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
        <html lang="en">
        <body
          className={`${inter.className}`} >
          <Header></Header>
          <main className="min-h-screen">{children}</main>
          <Toaster richColors/>
          {/*Footer*/}
          <footer className="bg-blue-50">
            <div className="container mx-auto px-4 text-center text-grey-600">
            <p>This is Liza.</p> 
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
    
  );
}
