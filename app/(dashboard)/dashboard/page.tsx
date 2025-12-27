import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Activity, Wrench, CheckCircle, Clock, FileText, UserPlus, Shield, Package } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  // Fetch dashboard stats
  const [
    totalEquipment,
    totalTickets,
    inProgressTickets,
    criticalTickets,
    recentActivities,
  ] = await Promise.all([
    prisma.equipment.count(),
    prisma.maintenanceTicket.count(),
    prisma.maintenanceTicket.count({ where: { status: "IN_PROGRESS" } }),
    prisma.maintenanceTicket.count({
      where: { priority: "HIGH", status: { not: "REPAIRED" } },
    }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: { user: { select: { name: true } } },
    }),
  ]);

  // Helper for activity icons
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "TICKET_CREATED":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "TICKET_STATUS_CHANGE":
        return <Activity className="h-4 w-4 text-amber-500" />;
      case "TEAM_CREATED":
        return <Shield className="h-4 w-4 text-purple-500" />;
      case "USER_INVITED":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "EQUIPMENT_ADDED":
        return <Package className="h-4 w-4 text-gray-500" />;
      case "EQUIPMENT_UPDATED":
        return <Wrench className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const stats = [
    {
      label: "Total Equipment",
      value: totalEquipment,
      icon: <Package className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      label: "In Progress",
      value: inProgressTickets,
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      label: "Critical Issues",
      value: criticalTickets,
      icon: <Wrench className="h-6 w-6 text-red-600" />,
      color: "bg-red-50",
    },
    {
      label: "Total Tickets",
      value: totalTickets,
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {session?.user?.name || "User"}!
          </p>
        </div>
        <span className="text-sm text-gray-500">Live Updates Enabled</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Activity Feed
          </h3>
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">
            Real-time
          </span>
        </div>
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No recent activity.
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-gray-50 transition-colors flex items-start space-x-4"
              >
                <div className="mt-1 flex-shrink-0 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                    <span>{activity.user?.name || "System"}</span>
                    <span>&bull;</span>
                    <time dateTime={activity.timestamp.toISOString()}>
                      {activity.timestamp.toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


