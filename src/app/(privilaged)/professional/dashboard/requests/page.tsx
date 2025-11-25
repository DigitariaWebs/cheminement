"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye } from "lucide-react";
import AppointmentDetailsModal from "@/components/dashboard/PatientProfileModal";
import { appointmentsAPI } from "@/lib/api-client";
import { AppointmentResponse } from "@/types/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await appointmentsAPI.list({ status: "pending" });
      setRequests(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    return requests.filter((appointment) => {
      const clientName = `${appointment.clientId.firstName} ${appointment.clientId.lastName}`;
      const matchesSearch =
        clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.clientId.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (appointment.issueType
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false);

      return matchesSearch;
    });
  }, [requests, searchQuery]);

  const getTypeBadge = (type: AppointmentResponse["type"]) => {
    const styles = {
      video: "bg-blue-100 text-blue-700",
      "in-person": "bg-green-100 text-green-700",
      phone: "bg-purple-100 text-purple-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-light ${styles[type]}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const handleViewAppointment = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${timeString}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          Pending Requests
        </h1>
        <p className="text-muted-foreground font-light mt-1">
          Review and manage pending appointment requests
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : (
        <></>
      )}

      {/* Search */}
      <div className="rounded-xl bg-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name, email, or issue type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-light"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-light">Client</TableHead>
                <TableHead className="font-light">Type</TableHead>
                <TableHead className="font-light">Issue</TableHead>
                <TableHead className="font-light">Date & Time</TableHead>
                <TableHead className="font-light">Duration</TableHead>
                <TableHead className="font-light text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground font-light"
                  >
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground font-light"
                  >
                    No pending requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow
                    key={appointment._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif">
                          {appointment.clientId.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-light text-foreground">
                            {appointment.clientId.firstName}{" "}
                            {appointment.clientId.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground font-light">
                            {appointment.clientId.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(appointment.type)}</TableCell>
                    <TableCell className="font-light">
                      {appointment.issueType || "N/A"}
                    </TableCell>
                    <TableCell className="font-light">
                      <div className="text-sm">
                        {formatDateTime(appointment.date, appointment.time)}
                      </div>
                    </TableCell>
                    <TableCell className="font-light">
                      {appointment.duration} min
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewAppointment(appointment)}
                          className="p-2 rounded-full hover:bg-muted transition-colors group"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        appointment={selectedAppointment}
        onAction={fetchAppointments}
      />
    </div>
  );
}
