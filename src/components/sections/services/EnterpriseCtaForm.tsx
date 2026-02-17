import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EnterpriseCtaForm() {
  return (
    <section className="enterprise-cta py-12">
      <h3 className="text-2xl font-semibold text-center mb-6 text-primary">
        Gestionnaire d'entreprise ?
      </h3>
      <form className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto bg-white dark:bg-muted p-6 rounded-lg shadow">
        <Input name="nom" placeholder="Nom" required />
        <Input name="prenom" placeholder="Prénom" required />
        <Input name="courriel" type="email" placeholder="Courriel" required />
        <Input
          name="telephone"
          type="tel"
          inputMode="tel"
          pattern="[0-9\s\-\+\(\)]*"
          placeholder="Téléphone (ex: 514-123-4567)"
          required
        />
        <Input name="compagnie" placeholder="Compagnie" required />
        <Input name="fonction" placeholder="Fonction" required />
        <Button type="submit" className="md:col-span-2 w-full mt-2">
          Contacter un conseiller
        </Button>
      </form>
    </section>
  );
}
