import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ON:DA Chat",
  description: "ON:DA.LAB Human Persona 1:1 Chat",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
