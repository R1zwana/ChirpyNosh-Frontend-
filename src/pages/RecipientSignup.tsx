import { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { Input, Select } from "../components/Input";
import { addRecipient } from "../lib/store";

export default function RecipientSignup() {
  const [orgName, setOrgName] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState(30);
  const [verified, setVerified] = useState(true); // MVP demo

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Recipient Signup</h2>
        <p className="text-sm text-slate-600 mt-1">
          Shelters/food banks can claim FREE surplus once verified.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <div className="text-xs font-semibold text-slate-600 mb-1">Organization name</div>
          <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g., Hope Shelter" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Capacity</div>
            <Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
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
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., Old Town" />
        </div>

        <Button
          className="w-full"
          onClick={() => {
            if (!orgName.trim() || !address.trim()) return;
            addRecipient({ orgName: orgName.trim(), address: address.trim(), capacity, verified });
            window.location.href = "/listings";
          }}
        >
          Register Recipient
        </Button>

        <NavLink to="/">
          <Button variant="outline" className="w-full">Back</Button>
        </NavLink>
      </Card>
    </div>
  );
}
