"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  organizationId: string;
  organizationName: string;
  onInviteSent?: () => void;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  jobTitle: string;
  phoneNumber: string;
}

const ROLES = [
  {
    value: "org_admin",
    label: "Organization Admin",
    description: "Full access to organization settings and members",
  },
  {
    value: "org_manager",
    label: "Organization Manager",
    description: "Can manage compliance and data but not settings",
  },
  {
    value: "org_user",
    label: "Organization User",
    description: "Standard access to compliance features",
  },
  {
    value: "org_viewer",
    label: "Organization Viewer",
    description: "Read-only access to reports and data",
  },
];

export function InviteMemberDialog({
  organizationId,
  organizationName,
  onInviteSent,
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    role: "org_user",
    jobTitle: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/invitations/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId,
          organizationName,
          memberData: {
            email: formData.email.toLowerCase().trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            role: formData.role,
            jobTitle: formData.jobTitle.trim() || undefined,
            phoneNumber: formData.phoneNumber.trim() || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      toast.success("Invitation sent!", {
        description: `An invitation has been sent to ${formData.email}`,
      });

      // Reset form
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        role: "org_user",
        jobTitle: "",
        phoneNumber: "",
      });
      setErrors({});
      setOpen(false);

      // Notify parent to refresh data
      if (onInviteSent) {
        onInviteSent();
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join {organizationName}. They&apos;ll receive
            an email with instructions to create their account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="required-asterisk">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="member@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
              disabled={loading}
              required
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="required-asterisk">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Jane"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={errors.firstName ? "border-destructive" : ""}
              disabled={loading}
              required
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="required-asterisk">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={errors.lastName ? "border-destructive" : ""}
              disabled={loading}
              required
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="required-asterisk">
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
              disabled={loading}
              required
            >
              <SelectTrigger
                id="role"
                className={errors.role ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {role.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role}</p>
            )}
          </div>

          {/* Job Title (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title (Optional)</Label>
            <Input
              id="jobTitle"
              type="text"
              placeholder="Compliance Officer"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Phone Number (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1-555-123-4567"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              disabled={loading}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
