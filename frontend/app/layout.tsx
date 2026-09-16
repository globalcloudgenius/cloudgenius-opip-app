import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CloudGenius OPIP | Ontario Population Intelligence',
  description: 'Production-style population intelligence and analytics platform built by CloudGenius.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
