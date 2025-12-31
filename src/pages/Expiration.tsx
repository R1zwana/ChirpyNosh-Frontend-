import { useMemo, useState } from "react";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import { Input, Textarea } from "../components/Input";
import { addExpirationItem, deleteExpirationItem, getStore } from "../lib/store";

function daysUntil(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diff = d.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function Expiration() {
  const s = getStore();
  const [item, setItem] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [notes, setNotes] = useState("");

  const sorted = useMemo(() => {
    return [...s.expirations].sort((a, b) => a.expiresOn.localeCompare(b.expiresOn));
  }, [s.expirations]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Expiration Tracker</h2>
        <p className="text-sm text-slate-600 mt-1">
          Track items and prioritize rescue before they expire (MVP manual entry; scan/OCR later).
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Item</div>
            <Input value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g., Yogurt cups (24)" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Expires on</div>
            <Input type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">Notes (optional)</div>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Storage notes, pickup suggestion, etc." />
        </div>

        <Button
          className="w-full"
          onClick={() => {
            if (!item.trim() || !expiresOn) return;
            addExpirationItem({ item: item.trim(), expiresOn, notes: notes.trim() || undefined });
            window.location.reload();
          }}
        >
          Add to Tracker
        </Button>
      </Card>

      <Card className="p-6">
        <div className="font-bold text-slate-900">Expiring soon</div>
        <div className="text-sm text-slate-600 mt-1">Sort by date and flag urgent items.</div>

        <div className="mt-4 space-y-3">
          {sorted.length === 0 ? (
            <div className="text-sm text-slate-600">No items yet.</div>
          ) : (
            sorted.map((x) => {
              const d = daysUntil(x.expiresOn);
              const tone = d <= 1 ? "red" : d <= 3 ? "amber" : "green";
              return (
                <div key={x.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{x.item}</div>
                    <div className="text-xs text-slate-500">
                      Expires: <span className="font-semibold">{x.expiresOn}</span> • {d >= 0 ? `${d} day(s) left` : "expired"}
                    </div>
                    {x.notes && <div className="text-sm text-slate-600 mt-1">{x.notes}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={tone as any}>{d <= 1 ? "Urgent" : d <= 3 ? "Soon" : "OK"}</Badge>
                    <Button
                      variant="danger"
                      onClick={() => {
                        deleteExpirationItem(x.id);
                        window.location.reload();
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
