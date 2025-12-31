export default function Browse() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Available Food Listings</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold">Fresh Bakery Items</h3>
          <p className="text-sm text-gray-500">20 packs • Free</p>
        </div>
      </div>
    </div>
  );
}
