import './globals.css';
import "@radix-ui/themes/styles.css";

import { Analytics } from '@vercel/analytics/react';
import { TableProvider } from '@/app/_contexts/TableContext';
import { Toaster } from "sonner"
import { Theme } from "@radix-ui/themes";

export const metadata = {
  title: 'Cafe planner',
  description:
    'Cafe planner'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        <Theme>
          <TableProvider>
            {children}
          </TableProvider>
          <Toaster />
        </Theme>
      </body>
      <Analytics />
    </html>
  );
}
