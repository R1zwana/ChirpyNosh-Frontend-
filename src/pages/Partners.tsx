import Card from "../components/Card";
import Badge from "../components/Badge";
import { useStore } from "../lib/useStore";

export default function Partners() {
  const s = useStore();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
        Partner Organizations
      </h1>

      {s.partners.length === 0 && (
        <div className="text-slate-500">No partners registered yet.</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {s.partners.map((p) => {
          const listingsCount = s.listings.filter(
            (l) => l.partnerId === p.id
          ).length;

          return (
            <Card key={p.id} className="p-5 rounded-2xl">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-extrabold text-slate-900">
                    {p.name}
                  </div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {p.address}
                  </div>
                </div>

                {p.verified && (
                  <Badge variant="success" className="shrink-0">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Badge>{p.type}</Badge>
                <Badge variant="outline">
                  {listingsCount} listings
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
