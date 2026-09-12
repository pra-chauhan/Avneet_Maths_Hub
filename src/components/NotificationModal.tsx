import React from 'react';
import { useData } from '../context/DataContext';
import { X, CheckCheck, Bell, Clock, Calendar, BookOpen, AlertTriangle, User } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, currentUser } = useData();

  if (!isOpen) return null;

  // Filter notifications relevant to current role
  const userNotifications = notifications.filter(n => {
    if (!n.targetRole || n.targetRole === 'all') return true;
    return n.targetRole === currentUser.role || (n.userId && n.userId === currentUser.id);
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'timetable':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'homework':
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'attendance':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Notification Center</h3>
              <p className="text-xs text-slate-500">
                Viewing alerts for {currentUser.name} ({currentUser.role})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="mark-all-read-btn"
              onClick={markAllNotificationsAsRead}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              id="close-notifications-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
          {userNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No new notifications</p>
              <p className="text-xs text-slate-400 mt-1">You are completely up to date!</p>
            </div>
          ) : (
            userNotifications.map(n => (
              <div
                key={n.id}
                id={`notif-item-${n.id}`}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.linkTab && onNavigateTab) {
                    onNavigateTab(n.linkTab);
                    onClose();
                  }
                }}
                className={`pt-3 first:pt-0 p-3 rounded-xl transition-colors cursor-pointer ${
                  n.isRead ? 'bg-white opacity-80' : 'bg-blue-50/70 border border-blue-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-xs shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Real-time offline coaching announcements, timetable shifts & homework alerts.
          </p>
        </div>
      </div>
    </div>
  );
};
