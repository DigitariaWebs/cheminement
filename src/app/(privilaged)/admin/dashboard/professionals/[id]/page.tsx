"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Inbox,
  History,
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
import { useTranslations, useLocale } from "next-intl";
import ProfessionalProfile from "@/components/dashboard/ProfessionalProfile";
import AvailabilitySchedule from "@/app/(privilaged)/professional/dashboard/profile/AvailabilitySchedule";
import { IProfile } from "@/models/Profile";

export default function ProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const t = useTranslations("AdminDashboard.professionalDetail");
  const locale = useLocale();
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

  // Ledger states
  const [ledger, setLedger] = useState<any>(null);
  const [loadingLedger, setLoadingLedger] = useState(false);

  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "ledger" ? "ledger" : "ongoing";

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
    gender: "",
    dateOfBirth: "",
    language: "fr",
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
        gender: userData.user.gender || "",
        dateOfBirth: userData.user.dateOfBirth ? new Date(userData.user.dateOfBirth).toISOString().split('T')[0] : "",
        language: userData.user.language || "fr",
      });
    } catch (error) {
      setFeedback({ type: "error", message: t("loadError") });
      router.push("/admin/dashboard/professionals");
    } finally {
      setLoading(false);
    }
  }, [id, router, t]);

  const fetchLedger = useCallback(async () => {
    try {
      setLoadingLedger(true);
      const res = await fetch(`/api/admin/accounting/professionals/${id}/ledger`);
      if (res.ok) {
        setLedger(await res.json());
      }
    } catch {
      // Slient fail for now
    } finally {
      setLoadingLedger(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    fetchLedger();
  }, [fetchData, fetchLedger]);

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

      setFeedback({ type: "success", message: t("updateSuccess") });
      setTimeout(() => setFeedback(null), 3000);
      fetchData();
    } catch {
      setFeedback({ type: "error", message: t("updateError") });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmName !== `${data?.user?.firstName} ${data?.user?.lastName}`) {
      setFeedback({ type: "error", message: t("deleteNameMismatch") });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/admin/dashboard/professionals");
    } catch {
      setFeedback({ type: "error", message: t("deleteError") });
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
              <TableHead>{t("colPatientName")}</TableHead>
              <TableHead>{t("colEmail")}</TableHead>
              <TableHead>{t("colPhone")}</TableHead>
              <TableHead>{t("colLastApt")}</TableHead>
              <TableHead className="w-16">{t("colAction")}</TableHead>
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
                    <Button variant="ghost" size="sm">{t("viewBtn")}</Button>
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
              {t("specialtyLabel")} {formData.specialty || t("noSpecialty")}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {t("saveChanges")}
        </Button>
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
            <h2 className="text-xl font-serif font-light mb-4 text-primary">{t("basicInfo")}</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("firstName")}</Label>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t("lastName")}</Label>
                <Input name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t("email")}</Label>
                <Input name="email" value={formData.email} onChange={handleChange} type="email" />
              </div>
              <div className="space-y-2">
                <Label>{t("phone")}</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} type="tel" />
              </div>
              <div className="space-y-2">
                <Label>{t("location")}</Label>
                <Input name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t("accountStatus")}</Label>
                <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("statusActive")}</SelectItem>
                    <SelectItem value="pending">{t("statusPending")}</SelectItem>
                    <SelectItem value="inactive">{t("statusInactive")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("mainSpecialty")}</Label>
                <Input name="specialty" value={formData.specialty} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t("licenseNumber")}</Label>
                <Input name="license" value={formData.license} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t("yearsExperience")}</Label>
                <Input name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t("gender")}</Label>
                <Select value={formData.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                    <SelectItem value="prefer_not_to_say">{t("preferNotToSay")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("dateOfBirth")}</Label>
                <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>{t("language")}</Label>
                <Select value={formData.language} onValueChange={(v) => handleSelectChange("language", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{t("french")}</SelectItem>
                    <SelectItem value="en">{t("english")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("bio")}</Label>
                <Textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full mt-4 gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t("saveChanges")}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-serif font-light text-primary">{t("profDetails")} complets</h2>
            {data.profile ? (
              <ProfessionalProfile 
                profile={data.profile} 
                isEditable={true} 
                userId={id} 
                onSaveOverride={async (profileData) => {
                  try {
                    const res = await fetch(`/api/admin/users/${id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(profileData),
                    });
                    if (!res.ok) throw new Error();
                    setFeedback({ type: "success", message: "Profil professionnel mis à jour avec succès." });
                    setTimeout(() => setFeedback(null), 3000);
                    fetchData();
                    return null;
                  } catch (e) {
                    setFeedback({ type: "error", message: "Impossible de mettre à jour le profil professionnel." });
                    setTimeout(() => setFeedback(null), 3000);
                    return null;
                  }
                }} 
              />
            ) : (
                <div className="bg-card border border-border/40 rounded-xl p-6">
                  <p className="text-muted-foreground text-sm font-light">Le profil de ce professionnel n'a pas encore été créé.</p>
                </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-serif font-light text-primary">Horaire et Disponibilité</h2>
            <AvailabilitySchedule 
              profile={data.profile} 
              isEditable={true} 
              setProfile={(updated) => setData({ ...data, profile: updated })}
              onSaveOverride={async (profileData) => {
                try {
                  const res = await fetch(`/api/admin/users/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profileData),
                  });
                  if (!res.ok) throw new Error();
                  setFeedback({ type: "success", message: "Horaire mis à jour avec succès." });
                  setTimeout(() => setFeedback(null), 3000);
                  // Refresh the data to update visual schedule
                  fetchData();
                  return null;
                } catch (e) {
                  setFeedback({ type: "error", message: "Impossible de mettre à jour l'horaire." });
                  setTimeout(() => setFeedback(null), 3000);
                  return null;
                }
              }} 
            />
          </div>

          <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900 rounded-xl p-6">
            <h2 className="text-lg font-serif font-light mb-2 text-red-600 dark:text-red-400 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> {t("dangerZone")}
            </h2>
            <p className="text-sm font-light mb-4 text-red-800/80 dark:text-red-200/80">
              {t("deleteWarning")}
            </p>
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <Trash2 className="h-4 w-4" />
                  {t("deleteButton")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("deleteConfirmTitle")}</DialogTitle>
                  <DialogDescription dangerouslySetInnerHTML={{ __html: t.raw("deleteConfirmDesc").replace("{name}", `${user.firstName} ${user.lastName}`) }}>
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder={t("typeFullNamePlaceholder")}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>{t("cancel")}</Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting || deleteConfirmName !== `${user.firstName} ${user.lastName}`}>
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("confirm")}
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
              <Users2 className="h-6 w-6 text-primary" /> {t("caseloadTitle")}
            </h2>
            
            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="proposed" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Inbox className="h-4 w-4" /> {t("proposed", { count: caseload.proposed.length })}
                </TabsTrigger>
                <TabsTrigger value="accepted" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Clock className="h-4 w-4" /> {t("accepted", { count: caseload.accepted.length })}
                </TabsTrigger>
                <TabsTrigger value="ongoing" className="flex items-center gap-2 text-xs sm:text-sm">
                  <PlayCircle className="h-4 w-4" /> {t("ongoing", { count: caseload.ongoing.length })}
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="h-4 w-4" /> {t("completed", { count: caseload.completed.length })}
                </TabsTrigger>
                <TabsTrigger value="ledger" className="flex items-center gap-2 text-xs sm:text-sm">
                  <History className="h-4 w-4" /> {t("ledgerTab")}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="proposed" className="mt-0">
                <h3 className="text-lg font-medium mb-3">{t("triageTitle")}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t("triageDesc")}</p>
                {renderClientList(caseload.proposed, t("triageEmpty"))}
              </TabsContent>
              
              <TabsContent value="accepted" className="mt-0">
                <h3 className="text-lg font-medium mb-3">{t("acceptedTitle")}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t("acceptedDesc")}</p>
                {renderClientList(caseload.accepted, t("acceptedEmpty"))}
              </TabsContent>
              
              <TabsContent value="ongoing" className="mt-0">
                <h3 className="text-lg font-medium mb-3">{t("ongoingTitle")}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t("ongoingDesc")}</p>
                {renderClientList(caseload.ongoing, t("ongoingEmpty"))}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <h3 className="text-lg font-medium mb-3">{t("completedTitle")}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t("completedDesc")}</p>
                {renderClientList(caseload.completed, t("completedEmpty"))}
              </TabsContent>

              <TabsContent value="ledger" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border bg-muted/20">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t("lifetimeBalance")}</p>
                    <p className={`text-2xl font-mono mt-1 ${ledger?.balanceLifetimeCad > 0 ? "text-green-600" : ""}`}>
                      {ledger ? `${ledger.balanceLifetimeCad.toFixed(2)} $` : "—"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border bg-muted/20">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t("currentCycleBalance")} ({ledger?.currentCycleKey})</p>
                    <p className={`text-2xl font-mono mt-1 ${ledger?.balanceCurrentCycleCad > 0 ? "text-green-600" : ""}`}>
                      {ledger ? `${ledger.balanceCurrentCycleCad.toFixed(2)} $` : "—"}
                    </p>
                  </div>
                </div>

                <div className="border rounded-xl bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">{t("colDate")}</TableHead>
                        <TableHead>{t("colDescription")}</TableHead>
                        <TableHead>{t("colEntryKind")}</TableHead>
                        <TableHead className="text-right">{t("colAmount")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingLedger ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      ) : !ledger?.entries || ledger.entries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                            {t("noEntries")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        ledger.entries.map((entry: any) => (
                          <TableRow key={entry._id}>
                            <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                              {new Date(entry.createdAt).toLocaleDateString(locale === "fr" ? "fr-CA" : "en-US")}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={entry.notes || entry.reference}>
                              {entry.notes || entry.reference || "—"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={entry.entryKind === "debit" ? "secondary" : "default"} className="text-[10px] uppercase">
                                {entry.entryKind === "debit" ? t("kindDebit") : t("kindCredit")}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-mono font-medium ${entry.entryKind === "debit" ? "text-red-500" : "text-green-600"}`}>
                              {entry.entryKind === "debit" ? "-" : "+"}
                              {(entry.entryKind === "debit" ? entry.payoutAmountCad : entry.netToProfessionalCad).toFixed(2)} $
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
