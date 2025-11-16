"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInformation from "@/components/dashboard/BasicInformation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usersAPI, profileAPI } from "@/lib/api-client";
import { IUser } from "@/models/User";
import { IProfile } from "@/models/Profile";

export default function PatientDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const userData = await usersAPI.getById(params.id as string);
      setUser(userData as IUser);
      
      try {
        const profileData = await profileAPI.getById(params.id as string);
        setProfile(profileData as IProfile);
      } catch (error) {
        // Profile might not exist for patients
        console.log("Profile not found for patient:", params.id);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id, fetchData]);

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground font-light">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" className="font-light">
          <Link href="/admin/dashboard/patients">
            ← Back to Patients
          </Link>
        </Button>
        <div className="flex gap-3">
          {user.status === "pending" && (
            <Button
              onClick={handleSetActive}
              disabled={isUpdatingStatus}
              className="bg-green-600 hover:bg-green-700 font-light tracking-wide transition-all duration-300 hover:scale-105"
            >
              {isUpdatingStatus ? "Updating..." : "Activate Patient"}
            </Button>
          )}
          {user.status === "active" && (
            <Button
              onClick={handleSetInactive}
              disabled={isUpdatingStatus}
              variant="destructive"
              className="font-light tracking-wide transition-all duration-300 hover:scale-105"
            >
              {isUpdatingStatus ? "Updating..." : "Deactivate"}
            </Button>
          )}
          {user.status === "inactive" && (
            <Button
              onClick={handleSetActive}
              disabled={isUpdatingStatus}
              className="bg-green-600 hover:bg-green-700 font-light tracking-wide transition-all duration-300 hover:scale-105"
            >
              {isUpdatingStatus ? "Updating..." : "Reactivate Patient"}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-card p-8 border border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h1 className="text-4xl font-serif font-light text-foreground tracking-tight">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </h1>
            {profile?.bio && (
              <p className="text-lg text-muted-foreground font-light">
                {profile.bio}
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
            className="text-sm px-4 py-1.5 font-light tracking-wide capitalize"
          >
            {user.status || "Unknown"}
          </Badge>
        </div>
      </div>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/30">
          <TabsTrigger value="basic" className="font-light">
            Basic Information
          </TabsTrigger>
          <TabsTrigger value="profile" className="font-light">
            Profile Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 mt-6">
          <BasicInformation user={user} isEditable={false} />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <div className="rounded-xl bg-card p-6">
            <h2 className="text-xl font-serif font-light text-foreground mb-6">
              Patient Profile
            </h2>
            {profile ? (
              <div className="space-y-4">
                {profile.problematics && profile.problematics.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground font-light mb-2">
                      Issues
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.problematics.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.bio && (
                  <div>
                    <p className="text-sm text-muted-foreground font-light mb-2">
                      Bio
                    </p>
                    <p className="text-foreground leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}
                {(!profile.problematics || profile.problematics.length === 0) && !profile.bio && (
                  <p className="text-muted-foreground">No additional profile information available</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No profile information available for this patient</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}