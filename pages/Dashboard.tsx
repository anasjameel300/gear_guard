import React from 'react';
import { Activity, Wrench, CheckCircle, Clock, FileText, UserPlus, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { tickets, activities } = useData();

  // Calculate Stats
  const totalRequests = tickets.length;
  const inProgress = tickets.filter(t => t.status === 'in-progress').length;
  const criticalIssues = tickets.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  const completed = tickets.filter(t => t.status === 'completed').length;

  // Helper for activity icons
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket_created': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'ticket_status_change': return <Activity className="h-4 w-4 text-amber-500" />;
      case 'team_created': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'user_invited': return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'equipment_added': return <Wrench className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <span className="text-sm text-gray-500">Live Updates Enabled</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: totalRequests, icon: <Activity className="text-blue-600" />, color: 'bg-blue-50' },
          { label: 'In Progress', value: inProgress, icon: <Clock className="text-amber-600" />, color: 'bg-amber-50' },
          { label: 'Critical Issues', value: criticalIssues, icon: <Wrench className="text-red-600" />, color: 'bg-red-50' },
          { label: 'Completed (M)', value: completed, icon: <CheckCircle className="text-green-600" />, color: 'bg-green-50' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-brand-600" />
            Activity Feed
          </h3>
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">
            Real-time
          </span>
        </div>
        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No recent activity.</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                 <div className="mt-1 flex-shrink-0 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    {getActivityIcon(activity.type)}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                       {activity.message}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                      <span>{activity.user || 'System'}</span>
                      <span>&bull;</span>
                      <time dateTime={activity.timestamp}>
                        {new Date(activity.timestamp).toLocaleString(undefined, {
                           month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
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
};