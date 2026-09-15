import type { Metadata } from "next";

// Private / transactional area — keep it out of the index entirely.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
