import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Profile from "@/models/Profile";
import MedicalProfile from "@/models/MedicalProfile";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      dateOfBirth,
      gender,
      language,
      location,
      concernedPerson,
      medicalConditions,
      currentMedications,
      allergies,
      substanceUse,
      previousTherapy,
      previousTherapyDetails,
      psychiatricHospitalization,
      currentTreatment,
      diagnosedConditions,
      primaryIssue,
      secondaryIssues,
      issueDescription,
      severity,
      duration,
      triggeringSituation,
      symptoms,
      dailyLifeImpact,
      sleepQuality,
      appetiteChanges,
      treatmentGoals,
      therapyApproach,
      concernsAboutTherapy,
      availability,
      modality,
      sessionFrequency,
      notes,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      crisisPlan,
      suicidalThoughts,
      preferredGender,
      preferredAge,
      languagePreference,
      culturalConsiderations,
      professionalProfile,
    } = await req.json();

    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role,
      status: role == "professional" ? "pending" : "active",
      phone,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      language:
        language === "english"
          ? "en"
          : language === "french"
            ? "fr"
            : undefined,
      location: location,
    });

    await user.save();

    if (user.role === "professional") {
      // Create profile for the user with provided professional data
      const profile = new Profile({
        userId: user._id,
        // Professional Information
        problematics: professionalProfile?.problematics,
        approaches: professionalProfile?.approaches,
        ageCategories: professionalProfile?.ageCategories,
        skills: professionalProfile?.skills,
        bio: professionalProfile?.bio,
        yearsOfExperience: professionalProfile?.yearsOfExperience,
        specialty: professionalProfile?.specialty,
        license: professionalProfile?.license,
        certifications: professionalProfile?.certifications,
        // Availability & Scheduling
        availability: professionalProfile?.availability,
        // Languages & Session Types
        languages: professionalProfile?.languages,
        sessionTypes: professionalProfile?.sessionTypes,
        modalities: professionalProfile?.modalities,
        // Pricing & Payment
        pricing: professionalProfile?.pricing,
        paymentAgreement: professionalProfile?.paymentAgreement,
        // Education
        education: professionalProfile?.education,
        profileCompleted: false,
      });

      await profile.save();

      // Link the profile to the user
      user.profile = profile.id;
      await user.save();
    } else if (user.role === "client") {
      // Create medical profile for the client with signup data
      const medicalProfile = new MedicalProfile({
        userId: user._id,
        // Personal Information
        concernedPerson: concernedPerson,
        // Health Background
        medicalConditions: medicalConditions,
        currentMedications: currentMedications,
        allergies: allergies,
        substanceUse: substanceUse,
        // Mental Health History
        previousTherapy: previousTherapy,
        previousTherapyDetails: previousTherapyDetails,
        psychiatricHospitalization: psychiatricHospitalization,
        currentTreatment: currentTreatment,
        diagnosedConditions: diagnosedConditions,
        // Current Concerns
        primaryIssue: primaryIssue,
        secondaryIssues: secondaryIssues,
        issueDescription: issueDescription,
        severity: severity,
        duration: duration,
        triggeringSituation: triggeringSituation,
        // Symptoms & Impact
        symptoms: symptoms,
        dailyLifeImpact: dailyLifeImpact,
        sleepQuality: sleepQuality,
        appetiteChanges: appetiteChanges,
        // Goals & Treatment Preferences
        treatmentGoals: treatmentGoals,
        therapyApproach: therapyApproach,
        concernsAboutTherapy: concernsAboutTherapy,
        // Appointment Preferences
        availability: availability,
        modality: modality,
        sessionFrequency: sessionFrequency,
        notes: notes,
        // Emergency Information
        emergencyContactName: emergencyContactName,
        emergencyContactPhone: emergencyContactPhone,
        emergencyContactRelation: emergencyContactRelation,
        crisisPlan: crisisPlan,
        suicidalThoughts: suicidalThoughts,
        // Professional Matching Preferences
        preferredGender: preferredGender,
        preferredAge: preferredAge,
        languagePreference: languagePreference,
        culturalConsiderations: culturalConsiderations,
        profileCompleted: false,
      });

      await medicalProfile.save();
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "unknown error",
      },
      { status: 500 },
    );
  }
}
