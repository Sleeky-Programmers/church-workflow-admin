"use client";

import {
  Activity,
  Building2,
  CheckCircle,
  Crown,
  Lock,
  Mail,
  Search,
  Unlock,
  User,
  UserCheck,
  UserCog,
  Users,
  UserX,
} from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { useState, useEffect } from "react";
import { ProductAdminStatus } from "@/lib/enums";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/typography/Heading";
import { Span, Text } from "@/components/ui/typography/Text";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

import {
  getAdmins,
  getAdminStats,
  blockAdmin,
  unblockAdmin,
  AdminStats,
} from "@/services/userMangementService";

const roleBadgeClass: Record<string, string> = {
  "Super Admin": "bg-purple-100 text-purple-700",
  Admin: "bg-blue-100 text-blue-700",
  Finance: "bg-green-100 text-green-700",
  Media: "bg-pink-100 text-pink-700",
  Worship: "bg-indigo-100 text-indigo-700",
  Youth: "bg-amber-100 text-amber-700",
  Children: "bg-orange-100 text-orange-700",
  Usher: "bg-gray-100 text-gray-700",
  Women: "bg-rose-100 text-rose-700",
  Prayer: "bg-cyan-100 text-cyan-700",
  Default: "bg-gray-100 text-gray-700",
};

const roleIcon: Record<string, JSX.Element> = {
  "Super Admin": <Crown className="h-3 w-3" />,
  Admin: <UserCog className="h-3 w-3" />,
  Default: <User className="h-3 w-3" />,
};

