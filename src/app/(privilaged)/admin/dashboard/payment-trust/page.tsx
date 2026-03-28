"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle2, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PendingRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  requestedAt?: string;
}

export default function AdminPaymentTrustPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/payment-guarantee-requests");
      if (!res.ok) {
        throw new Error("Impossible de charger la file d’attente");
      }
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (userId: string) => {
    try {
      setApprovingId(userId);
      const res = await fetch(
        `/api/admin/payment-guarantee-requests/${userId}/approve`,
        { method: "POST" },
      );
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Échec de la validation");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          Garanties Interac / virement
        </h1>
        <p className="text-muted-foreground font-light mt-2">
          Validez manuellement les profils pour passer le client en Statut vert
          (entente de confiance). Le paiement doit être reçu dans les 24 h
          après chaque séance.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-light">
            Aucune demande en attente.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-light">Client</TableHead>
                <TableHead className="font-light">Contact</TableHead>
                <TableHead className="font-light text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {r.firstName} {r.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {r.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      disabled={approvingId === r.id}
                      onClick={() => approve(r.id)}
                      className="gap-1.5"
                    >
                      {approvingId === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Statut vert
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
