"use client";
import { Text } from "@/components/ui/typography/Text";
import { useState } from "react";
import { UserManagementPage } from "./user-management";

export function SettingsAdminPage() {
  const [activeTab] = useState("user-management");

  const renderContent = () => {
    switch (activeTab) {
      case "user-management":
        return <UserManagementPage />;
      case "roles-permissions":
        return (
          <div className="text-center py-16 text-gray-500">
            <Text variant="default">Roles & Permissions</Text>
            <Text variant="muted">Coming soon...</Text>
          </div>
        );
      case "preference":
        return (
          <div className="text-center py-16 text-gray-500">
            <Text variant="default">Preference</Text>
            <Text variant="muted">Coming soon...</Text>
          </div>
        );
      case "account-settings":
        return (
          <div className="text-center py-16 text-gray-500">
            <Text variant="default">Account Settings</Text>
            <Text variant="muted">Coming soon...</Text>
          </div>
        );
      default:
        return <UserManagementPage />;
    }
  };

  return <>{renderContent()}</>;
}
