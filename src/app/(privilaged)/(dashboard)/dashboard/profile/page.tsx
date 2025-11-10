"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import ProfileCompletionModal, {
  ProfileData,
} from "@/components/dashboard/ProfileCompletionModal";

// Mock data - this would come from the signup process
const mockUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  license: "PSY-12345",
  specialty: "psychologist",
  location: "Montreal, QC",
  status: "pending-review",
};

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const handleCompleteProfile = (data: ProfileData) => {
    setProfileData(data);
    setIsProfileComplete(true);
    console.log("Profile data saved:", data);
  };

  const getStatusInfo = () => {
    switch (mockUserData.status) {
      case "pending-review":
        return {
          icon: Clock,
          text: "Pending Review",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
      case "approved":
        return {
          icon: CheckCircle2,
          text: "Approved",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "incomplete":
        return {
          icon: AlertCircle,
          text: "Incomplete",
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      default:
        return {
          icon: Clock,
          text: "Pending Review",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
    }
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-light text-foreground">
            Professional Profile
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            Manage your professional information and preferences
          </p>
        </div>

        {/* Status Banner */}
        <div
          className={`rounded-xl ${status.bgColor} p-6 flex items-start gap-4`}
        >
          <StatusIcon className={`h-6 w-6 ${status.color} shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h3 className={`font-light ${status.color} text-lg mb-2`}>
              Account Status: {status.text}
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              {mockUserData.status === "pending-review" &&
                "Your account is currently under review. Complete your profile setup below to start matching with clients once approved."}
              {mockUserData.status === "incomplete" &&
                "Please complete all required profile information to submit for review."}
              {mockUserData.status === "approved" &&
                "Your account is active and ready to accept clients."}
            </p>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {!isProfileComplete && (
          <div className="rounded-xl bg-primary/10 p-6 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-light text-foreground text-lg mb-2">
                Complete Your Profile Setup
              </h3>
              <p className="text-sm text-muted-foreground font-light mb-4">
                To start matching with clients, please complete your
                professional profile with your specializations, approaches, and
                preferences.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
              >
                Complete Profile Now
              </button>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="rounded-xl bg-card p-6">
          <h2 className="text-xl font-serif font-light text-foreground mb-6">
            Basic Information
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <p className="text-foreground">
                {mockUserData.firstName} {mockUserData.lastName}
              </p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              <p className="text-foreground">{mockUserData.email}</p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              <p className="text-foreground">{mockUserData.phone}</p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </Label>
              <p className="text-foreground">{mockUserData.location}</p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                License Number
              </Label>
              <p className="text-foreground">{mockUserData.license}</p>
            </div>

            <div>
              <Label className="font-light mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Specialty
              </Label>
              <p className="text-foreground capitalize">
                {mockUserData.specialty.replace("-", " ")}
              </p>
            </div>
          </div>

          {!isProfileComplete && (
            <div className="mt-6 pt-6 border-t border-border/40">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-muted text-foreground rounded-full font-light tracking-wide transition-all duration-300 hover:bg-muted/80 text-sm"
              >
                Complete Profile Setup
              </button>
            </div>
          )}
        </div>

        {/* Profile Details - Only show after completion */}
        {isProfileComplete && profileData && (
          <>
            <div className="rounded-xl bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-light text-foreground">
                  Professional Specializations
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-primary hover:text-primary/80 font-light"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="font-light mb-3 text-base">
                    Issue Types
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.problematics.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-light mb-3 text-base">
                    Therapeutic Approaches
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.approaches.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-light mb-3 text-base">
                    Age Categories
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.ageCategories.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {profileData.skills.length > 0 && (
                  <div>
                    <Label className="font-light mb-3 text-base">
                      Additional Skills
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 bg-muted text-foreground rounded-full text-sm font-light"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-light text-foreground">
                  About
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-primary hover:text-primary/80 font-light"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="font-light mb-2 text-base">
                    Years of Experience
                  </Label>
                  <p className="text-foreground">
                    {profileData.yearsOfExperience} years
                  </p>
                </div>

                <div>
                  <Label className="font-light mb-2 text-base">
                    Professional Bio
                  </Label>
                  <p className="text-foreground leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Platform Benefits Reminder */}
        <div className="rounded-xl bg-muted/30 p-6">
          <h3 className="font-serif font-light text-lg text-foreground mb-4">
            What You&apos;ll Get Access To
          </h3>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground font-light">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Smart client matching based on your expertise</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                Practice management tools (scheduling, billing, records)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Virtual library with books, articles, and tests</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Free supervision and professional development</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Support community and clinical discussions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>Content development assistance (podcasts, videos)</span>
            </li>
          </ul>
        </div>
      </div>

      <ProfileCompletionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleCompleteProfile}
      />
    </>
  );
}
