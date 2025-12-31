import { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { Input, Select } from "../components/Input";
import { addPartner } from "../lib/store";
import type { PartnerType } from "../lib/types";

export default function PartnerSignup() {
  const [name, setName] = useState("");
  const [type, setType] = useState<PartnerType>("Restaurant");
  const [address, setAddress] = useState("");
  const [verified, setVerified] = useState(true); // MVP: allow toggling for demo

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Partner Signup</h2>
        <p className="text-sm text-slate-600 mt-1">Restaurants, supermarkets, and shops can list surplus food.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">Name</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Lidl Bremen Center" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Type</div>
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option>Restaurant</option>
              <option>Supermarket</option>
              <option>Bakery</option>
              <option>Hotel</option>
              <option>Shop</option>
            </Select>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Verified (MVP demo)</div>
            <Select value={String(verified)} onChange={(e) => setVerified(e.target.value === "true")}>
              <option value="true">Yes (Verified)</option>
              <option value="false">No</option>
            </Select>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">Address / Area</div>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., North Avenue" />
        </div>

        <Button
          className="w-full"
          onClick={() => {
            if (!name.trim() || !address.trim()) return;
            addPartner({ name: name.trim(), type, address: address.trim(), verified });
            window.location.href = "/listings";
          }}
        >
          Register Partner
        </Button>

        <NavLink to="/">
          <Button variant="outline" className="w-full">Back</Button>
        </NavLink>
      </Card>
    </div>
  );
}
