"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Save,
  Trash2,
  Users2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  PlayCircle,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [caseload, setCaseload] = useState<any>({
    proposed: [],
    accepted: [],
    ongoing: [],
    completed: [],
  });
  const [saving, setSaving] = useState(false);
  
  // Feedback states
  const [feedback, setFeedback] = useState<{type: "success" | "error", message: string} | null>(null);
  
  // Modals / actions states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    status: "active",
    specialty: "",
    license: "",
    bio: "",
    yearsOfExperience: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, caseloadRes] = await Promise.all([
        fetch(`/api/admin/users/${id}`),
        fetch(`/api/admin/professionals/${id}/caseload`),
      ]);

      if (!userRes.ok) throw new Error("Failed to load user");
      const userData = await userRes.json();
      
      if (caseloadRes.ok) {
        const clData = await caseloadRes.json();
        setCaseload(clData.caseload || { proposed: [], accepted: [], ongoing: [], completed: [] });
      }

      setData(userData);
      
      setFormData({
        firstName: userData.user.firstName || "",
        lastName: userData.user.lastName || "",
        email: userData.user.email || "",
        phone: userData.user.phone || "",
        location: userData.user.location || "",
        status: userData.user.status || "active",
        specialty: userData.profile?.specialty || "",
        license: userData.profile?.license || "",
        bio: userData.profile?.bio || "",
        yearsOfExperience: userData.profile?.yearsOfExperience || 0,
      });
    } catch (error) {
      setFeedback({ type: "error", message: "Impossible de charger le dossier professionnel." });
      router.push("/admin/dashboard/professionals");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "number" ? parseInt(value) || 0 : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      setFeedback({ type: "success", message: "Le profil professionnel a été mis à jour." });
      setTimeout(() => setFeedback(null), 3000);
      fetchData();
    } catch {
      setFeedback({ type: "error", message: "Impossible de mettre à jour le profil." });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmName !== `${data?.user?.firstName} ${data?.user?.lastName}`) {
      setFeedback({ type: "error", message: "Le nom saisi ne correspond pas." });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/dashboard/professionals");
    } catch {
      setFeedback({ type: "error", message: "Impossible de supprimer le profil." });
      setTimeout(() => setFeedback(null), 3000);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.user) return null;

  const { user } = data;
  
  const renderClientList = (clients: any[], emptyMessage: string) => (
    clients.length === 0 ? (
      <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
        {emptyMessage}
      </div>
    ) : (
      <div className="overflow-x-auto border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du patient</TableHead>
              <TableHead>Courriel</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Dernier RDV</TableHead>
              <TableHead className="w-16">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-muted-foreground">{client.email}</TableCell>
                <TableCell className="text-muted-foreground">{client.phone || "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {client.lastAppointmentDate ? new Date(client.lastAppointmentDate).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/dashboard/patients/${client.id}`}>
                    <Button variant="ghost" size="sm">Voir</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/professionals">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-light text-foreground flex items-center gap-3">
              {user.firstName} {user.lastName}
              <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
            </h1>
            <p className="text-muted-foreground font-light mt-1">
              Spécialité : {formData.specialty || "Non renseignée"}
            </p>
          </div>
        </div>
      </div>
      
      {feedback && (
        <div className={`p-4 rounded-md text-sm border ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border/40 rounded-xl p-6">
            <h2 className="text-xl font-serif font-light mb-4 text-primary">Informations de base</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Courriel</Label>
                <Input name="email" value={formData.email} onChange={handleChange} type="email" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} type="tel" />
              </div>
              <div className="space-y-2">
                <Label>Ville / Localité</Label>
                <Input name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Statut du compte</Label>
                <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="pending">En attente / En révision</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <hr className="my-6 border-border" />
            
            <h2 className="text-xl font-serif font-light mb-4 text-primary">Détails professionnels</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Spécialité principale</Label>
                <Input name="specialty" value={formData.specialty} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Numéro de permis (OPQ, Ordre...)</Label>
                <Input name="license" value={formData.license} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Années d'expérience</Label>
                <Input name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} min={0} />
              </div>
              <div className="space-y-2">
                <Label>Biographie / Description courte</Label>
                <Textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Sauvegarder les modifications
              </Button>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900 rounded-xl p-6">
            <h2 className="text-lg font-serif font-light mb-2 text-red-600 dark:text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> Danger Zone
            </h2>
            <p className="text-sm font-light mb-4 text-red-800/80 dark:text-red-200/80">
              La suppression de ce professionnel est définitive. Ses patients actifs devront être réassignés.
            </p>
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <Trash2 className="h-4 w-4" />
                  Supprimer Professionnel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                    Veuillez taper <strong>{user.firstName} {user.lastName}</strong> pour confirmer la désactivation de ce profil.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder="Tapez le nom complet"
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting || deleteConfirmName !== `${user.firstName} ${user.lastName}`}>
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Right Col - Caseload */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border/40 rounded-xl p-6 h-full shadow-sm">
            <h2 className="text-2xl font-serif font-light mb-6 flex items-center gap-2">
              <Users2 className="h-6 w-6 text-primary" /> Dossiers Cliniques (Caseload)
            </h2>
            
            <Tabs defaultValue="ongoing" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="proposed" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" /> Proposés ({caseload.proposed.length})
                </TabsTrigger>
                <TabsTrigger value="accepted" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Acceptés ({caseload.accepted.length})
                </TabsTrigger>
                <TabsTrigger value="ongoing" className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" /> En cours ({caseload.ongoing.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Terminés ({caseload.completed.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="proposed" className="mt-0">
                <h3 className="text-lg font-medium mb-3">Triage — Clients proprosés</h3>
                <p className="text-muted-foreground text-sm mb-4">Ces clients ont été proposés par le système et attendent une réponse du professionnel.</p>
                {renderClientList(caseload.proposed, "Aucun client proposé en attente.")}
              </TabsContent>
              
              <TabsContent value="accepted" className="mt-0">
                <h3 className="text-lg font-medium mb-3">Premières séances planifiées</h3>
                <p className="text-muted-foreground text-sm mb-4">La première séance est planifiée mais le processus thérapeutique complet n'est pas encore "en cours".</p>
                {renderClientList(caseload.accepted, "Aucun client dans ce statut.")}
              </TabsContent>
              
              <TabsContent value="ongoing" className="mt-0">
                <h3 className="text-lg font-medium mb-3">Thérapies en cours</h3>
                <p className="text-muted-foreground text-sm mb-4">La liste des clients réguliers actifs de ce professionnel.</p>
                {renderClientList(caseload.ongoing, "Aucun suivi en cours.")}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <h3 className="text-lg font-medium mb-3">Dossiers terminés</h3>
                <p className="text-muted-foreground text-sm mb-4">Historique des clients pour lesquels l'accompagnement est officiellement terminé.</p>
                {renderClientList(caseload.completed, "Aucun dossier terminé.")}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
