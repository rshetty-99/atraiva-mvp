import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DocsLayout } from "@/components/docs/DocsLayout";

export default async function SupportDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/docs/support");
  }

  return (
    <DocsLayout isSupport={true}>
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 mb-6 sm:mb-8 rounded-r">
        <p className="text-sm leading-relaxed text-blue-700 dark:text-blue-300 font-medium">
          📚 You are viewing authenticated customer support documentation
        </p>
      </div>
      {children}
    </DocsLayout>
  );
}

export const metadata = {
  title: "Support Documentation - Atraiva",
  description: "Customer support documentation for Atraiva users",
};
