"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  MoreVertical,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Post, PostStatus } from "@/types/blog";
import Image from "next/image";
import { LogoSpinner } from "@/components/ui/logo-spinner";

export default function BlogManagementPage() {
  const router = useRouter();
  const { isLoaded } = useAuth();
  const { session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [paginatedPosts, setPaginatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postsFetched, setPostsFetched] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Check permissions
  useEffect(() => {
    if (!isLoaded || !session) return;

    const role = session.currentOrganization?.role;
    if (role !== "super_admin" && role !== "platform_admin") {
      toast.error(`Insufficient permissions. Role: ${role || "undefined"}`);
      router.push("/dashboard");
    }
  }, [isLoaded, session, router]);

  // Filter posts
  useEffect(() => {
    let filtered = posts;

    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredPosts(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [posts, searchTerm, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Update paginated posts when filtered posts or pagination changes
  useEffect(() => {
    const paginated = filteredPosts.slice(startIndex, endIndex);
    setPaginatedPosts(paginated);
  }, [filteredPosts, startIndex, endIndex]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all posts (admin should see all posts, pagination is handled client-side)
      const response = await fetch("/api/blog?limit=100");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load blog posts. Please check Firebase configuration."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize, 10);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
    toast.success(`Page size updated to ${size} items`);
  };

  // Fetch posts - only once after permission check
  useEffect(() => {
    if (
      isLoaded &&
      session &&
      session.currentOrganization?.role &&
      !postsFetched
    ) {
      const role = session.currentOrganization.role;
      if (role === "super_admin" || role === "platform_admin") {
        fetchPosts();
        setPostsFetched(true);
      }
    }
  }, [isLoaded, session, postsFetched, fetchPosts]);

  const handleCreateNew = () => {
    router.push("/admin/blog/templates");
  };

  const handleEdit = (post: Post) => {
    router.push(`/admin/blog/create?id=${post.id}`);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      const response = await fetch(`/api/blog/${selectedPost.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      toast.success("Blog post deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    }
  };

  const handleApprove = async (post: Post) => {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...post,
          status: "published",
          // Preserve all other fields
          content: post.content,
          seo: post.seo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve post");
      }

      toast.success(`"${post.title}" has been approved and published!`);
      fetchPosts();
    } catch (error) {
      console.error("Error approving post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to approve post"
      );
    }
  };

  const handleSendForReview = async (post: Post) => {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...post,
          status: "review",
          content: post.content,
          seo: post.seo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send post for review");
      }

      toast.success(`"${post.title}" has been sent for review!`);
      fetchPosts();
    } catch (error) {
      console.error("Error sending post for review:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send post for review"
      );
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    const variants = {
      draft: "secondary",
      review: "default",
      scheduled: "default",
      published: "default",
      archived: "outline",
    } as const;

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isLoaded || loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ marginTop: "140px" }}
      >
        <LogoSpinner size={80} text="Loading blog posts..." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 w-full max-w-full overflow-x-hidden" style={{ marginTop: "140px" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage blog posts for the resources page
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Blog Post
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, excerpt, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                onClick={() => setStatusFilter("draft")}
                size="sm"
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === "review" ? "default" : "outline"}
                onClick={() => setStatusFilter("review")}
                size="sm"
              >
                Review
              </Button>
              <Button
                variant={statusFilter === "published" ? "default" : "outline"}
                onClick={() => setStatusFilter("published")}
                size="sm"
              >
                Published
              </Button>
              <Button
                variant={statusFilter === "archived" ? "default" : "outline"}
                onClick={() => setStatusFilter("archived")}
                size="sm"
              >
                Archived
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
          <CardDescription>Manage all blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    No blog posts found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {post.featuredImage && (
                          <div className="relative w-10 h-10 rounded overflow-hidden">
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div>{post.title}</div>
                          {post.excerpt && (
                            <div className="text-xs text-muted-foreground truncate max-w-md">
                              {post.excerpt}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{post.category || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell>{post.views || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {(post.status === "draft" ||
                            post.status === "review") && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApprove(post)}
                                className="text-green-600 dark:text-green-400"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve & Publish
                              </DropdownMenuItem>
                              {post.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() => handleSendForReview(post)}
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send for Review
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleEdit(post)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/resources/${post.slug}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPost(post);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {filteredPosts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
              {/* Page Info and Size Selector */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredPosts.length)} of{" "}
                  {filteredPosts.length} results
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Items per page:
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  title="First Page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 px-2">
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  title="Last Page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedPost?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
