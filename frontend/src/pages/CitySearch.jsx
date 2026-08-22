import { useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import { Search, MapPin, Globe2, Loader2, TrendingUp } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CitySearch() {
  const [q,        setQ]        = useState("");
  const [cities,   setCities]   = useState([]);
  const [popular,  setPopular]  = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [loadPop,  setLoadPop]  = useState(true);

  // Load popular cities on mount
  useEffect(() => {
    api.get("/public/cities/popular")
      .then(({ data }) => setPopular(data))
      .catch(() => {})
      .finally(() => setLoadPop(false));
  }, []);

  // Debounced search
  useEffect(() => {
    if (q.length < 2) { setCities([]); return; }
    setLoading(true);
    const t = setTimeout(() => {
      api.get(`/public/cities?q=${encodeURIComponent(q)}&limit=20`)
        .then(({ data }) => setCities(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  const displayCities = q.length >= 2 ? cities : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">City Search</h1>
        <p className="page-subtitle">Discover destinations around the world</p>
      </div>

      {/* Search bar */}
      <div className="card p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-100"/>
          {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100 animate-spin"/>}
          <input type="text" id="city-search-input"
            placeholder="Search for a city — Paris, Goa, Tokyo, Bali…"
            className="input pl-12 py-4 text-base"
            value={q} onChange={e => setQ(e.target.value)}/>
        </div>
      </div>

      {/* Popular cities grid — show when not searching */}
      {q.length < 2 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#2E7D6B]"/>
            <h2 className="section-title mb-0">Popular Destinations</h2>
          </div>
          {loadPop ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-32 rounded-2xl"/>)}
            </div>
          ) : popular.length === 0 ? (
            <div className="card p-10 text-center">
              <Globe2 className="w-10 h-10 text-[#D1D5DB] mx-auto mb-2"/>
              <p className="text-[#6B7280]">No cities in database yet.</p>
              <p className="text-[#9CA3AF] text-sm">Admin can add cities from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popular.map(city => (
                <button key={city.id} onClick={() => setSelected(city)}
                  className={`relative rounded-2xl overflow-hidden h-36 group text-left transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${selected?.id===city.id?"ring-2 ring-[#2E7D6B]":""}`}>
                  {city.imageUrl
                    ? <img src={city.imageUrl} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                    : <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D6B] to-[#3D9B85]"/>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"/>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-sm font-display">{city.name}</p>
                    <p className="text-white/70 text-xs">{city.country}</p>
                    {city.activityCount > 0 && (
                      <p className="text-white/60 text-[10px] mt-0.5">{city.activityCount} activities</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search results + map */}
      {q.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {loading && [1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-2xl"/>)}
            {!loading && displayCities.length === 0 && (
              <div className="card p-10 text-center">
                <Globe2 className="w-10 h-10 text-ink-900/20 mx-auto mb-2"/>
                <p className="text-ink-300">No cities found for "{q}"</p>
                <p className="text-ink-900/25 text-sm mt-1">Try a different spelling or broader term</p>
              </div>
            )}
            {displayCities.map(city => (
              <button key={city.id} onClick={() => setSelected(city)}
                className={`w-full text-left card p-4 transition-all duration-200 hover:border-teal-500/50 ${selected?.id===city.id?"border-teal-500/70 bg-teal-600/10":""}`}>
                <div className="flex items-center gap-3">
                  {city.imageUrl
                    ? <img src={city.imageUrl} alt={city.name} className="w-10 h-10 rounded-xl object-cover shrink-0"/>
                    : <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600/30 to-ocean-500/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-teal-600"/>
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-900">{city.name}</p>
                    <p className="text-sm text-ink-300">{city.country} · {city.countryCode}</p>
                  </div>
                  {city.timezone && <span className="badge badge-teal text-xs">{city.timezone}</span>}
                </div>
                {city.description && <p className="text-ink-300 text-sm mt-2 ml-13 line-clamp-2">{city.description}</p>}
              </button>
            ))}
          </div>

          <div className="h-[400px] card overflow-hidden sticky top-4">
            {selected ? (
              <MapContainer center={[Number(selected.latitude),Number(selected.longitude)]} zoom={10}
                style={{height:"100%",width:"100%"}} key={selected.id}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[Number(selected.latitude),Number(selected.longitude)]}>
                  <Popup><strong>{selected.name}</strong><br/>{selected.country}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-ink-100">
                <MapPin className="w-10 h-10 mb-2"/><p>Select a city to view on map</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map for popular city selection */}
      {q.length < 2 && selected && (
        <div className="h-[350px] card overflow-hidden">
          <MapContainer center={[Number(selected.latitude),Number(selected.longitude)]} zoom={10}
            style={{height:"100%",width:"100%"}} key={selected.id}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[Number(selected.latitude),Number(selected.longitude)]}>
              <Popup><strong>{selected.name}</strong><br/>{selected.country}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}