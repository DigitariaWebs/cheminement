export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          Welcome Back
        </h1>
        <p className="text-muted-foreground font-light mt-2">
          Here&apos;s an overview of your practice
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Total Clients
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                0
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                This Week&apos;s Sessions
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                0
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Pending Bookings
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                0
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Profile Status
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                Pending Review
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card p-6">
        <h2 className="text-xl font-serif font-light text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/dashboard/profile"
            className="rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <h3 className="font-light text-foreground mb-2">
              Complete Your Profile
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              Add your specializations, approaches, and availability to start
              matching with clients
            </p>
          </a>
          <a
            href="/dashboard/schedule"
            className="rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <h3 className="font-light text-foreground mb-2">
              Set Your Schedule
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              Define your available time slots for client bookings
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
