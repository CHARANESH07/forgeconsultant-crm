import type { Metadata } from "next";
import "./globals.css";
import { CRMProvider } from "@/lib/store/crm-context";

export const metadata: Metadata = {
  title: "ForgeConsultant CRM | Enterprise Consulting Sales & Pipeline Platform",
  description: "Next-generation commercial CRM built for consulting firms, advisory practices, and high-value B2B pipelines.",
  icons: {
    icon: "/brand/forgeconsultant-mark.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col antialiased">
        <CRMProvider>
          {children}
        </CRMProvider>
      </body>
    </html>
  );
}
