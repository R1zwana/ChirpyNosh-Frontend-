import { useMemo, useState } from "react";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import { Input } from "../components/Input";

// MVP: simple rule-based suggestions (no API cost)
const RULES: Array<{ keys: string[]; name: string; why: string }> = [
  { keys: ["bread", "bun", "baguette"], name: "Bread pudding / French toast", why: "Great for stale bread; reduces bakery waste." },
  { keys: ["tomato", "onion", "carrot"], name: "Vegetable soup", why: "Flexible recipe; works with mixed produce." },
  { keys: ["yogurt", "milk"], name: "Smoothie + overnight oats", why: "Uses dairy near expiry safely." },
  { keys: ["rice", "chicken"], name: "Fried rice", why: "Perfect for leftovers; scalable." },
];

export default function Recipes() {
  const [ingredients, setIngredients] = useState("");

  const suggestions = useMemo(() => {
    const text = ingredients.toLowerCase();
    if (!text.trim()) return [];
    const hits = RULES.filter((r) => r.keys.some((k) => text.includes(k)));
    return hits.length ? hits : [{ keys: [], name: "Mixed bowl / stir-fry", why: "When in doubt: sauté vegetables + add protein + sauce." }];
  }, [ingredients]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Recipe Finder</h2>
        <p className="text-sm text-slate-600 mt-1">
          Turn rescued ingredients into meals (MVP: rule-based; later: nutrition + allergen-aware suggestions).
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="text-xs font-semibold text-slate-600">Ingredients you have</div>
        <Input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., bread, tomatoes, yogurt, carrots..."
        />

        <Button variant="outline" onClick={() => setIngredients("")}>
          Clear
        </Button>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {suggestions.map((sug) => (
          <Card key={sug.name} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="font-bold text-slate-900">{sug.name}</div>
              <Badge tone="green">Low waste</Badge>
            </div>
            <p className="text-sm text-slate-600 mt-2">{sug.why}</p>
            {sug.keys.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {sug.keys.map((k) => (
                  <Badge key={k}>{k}</Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
