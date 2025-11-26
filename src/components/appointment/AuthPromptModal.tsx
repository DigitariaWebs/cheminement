"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, UserPlus, CheckCircle2 } from "lucide-react";

interface AuthPromptModalProps {
  open: boolean;
  onContinueAsGuest: () => void;
}

export default function AuthPromptModal({
  open,
  onContinueAsGuest,
}: AuthPromptModalProps) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/login?returnUrl=/appointment");
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            Book Your Appointment
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Choose how you&apos;d like to proceed with your booking
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {/* Sign In Option */}
          <div className="border rounded-lg p-6 space-y-4 hover:border-primary transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Sign In</h3>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Manage all your appointments</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Access your appointment history</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Save your preferences</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Easier rebooking</span>
              </div>
            </div>

            <Button onClick={handleSignIn} className="w-full" size="lg">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Guest Option */}
          <div className="border rounded-lg p-6 space-y-4 hover:border-primary transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg">Continue as Guest</h3>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Quick booking process</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>No account needed</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Receive email confirmation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Create account later</span>
              </div>
            </div>

            <Button
              onClick={onContinueAsGuest}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Your information is secure and will only be used for your appointment
        </p>
      </DialogContent>
    </Dialog>
  );
}
