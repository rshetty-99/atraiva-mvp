import React from "react";
import { DocsLayout } from "@/components/docs/DocsLayout";

export default function PublicDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout isSupport={false}>{children}</DocsLayout>;
}

export const metadata = {
  title: "Public Documentation - Atraiva",
  description: "Public documentation for Atraiva breach determination platform",
};

