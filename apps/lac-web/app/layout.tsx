import { type Metadata } from "next";
import dynamic from "next/dynamic";
import NextTopLoader from "nextjs-toploader";
import { type ReactNode } from "react";
import Footer from "./_footer";
import Header from "./_header";
import "./globals.css";
import Providers from "./providers";

const LoginDialog = dynamic(() => import("./login-dialog"));
const AccountSelectorDialog = dynamic(
  () => import("./account-selector-dialog"),
);

export const metadata: Metadata = {
  title: {
    default: "Wurth Louis and Company",
    template: "%s | Wurth Louis and Company",
  },
  description: "Generated by create next app",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="font-arial flex h-full flex-col justify-between antialiased">
        <NextTopLoader showSpinner={false} color="#cc0000" />

        <Providers>
          <Header />

          <main className="flex-1">{children}</main>

          <Footer />

          <LoginDialog />
          <AccountSelectorDialog />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
