"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInformation from "@/components/dashboard/BasicInformation";
import ProfessionalProfile from "@/components/dashboard/ProfessionalProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usersAPI, profileAPI } from "@/lib/api-client";
import { IUser } from "@/models/User";
import { IProfile } from "@/models/Profile";

export default function ProfessionalDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchData = async () => {
    try {
      const [userData, profileData] = await Promise.all([
        usersAPI.getById(params.id as string),
        profileAPI.getById(params.id as string),
      ]);
      setUser(userData as IUser);
      setProfile(profileData as IProfile);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleSetActive = async () => {
    if (!user) return;

    setIsUpdatingStatus(true);
    try {
      await usersAPI.updateById(params.id as string, { status: "active" });
      await fetchData();
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSetInactive = async () => {
    if (!user) return;

    setIsUpdatingStatus(true);
    try {
      await usersAPI.updateById(params.id as string, { status: "inactive" });
      await fetchData();
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/admin/dashboard/professionals">
            ← Back to Professionals
          </Link>
        </Button>
        <div className="flex gap-2">
          {user.status === "pending" && (
            <Button
              onClick={handleSetActive}
              disabled={isUpdatingStatus}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdatingStatus ? "Updating..." : "Set Status to Active"}
            </Button>
          )}
          {user.status === "active" && (
            <Button
              onClick={handleSetInactive}
              disabled={isUpdatingStatus}
              variant="destructive"
            >
              {isUpdatingStatus ? "Updating..." : "Set Status to Inactive"}
            </Button>
          )}
          {user.status === "inactive" && (
            <Button
              onClick={handleSetActive}
              disabled={isUpdatingStatus}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdatingStatus ? "Updating..." : "Set Status to Active"}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-light text-foreground">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </h1>
            {profile?.specialty && (
              <p className="text-lg text-muted-foreground capitalize">
                {profile.specialty}
              </p>
            )}
          </div>
          <Badge
            variant={
              user.status === "active"
                ? "default"
                : user.status === "pending"
                  ? "secondary"
                  : "destructive"
            }
            className="text-sm px-3 py-1"
          >
            {user.status || "Unknown"}
          </Badge>
        </div>
      </div>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <BasicInformation user={user} isEditable={false} />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfessionalProfile profile={profile || undefined} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="rounded-xl bg-card p-6">
            <h2 className="text-xl font-serif font-light text-foreground mb-6">
              Statistics
            </h2>
            <p className="text-muted-foreground">
              Statistics content coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
