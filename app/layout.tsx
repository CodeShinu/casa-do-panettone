import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "Casa do Panettone | Sabor direto da fábrica",
    description: "Panettones macios, saborosos e feitos para compartilhar.",
    openGraph: { title: "Casa do Panettone", description: "Sabor direto da loja de fábrica.", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title: "Casa do Panettone", description: "Sabor direto da loja de fábrica.", images: [image] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
