import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NotificationForm } from "@/components/notifications/notification-form"
import { NotificationHistory } from "@/components/notifications/notification-history"

export default function NotificationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Notifications"
        description="Send notifications to your users and view notification history."
      />
      <div className="grid gap-4 md:gap-8">
        <NotificationForm />
        <NotificationHistory />
      </div>
    </DashboardShell>
  )
}

