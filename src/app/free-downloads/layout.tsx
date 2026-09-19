import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Downloads",
  description:
    "Free resume templates and design assets from Kyno — enter your email and the download link lands in your inbox.",
  alternates: { canonical: "/free-downloads" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
