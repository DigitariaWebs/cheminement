"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { profileAPI, usersAPI } from "@/lib/api-client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { IUser } from "@/models/User";

interface Profile {
  concernedPerson?: string;
  profileCompleted?: boolean;
}

export default function ClientProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const t = useTranslations("Client.profile");

  const fetchUserProfile = async () => {
    try {
      const userData = await usersAPI.get();
      setUser(userData as IUser);
      const profileData = await profileAPI.get();
      setProfile(profileData as Profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditField = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName);
    setFieldValue(currentValue || "");
  };

  const handleSaveField = async () => {
    if (!editingField) return;

    setIsSaving(true);
    try {
      await usersAPI.update({ [editingField]: fieldValue });
      await fetchUserProfile();
      setEditingField(null);
      setFieldValue("");
    } catch (error) {
      console.error("Error updating field:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setFieldValue("");
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {/* Personal Information */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <h2 className="font-serif text-2xl font-light text-foreground">
          {t("personalInfo.title")}
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("personalInfo.firstName")}</Label>
              {editingField === "firstName" ? (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={t("personalInfo.firstName")}
                    className="max-w-xs"
                  />
                  <Button
                    onClick={handleSaveField}
                    disabled={isSaving || !fieldValue.trim()}
                    size="sm"
                  >
                    {isSaving ? t("saving") : t("save")}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-foreground">{user.firstName || "N/A"}</p>
                  {!editingField && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditField("firstName", user.firstName || "")
                      }
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("personalInfo.lastName")}</Label>
              {editingField === "lastName" ? (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={t("personalInfo.lastName")}
                    className="max-w-xs"
                  />
                  <Button
                    onClick={handleSaveField}
                    disabled={isSaving || !fieldValue.trim()}
                    size="sm"
                  >
                    {isSaving ? t("saving") : t("save")}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-foreground">{user.lastName || "N/A"}</p>
                  {!editingField && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditField("lastName", user.lastName || "")
                      }
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("personalInfo.email")}</Label>
              <p className="text-foreground">{user.email || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <Label>{t("personalInfo.phone")}</Label>
              {editingField === "phone" ? (
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={t("personalInfo.phonePlaceholder")}
                    className="max-w-xs"
                  />
                  <Button
                    onClick={handleSaveField}
                    disabled={isSaving || !fieldValue.trim()}
                    size="sm"
                  >
                    {isSaving ? t("saving") : t("save")}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-foreground">{user.phone || "N/A"}</p>
                  {!editingField && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditField("phone", user.phone || "")}
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("personalInfo.language")}</Label>
              {editingField === "language" ? (
                <div className="flex gap-2">
                  <Select value={fieldValue} onValueChange={setFieldValue}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder={t("personalInfo.language")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSaveField}
                    disabled={isSaving || !fieldValue.trim()}
                    size="sm"
                  >
                    {isSaving ? t("saving") : t("save")}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-foreground">{user.language || "N/A"}</p>
                  {!editingField && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditField("language", user.language || "")
                      }
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("personalInfo.gender")}</Label>
              {editingField === "gender" ? (
                <div className="flex gap-2">
                  <Select value={fieldValue} onValueChange={setFieldValue}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder={t("personalInfo.gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSaveField}
                    disabled={isSaving}
                    size="sm"
                  >
                    {isSaving ? t("saving") : t("save")}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-foreground">{user.gender || "Other"}</p>
                  {!editingField && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditField("gender", user.gender || "")
                      }
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("personalInfo.dateOfBirth")}</Label>
              {editingField === "dateOfBirth" ? (
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={t("personalInfo.dateOfBirth")}
                    className="max-w-xs"
                  />
                  <Button
                    onClick={handleSaveField}
                    disabled={isSaving || !fieldValue.trim()}
                    size="sm"
                  >
                    {isSaving ? t("saving") : t("save")}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-foreground">
                    {user.dateOfBirth?.toString() || "N/A"}
                  </p>
                  {!editingField && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditField(
                          "dateOfBirth",
                          user.dateOfBirth?.toString() || "",
                        )
                      }
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("personalInfo.location")}</Label>
              {editingField === "location" ? (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={t("personalInfo.location")}
                    className="max-w-xs"
                  />
                  <Button
                    onClick={handleSaveField}
                    disabled={isSaving || !fieldValue.trim()}
                    size="sm"
                  >
                    {isSaving ? t("saving") : t("save")}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-foreground">{user.location || "N/A"}</p>
                  {!editingField && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditField("location", user.location || "")
                      }
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Issue Details */}
      {/*<section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <h2 className="font-serif text-2xl font-light text-foreground">
          {t("issue.title")}
        </h2>
        <div className="mt-6 grid gap-6">
          <div className="space-y-2">
            <Label>{t("issue.concernedPerson")}</Label>
            <p className="text-foreground">
              {profile?.concernedPerson || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t("issue.primaryIssue")}</Label>
            <p className="text-foreground">{user.primaryIssue || "N/A"}</p>
          </div>

          {user.secondaryIssues && user.secondaryIssues.length > 0 && (
            <div className="space-y-2">
              <Label>{t("issue.secondaryIssues")}</Label>
              <p className="text-foreground">
                {user.secondaryIssues.join(", ")}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>{t("issue.description")}</Label>
            <p className="text-foreground">{user.issueDescription || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Label>{t("issue.severity")}</Label>
            <p className="text-foreground">{user.severity || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Label>{t("issue.duration")}</Label>
            <p className="text-foreground">{user.duration || "N/A"}</p>
          </div>
        </div>
      </section>*/}

      {/* Preferences */}
      {/*<section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <h2 className="font-serif text-2xl font-light text-foreground">
          {t("preferences.title")}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {user.availability && user.availability.length > 0 && (
            <div className="space-y-2">
              <Label>{t("preferences.availability")}</Label>
              <p className="text-foreground">{user.availability.join(", ")}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>{t("preferences.modality")}</Label>
            <p className="text-foreground">{user.modality || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Label>{t("preferences.preferredGender")}</Label>
            <p className="text-foreground">{user.preferredGender || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Label>{t("preferences.preferredAge")}</Label>
            <p className="text-foreground">{user.preferredAge || "N/A"}</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{t("preferences.preferredApproach")}</Label>
            <p className="text-foreground">{user.preferredApproach || "N/A"}</p>
          </div>

          {user.notes && (
            <div className="space-y-2 md:col-span-2">
              <Label>{t("preferences.notes")}</Label>
              <p className="text-foreground">{user.notes}</p>
            </div>
          )}
        </div>
      </section>*/}

      {/* Account Information */}
      <section className="rounded-3xl border border-border/20 bg-card/80 p-7 shadow-lg">
        <h2 className="font-serif text-2xl font-light text-foreground">
          Account Information
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>User ID</Label>
            <p className="text-foreground font-mono text-sm">
              {user.id || user._id || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <p className="text-foreground capitalize">{user?.role || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <p className="text-foreground capitalize">{user.status || "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Label>Profile Completed</Label>
            <p className="text-foreground">
              {profile?.profileCompleted ? "Yes" : "No"}
            </p>
          </div>

          {user.createdAt && (
            <div className="space-y-2">
              <Label>Member Since</Label>
              <p className="text-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {user.updatedAt && (
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <p className="text-foreground">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
