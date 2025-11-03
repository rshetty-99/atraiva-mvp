import { LogoSpinner } from "@/components/ui/logo-spinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <LogoSpinner size={80} text="Loading blog post..." />
    </div>
  );
}

