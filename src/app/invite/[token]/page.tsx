"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  User,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

interface InvitationData {
  organizationId: string;
  organizationName: string;
  memberData: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    jobTitle?: string;
    phoneNumber?: string;
  };
  invitedByName: string;
  expiresAt: Date;
}

export default function MemberInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      setIsValidating(true);
      const response = await fetch("/api/invitations/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setIsValid(false);
        setError(data.error || "Invalid invitation link");
      } else {
        setIsValid(true);
        setInvitation(data.invitation);
        // Generate default username from email
        const defaultUsername = data.invitation.memberData.email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        setUsername(defaultUsername);
      }
    } catch (error: any) {
      setIsValid(false);
      setError("Failed to validate invitation");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("Creating your account...", { id: "signup" });

      const response = await fetch("/api/invitations/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss("signup");
        const errorDetails =
          data.details || data.error || "Failed to create account";
        toast.error(errorDetails, { duration: 5000 });
        throw new Error(errorDetails);
      }

      toast.dismiss("signup");
      toast.success("Account created successfully! Redirecting to sign in...", {
        duration: 3000,
      });

      // Redirect to sign-in page
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error: any) {
      console.error("Signup error:", error);
      // Error already shown via toast above
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md border-red-500/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Invalid Invitation
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                {error || "This invitation link is invalid or has expired"}
              </p>
              <Button onClick={() => router.push("/")}>Go to Homepage</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              Join {invitation.organizationName}
            </CardTitle>
            <CardDescription className="text-base">
              You've been invited by {invitation.invitedByName} to join as{" "}
              <span className="font-semibold text-primary">
                {invitation.memberData.role.replace(/_/g, " ")}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info Display */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Your Name</p>
                    <p className="font-medium">
                      {invitation.memberData.firstName}{" "}
                      {invitation.memberData.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{invitation.memberData.email}</p>
                  </div>
                </div>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                      )
                    }
                    className="pl-10"
                    required
                    minLength={3}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Lowercase letters and numbers only, at least 3 characters
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  isSubmitting || !username || !password || !confirmPassword
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Account & Join
                  </>
                )}
              </Button>

              {/* Expiration Notice */}
              <p className="text-xs text-center text-muted-foreground">
                This invitation expires on{" "}
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </motion.div>
    </div>
  );
}
