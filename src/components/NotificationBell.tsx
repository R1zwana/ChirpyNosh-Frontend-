import { useState } from "react";
import { markNotificationRead } from "../lib/store";
import { useStore } from "../lib/useStore";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function NotificationBell() {
  const s = useStore();
  const [open, setOpen] = useState(false);

  const unread = s.notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <span className="text-lg">🔔</span>

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 font-extrabold text-slate-900 border-b border-slate-100">
            Notifications
          </div>

          <div className="max-h-80 overflow-auto">
            {s.notifications.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No notifications yet.</div>
            ) : (
              s.notifications.map((n) => (
                <button
                  key={n.id}
                  className={`w-full text-left p-3 border-b border-slate-100 hover:bg-slate-50 transition ${
                    n.read ? "bg-white" : "bg-emerald-50"
                  }`}
                  onClick={() => markNotificationRead(n.id)}
                >
                  <div className="text-sm font-bold text-slate-900">{n.title}</div>
                  <div className="text-sm text-slate-600 mt-0.5">{n.message}</div>
                  <div className="text-xs text-slate-400 mt-1">{formatTime(n.createdAt)}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
