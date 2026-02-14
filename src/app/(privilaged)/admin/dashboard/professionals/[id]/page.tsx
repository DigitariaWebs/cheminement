"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInformation from "@/components/dashboard/BasicInformation";
import ProfessionalProfile from "@/components/dashboard/ProfessionalProfile";
import AvailabilitySchedule from "@/app/(privilaged)/professional/dashboard/profile/AvailabilitySchedule";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Calendar, CheckCircle2 } from "lucide-react";
import { usersAPI, profileAPI } from "@/lib/api-client";
import { IUser } from "@/models/User";
import { IProfile } from "@/models/Profile";

export default function ProfessionalDetailPage() {
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
      } catch {
        console.log("Profile not found for professional:", params.id);
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

  // Check if professional has configured their schedule
  const hasSchedule = useMemo(() => {
    return profile?.availability?.days?.some((day) => day.isWorkDay === true) ?? false;
  }, [profile]);

  // Determine if professional can be activated
  const canActivate = hasSchedule;

  const handleSetActive = async () => {
    if (!user) return;

    if (!canActivate) {
      alert(
        "Cannot activate professional. The professional must configure their schedule first.",
      );
      return;
    }

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
          <Link href="/admin/dashboard/professionals">
            ← Back to Professionals
          </Link>
        </Button>
        <div className="flex gap-3">
          {user.status === "pending" && (
            <Button
              onClick={handleSetActive}
              disabled={isUpdatingStatus || !canActivate}
              className="bg-green-600 hover:bg-green-700 font-light tracking-wide transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingStatus ? "Updating..." : "Activate Professional"}
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
              disabled={isUpdatingStatus || !canActivate}
              className="bg-green-600 hover:bg-green-700 font-light tracking-wide transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingStatus ? "Updating..." : "Reactivate Professional"}
            </Button>
          )}
        </div>
      </div>

      {/* Activation Status Alert */}
      {(user.status === "pending" || user.status === "inactive") && (
        <Alert variant={canActivate ? "default" : "destructive"} className="border-2">
          {canActivate ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <AlertTitle className="font-medium">Ready for Activation</AlertTitle>
              <AlertDescription>
                This professional has configured their availability schedule and can be activated.
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-medium">Cannot Activate - Schedule Required</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  This professional has not configured their availability schedule yet. 
                  They must set up at least one working day before activation.
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Check the <strong>Schedule</strong> tab below to view their current availability settings.
                </p>
              </AlertDescription>
            </>
          )}
        </Alert>
      )}

      <div className="rounded-xl bg-card p-8 border border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h1 className="text-4xl font-serif font-light text-foreground tracking-tight">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </h1>
            {profile?.specialty && (
              <p className="text-lg text-muted-foreground font-light capitalize">
                {profile.specialty}
              </p>
            )}
            {profile?.license && (
              <p className="text-sm text-muted-foreground font-light">
                License: {profile.license}
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
        <TabsList className="grid w-full grid-cols-3 bg-muted/30">
          <TabsTrigger value="basic" className="font-light">
            Basic Information
          </TabsTrigger>
          <TabsTrigger value="profile" className="font-light">
            Profile Details
          </TabsTrigger>
          <TabsTrigger value="schedule" className="font-light">
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 mt-6">
          <BasicInformation user={user} isEditable={false} />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <ProfessionalProfile profile={profile || undefined} />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6 mt-6">
          <AvailabilitySchedule
            profile={profile}
            setProfile={setProfile}
            isEditable={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
