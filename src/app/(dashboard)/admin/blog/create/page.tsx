"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useSession } from "@/hooks/useSession";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, RefreshCw, Link2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { PostStatus } from "@/types/blog";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import Image from "next/image";
import Link from "next/link";
import { blogTemplates, applyTemplate } from "@/lib/blog/templates";
import { ConvertedBlogData } from "@/lib/blog/url-converter";

export default function CreateEditBlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded } = useAuth();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check if we're editing (id in query params)
  const editId = searchParams?.get("id");
  const isEditMode = !!editId;

  // Check for template parameter
  const templateId = searchParams?.get("template");
  
  // Check for URL parameter for conversion
  const urlParam = searchParams?.get("url");
  
  const [converting, setConverting] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(!!urlParam);
  const [urlInput, setUrlInput] = useState(urlParam || "");
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    tags: string[];
    category: string;
    status: PostStatus;
    seo: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
  }>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    tags: [],
    category: "",
    status: "draft",
    seo: {
      title: "",
      description: "",
      keywords: [],
    },
  });
  const [tagInput, setTagInput] = useState("");

  // Check permissions
  useEffect(() => {
    if (!isLoaded || !session) return;

    const role = session.currentOrganization?.role;
    if (role !== "super_admin" && role !== "platform_admin") {
      toast.error(`Insufficient permissions. Role: ${role || "undefined"}`);
      router.push("/dashboard");
    }
  }, [isLoaded, session, router]);

  // Convert URL to blog post
  const convertUrl = useCallback(async (url: string) => {
    if (!url || !url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setConverting(true);
    try {
      const response = await fetch("/api/blog/convert-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to convert URL");
      }

      const convertedData: ConvertedBlogData = data.data;

      // Find the template and apply it with the converted content
      const template = blogTemplates.find((t) => t.id === convertedData.templateId);
      
      if (template) {
        // Use the converted content but keep template structure where applicable
        setFormData((prev) => ({
          ...prev,
          title: convertedData.title,
          slug: convertedData.slug,
          excerpt: convertedData.excerpt,
          content: convertedData.content,
          tags: convertedData.tags.length > 0 ? convertedData.tags : prev.tags,
          category: convertedData.category || prev.category,
          seo: {
            title: convertedData.seo.title || convertedData.title,
            description: convertedData.seo.description || convertedData.excerpt,
            keywords: convertedData.seo.keywords || convertedData.tags,
          },
        }));
        
        toast.success(
          `URL converted! ${template.icon || "📄"} ${template.name} template identified and applied. You can now edit the content.`
        );
        setShowUrlInput(false);
        setUrlInput("");
      } else {
        // No template match, just use converted data
        setFormData((prev) => ({
          ...prev,
          title: convertedData.title,
          slug: convertedData.slug,
          excerpt: convertedData.excerpt,
          content: convertedData.content,
          tags: convertedData.tags,
          category: convertedData.category,
          seo: {
            title: convertedData.seo.title || convertedData.title,
            description: convertedData.seo.description || convertedData.excerpt,
            keywords: convertedData.seo.keywords || convertedData.tags,
          },
        }));
        toast.success("URL converted! You can now edit the content.");
        setShowUrlInput(false);
        setUrlInput("");
      }
    } catch (error) {
      console.error("Error converting URL:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to convert URL"
      );
    } finally {
      setConverting(false);
    }
  }, []);

  // Convert URL from URL parameter on mount
  useEffect(() => {
    if (urlParam && !isEditMode && !formData.title) {
      convertUrl(urlParam);
    }
  }, [urlParam, isEditMode, convertUrl, formData.title]);

  // Apply template from URL parameter
  useEffect(() => {
    if (templateId && !isEditMode && !urlParam) {
      const template = blogTemplates.find((t) => t.id === templateId);
      if (template) {
        const applied = applyTemplate(template);
        setFormData((prev) => ({
          ...prev,
          title: applied.title,
          excerpt: applied.excerpt,
          content: applied.content,
          tags: applied.tags,
          category: applied.category,
        }));
        toast.success(`${template.name} template applied!`);
      }
    }
  }, [templateId, isEditMode, urlParam]);

  const loadPost = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load post");
      }

      const data = await response.json();
      const post = data.post;

      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content.type === "html" ? post.content.html : "",
        featuredImage: post.featuredImage || "",
        tags: post.tags || [],
        category: post.category || "",
        status: post.status,
        seo: post.seo || {
          title: "",
          description: "",
          keywords: [],
        },
      });
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Failed to load post");
      router.push("/admin/blog");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load post data if editing
  useEffect(() => {
    if (isEditMode && editId) {
      loadPost(editId);
    }
  }, [isEditMode, editId, loadPost]);

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.content) {
        toast.error("Title, slug, and content are required");
        return;
      }

      setIsCreating(true);
      setLoading(true);

      // Auto-generate slug from title if empty
      const slug =
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const postData = {
        ...formData,
        slug,
        content: {
          type: "html",
          html: formData.content,
        },
      };

      const url = isEditMode ? `/api/blog/${editId}` : "/api/blog";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save post");
      }

      toast.success(
        isEditMode
          ? "Blog post updated successfully"
          : "Blog post created successfully"
      );
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save post"
      );
    } finally {
      setLoading(false);
      setIsCreating(false);
    }
  };

  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      setUploadingImage(true);
      const response = await fetch("/api/blog/upload-image", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData((prev) => ({ ...prev, featuredImage: data.url }));
      toast.success("Featured image uploaded successfully");
    } catch (error) {
      console.error("Error uploading featured image:", error);
      toast.error("Failed to upload featured image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };


  if (!isLoaded || (isEditMode && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" style={{ marginTop: "140px" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Edit Blog Post" : "Create Blog Post"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode
                ? "Update the blog post details"
                : "Fill in the details to create a new blog post"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {(formData.status === "draft" || !isEditMode) && (
            <Button
              variant="outline"
              onClick={async () => {
                // Validate required fields
                if (!formData.title || !formData.slug || !formData.content) {
                  toast.error("Title, slug, and content are required");
                  return;
                }

                setIsCreating(true);
                setLoading(true);
                try {
                  // Auto-generate slug from title if empty
                  const slug =
                    formData.slug ||
                    formData.title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "");

                  const postData = {
                    ...formData,
                    slug,
                    status: "review", // Send for review
                    content: {
                      type: "html",
                      html: formData.content,
                    },
                  };

                  const url = isEditMode ? `/api/blog/${editId}` : "/api/blog";
                  const method = isEditMode ? "PUT" : "POST";

                  const response = await fetch(url, {
                    method,
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postData),
                  });

                  if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to save post");
                  }

                  toast.success("Post saved and sent for review!");
                  router.push("/admin/blog");
                  } catch (error) {
                    console.error("Error sending for review:", error);
                    toast.error(
                      error instanceof Error ? error.message : "Failed to send for review"
                    );
                  } finally {
                    setLoading(false);
                    setIsCreating(false);
                  }
                }}
                disabled={loading || isCreating}
              >
                {(loading || isCreating) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send for Review
                  </>
                )}
              </Button>
          )}
          <Button onClick={handleSave} disabled={loading || isCreating}>
            {(loading || isCreating) ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditMode ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>

      {/* URL Converter */}
      {showUrlInput && (
        <Card className="mb-6 border-primary/50">
          <CardHeader>
            <CardTitle>Convert URL to Blog Post</CardTitle>
            <CardDescription>
              Enter a URL to automatically extract content and identify the appropriate template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/article"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !converting) {
                    convertUrl(urlInput);
                  }
                }}
                disabled={converting}
                className="flex-1"
              />
              <Button
                onClick={() => convertUrl(urlInput)}
                disabled={converting || !urlInput.trim() || loading}
              >
                {converting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Convert
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput("");
                }}
                disabled={converting}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* URL Converter Button */}
      {!showUrlInput && !isEditMode && (
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowUrlInput(true)}
            className="w-full sm:w-auto"
          >
            <Link2 className="w-4 h-4 mr-2" />
            Convert URL to Blog Post
          </Button>
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the main details of your blog post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter blog post title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="url-friendly-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated from title if left empty
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of the blog post"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
              <CardDescription>Write your blog post content</CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                postId={editId || undefined}
              />
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your post for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="SEO optimized title"
                  value={formData.seo.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, title: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="SEO meta description"
                  value={formData.seo.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, description: e.target.value },
                    }))
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PostStatus) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="featuredImageUpload"
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                disabled={uploadingImage}
              />
              {formData.featuredImage && (
                <div className="relative w-full h-40 rounded overflow-hidden border">
                  <Image
                    src={formData.featuredImage}
                    alt="Featured"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Security, Compliance"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
