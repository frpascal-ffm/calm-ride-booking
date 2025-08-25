import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "../src/components/footer";

export const metadata: Metadata = {
  title: "Calm Ride Booking",
  description: "Platzhalterbeschreibung",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <body className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
