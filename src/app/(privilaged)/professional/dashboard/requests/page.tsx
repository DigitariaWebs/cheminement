"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AppointmentDetailsModal, {
  AppointmentData,
} from "@/components/dashboard/PatientProfileModal";
import { appointmentsAPI } from "@/lib/api-client";

export default function RequestsPage() {
  const [requests, setRequests] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientTypeFilter, setClientTypeFilter] = useState<string>("all");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentsAPI.list();
        setRequests(data as AppointmentData[]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load appointments",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

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

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      const matchesType =
        clientTypeFilter === "all" || appointment.type === clientTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requests, searchQuery, statusFilter, clientTypeFilter]);

  const getTypeBadge = (type: AppointmentData["type"]) => {
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

  const getStatusBadge = (status: AppointmentData["status"]) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-gray-100 text-gray-700",
      "no-show": "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-light ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewAppointment = (appointment: AppointmentData) => {
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

  const stats = {
    total: requests.length,
    scheduled: requests.filter((r) => r.status === "scheduled").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          My Appointments
        </h1>
        <p className="text-muted-foreground font-light mt-1">
          Manage your scheduled appointments
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-card p-6 border border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">
                    Total Appointments
                  </p>
                  <p className="text-3xl font-serif font-light text-foreground mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 border border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">
                    Scheduled
                  </p>
                  <p className="text-3xl font-serif font-light text-foreground mt-1">
                    {stats.scheduled}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 border border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-3xl font-serif font-light text-foreground mt-1">
                    {stats.completed}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 border border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-light text-muted-foreground">
                    Cancelled
                  </p>
                  <p className="text-3xl font-serif font-light text-foreground mt-1">
                    {stats.cancelled}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search and Filters */}
      <div className="rounded-xl bg-card p-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client name, email, or issue type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-light"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
          >
            <Filter className="h-4 w-4" />
            {isFilterExpanded ? "Hide Filters" : "Show Filters"}
            {isFilterExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Filters */}
          {isFilterExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/40">
              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  Type
                </label>
                <Select
                  value={clientTypeFilter}
                  onValueChange={setClientTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
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
                <TableHead className="font-light">Status</TableHead>
                <TableHead className="font-light text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground font-light"
                  >
                    Loading appointments...
                  </TableCell>
                </TableRow>
              ) : filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground font-light"
                  >
                    No appointments found. Try adjusting your filters.
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
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
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
      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
