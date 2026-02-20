import { Button } from "@/components/ui/button";
import { User, Users, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function BookingButtonsGroup({
  title = "Choisir votre parcours",
}: {
  title?: string;
}) {
  return (
    <div className="my-8 text-center">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Order: 1. For me (Individual), 2. For a loved one, 3. For a patient */}
        <Button asChild variant="default" size="lg">
          <Link href="/appointment?for=self" className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Pour moi Individuel
          </Link>
        </Button>
        <Button asChild variant="default" size="lg">
          <Link href="/appointment?for=loved-one" className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pour un proche
          </Link>
        </Button>
        <Button asChild variant="default" size="lg">
          <Link href="/appointment?for=patient" className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Pour un patient
          </Link>
        </Button>
      </div>
    </div>
  );
}
