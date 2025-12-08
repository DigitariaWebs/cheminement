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
import {
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  Filter,
  UserCheck,
  Calendar,
  Clock,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import AppointmentDetailsModal from "@/components/dashboard/PatientProfileModal";
import { appointmentsAPI, apiClient } from "@/lib/api-client";
import { AppointmentResponse } from "@/types/api";

interface PreviousSessionInfo {
  [clientId: string]: {
    hasPreviousSession: boolean;
    sessionCount: number;
  };
}

interface AvailableSlot {
  time: string;
  available: boolean;
}

interface AvailabilityData {
  date: string;
  available: boolean;
  slots: AvailableSlot[];
  workingHours: {
    start: string;
    end: string;
  };
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Filters
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>("all");
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>("all");
  const [appointmentTypeFilter, setAppointmentTypeFilter] =
    useState<string>("all");

  // Previous sessions tracking
  const [previousSessions, setPreviousSessions] = useState<PreviousSessionInfo>(
    {},
  );
  const [showPreviousClientsOnly, setShowPreviousClientsOnly] = useState(false);

  // Scheduling modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schedulingAppointment, setSchedulingAppointment] =
    useState<AppointmentResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch unassigned pending appointments
      const data = await apiClient.get<AppointmentResponse[]>(
        "/appointments?status=pending&unassigned=true",
      );
      setRequests(data);

      // Check for previous sessions with each client
      const clientIds = [...new Set(data.map((apt) => apt.clientId._id))];
      const sessionInfo: PreviousSessionInfo = {};

      for (const clientId of clientIds) {
        try {
          const clientAppointments = await apiClient.get<AppointmentResponse[]>(
            `/appointments?clientId=${clientId}&status=completed`,
          );
          sessionInfo[clientId] = {
            hasPreviousSession: clientAppointments.length > 0,
            sessionCount: clientAppointments.length,
          };
        } catch {
          sessionInfo[clientId] = {
            hasPreviousSession: false,
            sessionCount: 0,
          };
        }
      }
      setPreviousSessions(sessionInfo);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load appointment requests",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Get unique issue types for filter
  const issueTypes = useMemo(() => {
    const types = new Set<string>();
    requests.forEach((apt) => {
      if (apt.issueType) types.add(apt.issueType);
    });
    return Array.from(types);
  }, [requests]);

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

      const matchesIssueType =
        issueTypeFilter === "all" || appointment.issueType === issueTypeFilter;

      const matchesSessionType =
        sessionTypeFilter === "all" ||
        appointment.therapyType === sessionTypeFilter;

      const matchesAppointmentType =
        appointmentTypeFilter === "all" ||
        appointment.type === appointmentTypeFilter;

      const matchesPreviousClient =
        !showPreviousClientsOnly ||
        previousSessions[appointment.clientId._id]?.hasPreviousSession;

      return (
        matchesSearch &&
        matchesIssueType &&
        matchesSessionType &&
        matchesAppointmentType &&
        matchesPreviousClient
      );
    });
  }, [
    requests,
    searchQuery,
    issueTypeFilter,
    sessionTypeFilter,
    appointmentTypeFilter,
    showPreviousClientsOnly,
    previousSessions,
  ]);

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

  const getTherapyTypeBadge = (type: AppointmentResponse["therapyType"]) => {
    const styles = {
      solo: "bg-indigo-100 text-indigo-700",
      couple: "bg-pink-100 text-pink-700",
      group: "bg-orange-100 text-orange-700",
    };

    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-light ${styles[type]}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const handleViewAppointment = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleOpenScheduleModal = (appointment: AppointmentResponse) => {
    setSchedulingAppointment(appointment);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSchedulingAppointment(null);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
    return dates;
  };

  const loadAvailableSlots = async (date: string) => {
    try {
      setLoadingSlots(true);
      // This endpoint returns the professional's available slots
      const response = await apiClient.get<AvailabilityData>(
        `/appointments/available-slots?date=${date}`,
      );

      if (response.available && response.slots) {
        setAvailableSlots(response.slots);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (date) {
      loadAvailableSlots(date);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleAcceptAndSchedule = async () => {
    if (!schedulingAppointment || !selectedDate || !selectedTime) return;

    try {
      setScheduling(true);
      await appointmentsAPI.update(schedulingAppointment._id, {
        status: "scheduled",
        date: selectedDate,
        time: selectedTime,
      });
      handleCloseScheduleModal();
      fetchAppointments();
    } catch (err) {
      console.error("Error scheduling appointment:", err);
    } finally {
      setScheduling(false);
    }
  };

  const handleDeclineRequest = async (appointment: AppointmentResponse) => {
    try {
      await appointmentsAPI.update(appointment._id, {
        status: "cancelled",
        cancelReason: "Request declined by professional",
      });
      fetchAppointments();
    } catch (err) {
      console.error("Error declining request:", err);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setIssueTypeFilter("all");
    setSessionTypeFilter("all");
    setAppointmentTypeFilter("all");
    setShowPreviousClientsOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    issueTypeFilter !== "all" ||
    sessionTypeFilter !== "all" ||
    appointmentTypeFilter !== "all" ||
    showPreviousClientsOnly;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          Appointment Requests
        </h1>
        <p className="text-muted-foreground font-light mt-1">
          Review and accept pending appointment requests from clients
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-light"
              />
            </div>
          </div>

          {/* Issue Type Filter */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Issue Type
            </Label>
            <Select value={issueTypeFilter} onValueChange={setIssueTypeFilter}>
              <SelectTrigger className="font-light">
                <SelectValue placeholder="All issues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issues</SelectItem>
                {issueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Type Filter */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Session Type
            </Label>
            <Select
              value={sessionTypeFilter}
              onValueChange={setSessionTypeFilter}
            >
              <SelectTrigger className="font-light">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="solo">Individual</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointment Type Filter */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Format
            </Label>
            <Select
              value={appointmentTypeFilter}
              onValueChange={setAppointmentTypeFilter}
            >
              <SelectTrigger className="font-light">
                <SelectValue placeholder="All formats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Previous Clients Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant={showPreviousClientsOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreviousClientsOnly(!showPreviousClientsOnly)}
            className="gap-2"
          >
            <UserCheck className="h-4 w-4" />
            {showPreviousClientsOnly
              ? "Showing Previous Clients Only"
              : "Show Previous Clients Only"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-card p-4 border border-border/40">
          <p className="text-2xl font-serif">{requests.length}</p>
          <p className="text-xs text-muted-foreground">Total Requests</p>
        </div>
        <div className="rounded-xl bg-card p-4 border border-border/40">
          <p className="text-2xl font-serif">{filteredAppointments.length}</p>
          <p className="text-xs text-muted-foreground">Matching Filters</p>
        </div>
        <div className="rounded-xl bg-card p-4 border border-border/40">
          <p className="text-2xl font-serif">
            {
              Object.values(previousSessions).filter(
                (s) => s.hasPreviousSession,
              ).length
            }
          </p>
          <p className="text-xs text-muted-foreground">Previous Clients</p>
        </div>
        <div className="rounded-xl bg-card p-4 border border-border/40">
          <p className="text-2xl font-serif">
            {requests.filter((r) => r.type === "video").length}
          </p>
          <p className="text-xs text-muted-foreground">Video Requests</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-light">Client</TableHead>
                <TableHead className="font-light">Contact</TableHead>
                <TableHead className="font-light">Session</TableHead>
                <TableHead className="font-light">Issue</TableHead>
                <TableHead className="font-light">Availability</TableHead>
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
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground font-light"
                  >
                    {hasActiveFilters
                      ? "No requests match your filters."
                      : "No pending requests at this time."}
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
                          <div className="flex items-center gap-2">
                            <p className="font-light text-foreground">
                              {appointment.clientId.firstName}{" "}
                              {appointment.clientId.lastName}
                            </p>
                            {previousSessions[appointment.clientId._id]
                              ?.hasPreviousSession && (
                              <Badge
                                variant="secondary"
                                className="text-xs gap-1"
                              >
                                <UserCheck className="h-3 w-3" />
                                {
                                  previousSessions[appointment.clientId._id]
                                    .sessionCount
                                }{" "}
                                prev
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-light">
                            {appointment.clientId.location || "No location"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <a
                          href={`mailto:${appointment.clientId.email}`}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Mail className="h-3 w-3" />
                          {appointment.clientId.email}
                        </a>
                        {appointment.clientId.phone && (
                          <a
                            href={`tel:${appointment.clientId.phone}`}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Phone className="h-3 w-3" />
                            {appointment.clientId.phone}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getTypeBadge(appointment.type)}
                        {getTherapyTypeBadge(appointment.therapyType)}
                      </div>
                    </TableCell>
                    <TableCell className="font-light">
                      {appointment.issueType || "N/A"}
                    </TableCell>
                    <TableCell className="font-light">
                      <div className="text-xs text-muted-foreground">
                        {appointment.notes ? (
                          <span className="line-clamp-2">
                            {appointment.notes}
                          </span>
                        ) : (
                          "No preference specified"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewAppointment(appointment)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeclineRequest(appointment)}
                          title="Decline Request"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenScheduleModal(appointment)}
                          className="gap-1"
                        >
                          <Calendar className="h-4 w-4" />
                          Accept
                        </Button>
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

      {/* Schedule Modal */}
      {isScheduleModalOpen && schedulingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl m-4">
            {/* Header */}
            <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-light text-foreground">
                  Schedule Appointment
                </h2>
                <p className="text-sm text-muted-foreground">
                  for {schedulingAppointment.clientId.firstName}{" "}
                  {schedulingAppointment.clientId.lastName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseScheduleModal}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Client Info Summary */}
              <div className="rounded-lg bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Session:</span>
                  {getTypeBadge(schedulingAppointment.type)}
                  {getTherapyTypeBadge(schedulingAppointment.therapyType)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {schedulingAppointment.clientId.location || "No location"}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Issue:</strong>{" "}
                  {schedulingAppointment.issueType || "N/A"}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Select value={selectedDate} onValueChange={handleDateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a date" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDates().map((date) => (
                      <SelectItem key={date.value} value={date.value}>
                        {date.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="space-y-2">
                  <Label>Select Time</Label>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots
                        .filter((slot) => slot.available)
                        .map((slot) => (
                          <Button
                            key={slot.time}
                            variant={
                              selectedTime === slot.time ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border/40 bg-muted/30 p-6 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No available time slots for this date
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/40 px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseScheduleModal}>
                Cancel
              </Button>
              <Button
                onClick={handleAcceptAndSchedule}
                disabled={!selectedDate || !selectedTime || scheduling}
                className="gap-2"
              >
                {scheduling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm & Schedule
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
