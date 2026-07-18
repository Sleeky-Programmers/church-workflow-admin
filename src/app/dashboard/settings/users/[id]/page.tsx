"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { UserDetailsPageClient } from "@/components/features/dashboard/admin/user-client-detail";
import { fetchAdminInvites, fetchRoles } from "@/lib/api/admin-settings";
import { User } from "@/types/user";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";

export default function UserDetailsRoute() {
  const params = useParams();
  const id = params?.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      if (!id) {
        return;
      }

      try {
        const [invitesData, rolesData] = await Promise.all([
          fetchAdminInvites(),
          fetchRoles(),
        ]);
        setRoles(rolesData);
        const invite = invitesData.find((inv: any) => inv._id === id);

        if (!invite) {
          setUser(null);
        } else {
          const roleId =
            typeof invite.churchRole === "string"
              ? invite.churchRole
              : invite.churchRole?._id;
          const roleObj = rolesData.find((r: any) => r._id === roleId);

          const mappedUser: User = {
            id: invite._id,
            name: invite?.firstName
              ? `${invite.firstName} ${invite.lastName || ""}`.trim()
              : "-",
            email: invite.email,
            role: roleObj?.roleName || "-",
            roleId: roleId,
            status: invite.status.toLowerCase() as
              | "active"
              | "pending"
              | "suspended",
            dateInvited: new Date(invite.createdAt).toLocaleString(),
          };
          setUser(mappedUser);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load user data",
          variant: "destructive",
        });
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return notFound();
  }

  return <UserDetailsPageClient user={user} roles={roles} />;
}
