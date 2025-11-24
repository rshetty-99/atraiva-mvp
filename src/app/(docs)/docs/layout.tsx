import React from "react";

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const metadata = {
  title: "Atraiva Documentation",
  description:
    "Complete documentation for Atraiva breach determination platform",
};
