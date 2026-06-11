import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import GlobalProvider from "@/components/application/GlobalProvider";
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Shop Store",
  description: "Ecommerce store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${raleway.variable}`}
    >
      <body className="min-h-full flex flex-col">
       <GlobalProvider>
          {children}
          <ToastContainer />
          </GlobalProvider>
       
      </body>
    </html>
  );
}
