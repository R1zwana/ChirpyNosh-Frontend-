import { NavLink } from "react-router-dom";
import Button from "./Button";
import logo from "../assets/logo.png";
import   NotificationBell from "./NotificationBell";




const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/listings", label: "Donation Hub" },
  { to: "/partners", label: "Partners" }, // ✅ new
  { to: "/expiration", label: "Expiration" },
  { to: "/recipes", label: "Recipes" },
];


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            {/* Brand */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                <img
                  src={logo}
                  alt="ChirpyNosh logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="leading-tight">
                <div className="font-extrabold text-lg bg-gradient-to-r from-[#ff914d] via-[#ffde59] to-[#0cc0df] bg-clip-text text-transparent tracking-tight">
                  ChirpyNosh
                </div>

                <div className="text-xs -mt-1" style={{ color: "#48392e" }}>
                  Food rescue network
                </div>
              </div>
            </NavLink>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-3">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    [
                      "text-sm font-semibold transition",
                      "px-4 py-2 rounded-full",
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                    ].join(" ")
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Optional bell */}
              {/* <div className="hidden sm:block">
                <NotificationBell />
              </div> */}
                <NotificationBell />

              <NavLink to="/add-listing">
                <Button variant="outline" className="rounded-full px-5">
                  + Add Listing
                </Button>
              </NavLink>

              <NavLink to="/partner-signup">
                <Button className="rounded-full px-5">Partner</Button>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>© {new Date().getFullYear()} ChirpyNosh</span>
          </div>

          <div className="text-slate-500">
            SDG 2 & SDG 12 • Reduce waste • Feed communities
          </div>
        </div>
      </footer>
    </div>
  );
}
