"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RefreshCw,
  AlertCircle,
  DollarSign,
  Clock,
  Percent,
} from "lucide-react";

interface PlatformSettings {
  _id: string;
  defaultPricing: {
    solo: number;
    couple: number;
    group: number;
  };
  platformFeePercentage: number;
  currency: string;
  cancellationPolicy: {
    clientCancellationHours: number;
    clientRefundPercentage: number;
    professionalCancellationHours: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          defaultPricing: settings.defaultPricing,
          platformFeePercentage: settings.platformFeePercentage,
          currency: settings.currency,
          cancellationPolicy: settings.cancellationPolicy,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (
    field: string,
    value: number | string,
    nested?: string,
  ) => {
    if (!settings) return;

    setSettings((prev) => {
      if (!prev) return prev;

      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...(prev[nested as keyof PlatformSettings] as Record<
              string,
              unknown
            >),
            [field]: value,
          },
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-light text-foreground">
            Platform Settings
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            Configure platform-wide settings and policies
          </p>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="animate-pulse space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-light text-foreground">
            Platform Settings
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            Configure platform-wide settings and policies
          </p>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-light text-foreground mb-2">
                Failed to load settings
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={fetchSettings}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-light text-foreground">
            Platform Settings
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            Configure platform-wide settings and policies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className={`h-4 w-4 ${saving ? "animate-pulse" : ""}`} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="flex items-center gap-2 text-green-800">
            <Settings className="h-5 w-5" />
            <p className="font-light">{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p className="font-light">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Default Pricing Section */}
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-serif font-light text-foreground">
              Default Pricing
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Solo Session ({settings.currency})
              </label>
              <input
                type="number"
                value={settings.defaultPricing.solo}
                onChange={(e) =>
                  updateSettings(
                    "solo",
                    parseFloat(e.target.value),
                    "defaultPricing",
                  )
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default price for individual sessions
              </p>
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Couple Session ({settings.currency})
              </label>
              <input
                type="number"
                value={settings.defaultPricing.couple}
                onChange={(e) =>
                  updateSettings(
                    "couple",
                    parseFloat(e.target.value),
                    "defaultPricing",
                  )
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default price for couple sessions
              </p>
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Group Session ({settings.currency})
              </label>
              <input
                type="number"
                value={settings.defaultPricing.group}
                onChange={(e) =>
                  updateSettings(
                    "group",
                    parseFloat(e.target.value),
                    "defaultPricing",
                  )
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default price per person in group sessions
              </p>
            </div>
          </div>
        </div>

        {/* Platform Fee Section */}
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center gap-2 mb-6">
            <Percent className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-serif font-light text-foreground">
              Platform Fee
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Platform Fee Percentage (%)
              </label>
              <input
                type="number"
                value={settings.platformFeePercentage}
                onChange={(e) =>
                  updateSettings(
                    "platformFeePercentage",
                    parseFloat(e.target.value),
                  )
                }
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Percentage of session fee taken by platform (0-100%)
              </p>
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Currency
              </label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => updateSettings("currency", e.target.value)}
                maxLength={3}
                className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Currency code (e.g., CAD, USD, EUR)
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation Policy Section */}
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-serif font-light text-foreground">
              Cancellation Policy
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Client Cancellation Hours
              </label>
              <input
                type="number"
                value={settings.cancellationPolicy.clientCancellationHours}
                onChange={(e) =>
                  updateSettings(
                    "clientCancellationHours",
                    parseInt(e.target.value),
                    "cancellationPolicy",
                  )
                }
                min="0"
                step="1"
                className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Hours before session client can cancel
              </p>
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Client Refund Percentage (%)
              </label>
              <input
                type="number"
                value={settings.cancellationPolicy.clientRefundPercentage}
                onChange={(e) =>
                  updateSettings(
                    "clientRefundPercentage",
                    parseInt(e.target.value),
                    "cancellationPolicy",
                  )
                }
                min="0"
                max="100"
                step="1"
                className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Refund percentage for client cancellations
              </p>
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Professional Cancellation Hours
              </label>
              <input
                type="number"
                value={
                  settings.cancellationPolicy.professionalCancellationHours
                }
                onChange={(e) =>
                  updateSettings(
                    "professionalCancellationHours",
                    parseInt(e.target.value),
                    "cancellationPolicy",
                  )
                }
                min="0"
                step="1"
                className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Hours before session professional must cancel
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <h2 className="text-xl font-serif font-light text-foreground mb-4">
            Metadata
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="ml-2 text-foreground">
                {new Date(settings.updatedAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2 text-foreground">
                {new Date(settings.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