export default function UsersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChurchId, setSelectedChurchId] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedChurch, setSelectedChurch] = useState<any>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    active: 0,
    blocked: 0,
    superAdmins: 0,
  });
  async function fetchAdmins() {
    setLoading(true);

    try {
      const adminsRes = await getAdmins({
        search: searchQuery || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        churchId: selectedChurchId !== "all" ? selectedChurchId : undefined,
      });

      const statsRes = await getAdminStats();

      const transformed = [
        {
          id: "platform",
          name: "Platform Admins",
          initials: "PA",
          initBg: "bg-primary-100",
          initColor: "text-primary-700",
          users: adminsRes.data.map((admin) => ({
            ...admin,
            isBlocked: admin.status === ProductAdminStatus.BLOCKED,
          })),
        },
      ];

      setUsersData(transformed);
      setStats(statsRes);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAdmins();
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery, roleFilter, statusFilter, selectedChurchId]);

  const filteredUsers = usersData.flatMap((group) => group.users || []);
  const totalUsers = stats.total;
  const activeUsers = stats.active;
  const blockedUsers = stats.blocked;
  const superAdmins = stats.superAdmins;

  const handleToggleBlock = async () => {
    if (!selectedUser) return;

    try {
      if (selectedUser.isBlocked) {
        await unblockAdmin(selectedUser.id);
      } else {
        await blockAdmin(selectedUser.id);
      }

      const updated = await getAdmins();

      setUsersData([
        {
          id: "platform",
          name: "Platform Admins",
          initials: "PA",
          initBg: "bg-primary-100",
          initColor: "text-primary-700",
          users: updated.data.map((admin) => ({
            ...admin,
            isBlocked: admin.status === ProductAdminStatus.BLOCKED,
          })),
        },
      ]);

      toast({
        title: selectedUser.isBlocked ? "User Unblocked" : "User Blocked",
        variant: selectedUser.isBlocked ? "default" : "destructive",
      });

      setIsBlockModalOpen(false);
    } catch (err) {
      toast({
        title: "Action failed",
        description: "Could not update user status",
        variant: "destructive",
      });
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);

    setSelectedChurch({
      id: 1,
      name: user.church?.name ?? "—",
      initials: user.church?.alias ?? "--",
    });

    setIsViewModalOpen(true);
  };

  const uniqueChurches = Array.from(
    new Map(
      filteredUsers
        .filter((u) => u.church)
        .map((u) => [
          u.church!.id,
          {
            id: u.church!.id,
            name: u.church!.name,
          },
        ]),
    ).values(),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleIcon = (role: string) => {
    return roleIcon[role] || roleIcon["Default"];
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Heading level={1} text="User Management" />
          <Text text="Manage users across all churches" variant="muted" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Text text="Total Users" variant="muted" className="text-sm" />
                <Heading
                  level={2}
                  text={totalUsers.toString()}
                  className="text-2xl font-semibold mt-1"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Text text="Active Users" variant="muted" className="text-sm" />
                <Heading
                  level={2}
                  text={activeUsers.toString()}
                  className="text-2xl font-semibold mt-1"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Text
                  text="Blocked Users"
                  variant="muted"
                  className="text-sm"
                />
                <Heading
                  level={2}
                  text={blockedUsers.toString()}
                  className="text-2xl font-semibold mt-1"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Text text="Super Admins" variant="muted" className="text-sm" />
                <Heading
                  level={2}
                  text={superAdmins.toString()}
                  className="text-2xl font-semibold mt-1"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={selectedChurchId}
              onValueChange={setSelectedChurchId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Churches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Churches</SelectItem>
                {uniqueChurches.map((church) => (
                  <SelectItem key={church.id} value={church.id}>
                    {church.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Worship">Worship</SelectItem>
                <SelectItem value="Youth">Youth</SelectItem>
                <SelectItem value="Children">Children</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Church
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Last Active
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <tr
                      key={i}
                      className={cn(
                        "border-b last:border-0 hover:bg-gray-50 transition-colors",
                        user.isBlocked && "bg-red-50/30 hover:bg-red-50/50",
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                              user.churchInitBg,
                              user.churchInitColor,
                            )}
                          >
                            {user.church?.alias}
                          </div>
                          <span className="text-sm">{user.church?.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {user.email}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {user.phone || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                            roleBadgeClass[user.role] || roleBadgeClass.Default,
                          )}
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {formatDate(user.lastActive)}
                      </td>
                      <td className="py-3 px-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <Lock className="h-3 w-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleViewUser(user)}
                          >
                            View
                          </Button>
                          {user.isBlocked ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsBlockModalOpen(true);
                              }}
                            >
                              <Unlock className="h-3.5 w-3.5 mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsBlockModalOpen(true);
                              }}
                            >
                              <Lock className="h-3.5 w-3.5 mr-1" />
                              Block
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <Text text="No users found" className="text-gray-500" />
                <Text
                  text="Try adjusting your search or filters"
                  variant="muted"
                  className="text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View User Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {selectedUser?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl">{selectedUser?.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      roleBadgeClass[selectedUser?.role] ||
                        roleBadgeClass.Default,
                    )}
                  >
                    {selectedUser && getRoleIcon(selectedUser.role)}
                    {selectedUser?.role}
                  </span>
                  {selectedUser?.isBlocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <Lock className="h-3 w-3" />
                      Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              User details and access information
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="space-y-4">
            {/* Church Information */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <Text
                  text="Church"
                  variant="blue"
                  className="font-medium text-sm"
                />
              </div>
              <div className="pl-6">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      selectedChurch?.initBg,
                      selectedChurch?.initColor,
                    )}
                  >
                    {selectedChurch?.initials}
                  </div>
                  <div>
                    <Text text={selectedChurch?.name} className="font-medium" />
                    <Text
                      text={`ID: ${selectedChurch?.id}`}
                      variant="muted"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Text
                  text="Contact Information"
                  variant="blue"
                  className="font-medium text-sm"
                />
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex items-center justify-between py-1">
                  <Text text="Email" variant="muted" className="text-xs" />
                  <Text text={selectedUser?.email || "—"} className="text-sm" />
                </div>
                <div className="flex items-center justify-between py-1">
                  <Text text="Phone" variant="muted" className="text-xs" />
                  <Text text={selectedUser?.phone || "—"} className="text-sm" />
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-gray-500" />
                <Text
                  text="Activity"
                  variant="blue"
                  className="font-medium text-sm"
                />
              </div>
              <div className="pl-6">
                <div className="flex items-center justify-between py-1">
                  <Text
                    text="Last Active"
                    variant="muted"
                    className="text-xs"
                  />
                  <Text
                    text={
                      selectedUser?.lastActive
                        ? formatDate(selectedUser.lastActive)
                        : "—"
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <DialogFooter className="flex justify-between gap-3">
            <Button
              variant={selectedUser?.isBlocked ? "default" : "destructive"}
              onClick={() => {
                setIsViewModalOpen(false);
                setIsBlockModalOpen(true);
              }}
              className="gap-2"
            >
              {selectedUser?.isBlocked ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {selectedUser?.isBlocked ? "Unblock User" : "Block User"}
            </Button>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
      <AlertDialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {selectedUser?.isBlocked ? (
                <Unlock className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-red-600" />
              )}
              {selectedUser?.isBlocked ? "Unblock User" : "Block User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.isBlocked ? (
                <>
                  Are you sure you want to unblock{" "}
                  <span className="font-semibold">{selectedUser?.name}</span>?
                  <br />
                  <br />
                  <span className="text-green-600">✓</span> The user will regain
                  full access to the platform.
                  <br />
                  <span className="text-green-600">✓</span> They will be able to
                  log in and access church features.
                </>
              ) : (
                <>
                  Are you sure you want to block{" "}
                  <span className="font-semibold">{selectedUser?.name}</span>?
                  <br />
                  <br />
                  <span className="text-red-600">⚠</span> The user will lose
                  access to all platform features.
                  <br />
                  <span className="text-red-600">⚠</span> They will be unable to
                  log in to their account.
                  <br />
                  <span className="text-red-600">⚠</span> This action can be
                  reversed later.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleBlock}
              className={
                selectedUser?.isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {selectedUser?.isBlocked
                ? "Yes, Unblock User"
                : "Yes, Block User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
