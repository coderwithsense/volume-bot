import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "../global.css";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <div className="grid grid-cols-4">
            <div
              className="flex flex-col col-span-1 p-5 gap-5"
              style={{ height: "100vh" }}
            >
              <div className="flex-grow">
                <div className="px-4">
                  <Image
                    src={"/Logo-cube.png"}
                    width={50}
                    height={50}
                    alt="logo"
                  />
                  <div>
                    <h1 className="font-bold text-lg">Gamblify</h1>
                    <p className="font-light text-sm">Gamblify.bet@gmail.com</p>
                    <SignOutButton/>
                  </div>
                </div>

                <div className="w-[10rem] my-5">
                  <Button className="tracking-wide" variant="ghost">
                    <Link href={'/app/dashboard'}>Dashboard</Link>
                </Button>
                <Button className="tracking-wide" variant="ghost">
                  <Link href={'/app/bot'}>Bot</Link>
                </Button>
                  <Button className="tracking-wide" variant="ghost">
                    Server Logs
                  </Button>
                  <Button className="tracking-wide" variant="ghost">
                    Error Logs
                  </Button>
                  <Button className="tracking-wide" variant="ghost">
                    <Link href={"/app/settings"}>Settings</Link>
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">

                <UserButton />
                <Badge>Admin</Badge>

              </div>
            </div>
            {children}
          </div>
      </body>
    </html>
  );
}
