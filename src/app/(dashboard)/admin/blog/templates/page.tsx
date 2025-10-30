"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { blogTemplates } from "@/lib/blog/templates";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import Link from "next/link";

export default function BlogTemplatesPage() {
  const router = useRouter();

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/admin/blog/create?template=${templateId}`);
  };

  const handleStartBlank = () => {
    router.push("/admin/blog/create");
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-primary" />
                Choose a Blog Template
              </h2>
              <p className="text-muted-foreground mt-1">
                Start with a pre-built template or create from scratch
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 max-w-7xl">
        {/* Blank Template Option */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
            Blank Canvas
          </h3>
          <CardSpotlight
            onClick={handleStartBlank}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 p-8 border-2 border-dashed border-slate-700/50 max-w-2xl"
            radius={500}
            color="#8b5cf6"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/50 transition-all">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-2xl mb-2 text-white">
                  Start from Scratch
                </h3>
                <p className="text-base text-zinc-400 leading-relaxed">
                  Create a blank blog post with no template. Perfect if you want complete creative control.
                </p>
              </div>
            </div>
          </CardSpotlight>
        </div>

        {/* Template Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
            Pre-Built Templates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogTemplates.map((template) => (
              <CardSpotlight
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 p-6"
                radius={400}
                color="#3b82f6"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{template.icon}</div>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-300"
                    >
                      {template.category}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="font-bold text-xl text-white mb-2">
                      {template.name}
                    </h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Template Features */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Includes:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.sections.slice(0, 3).map((section) => (
                        <span
                          key={section.id}
                          className="text-xs px-2.5 py-1 bg-slate-800/80 border border-slate-700/50 text-zinc-300 rounded-md"
                        >
                          {section.name}
                        </span>
                      ))}
                      {template.sections.length > 3 && (
                        <span className="text-xs px-2.5 py-1 bg-slate-800/80 border border-slate-700/50 text-zinc-300 rounded-md">
                          +{template.sections.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Default Tags Preview */}
                  {template.defaultTags && template.defaultTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                      {template.defaultTags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

