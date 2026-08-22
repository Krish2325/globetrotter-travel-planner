import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PlusCircle, Trash2, ArrowLeft, MapPin, Clock, Search, X, Loader2 } from 'lucide-react';

// Fix leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function ItineraryBuilder() {
  const { id: tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityQ, setCityQ] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingStop, setAddingStop] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/trips/${tripId}`),
      api.get(`/stops?tripId=${tripId}`),
    ]).then(([t, s]) => { setTrip(t.data); setStops(s.data); }).finally(() => setLoading(false));
  }, [tripId]);

  useEffect(() => {
    if (cityQ.length < 2) { setCities([]); return; }
    const t = setTimeout(() => api.get(`/cities?q=${cityQ}`).then(({ data }) => setCities(data)), 400);
    return () => clearTimeout(t);
  }, [cityQ]);

  useEffect(() => {
    if (selectedCity) api.get(`/activities?cityId=${selectedCity.id}`).then(({ data }) => setActivities(data));
  }, [selectedCity]);

  const addStop = async () => {
    if (!selectedCity) return;
    setAddingStop(true);
    const dayNumber = stops.length + 1;
    const { data } = await api.post('/stops', { tripId, cityId: selectedCity.id, dayNumber, order: stops.length });
    setStops([...stops, data]);
    setSelectedCity(null);
    setCityQ('');
    setCities([]);
    setAddingStop(false);
  };

  const removeStop = async (stopId) => {
    await api.delete(`/stops/${stopId}`);
    setStops(stops.filter(s => s.id !== stopId));
  };

  const addActivity = async (stop, activity) => {
    await api.post(`/stops/${stop.id}/activities/${activity.id}`, { order: stop.stopActivities?.length || 0 });
    const { data } = await api.get(`/stops?tripId=${tripId}`);
    setStops(data);
  };

  const removeActivity = async (stop, activityId) => {
    await api.delete(`/stops/${stop.id}/activities/${activityId}`);
    const { data } = await api.get(`/stops?tripId=${tripId}`);
    setStops(data);
  };

  // Map center
  const mapStops = stops.filter(s => s.city?.latitude && s.city?.longitude);
  const center = mapStops.length > 0
    ? [Number(mapStops[0].city.latitude), Number(mapStops[0].city.longitude)]
    : [20, 78];

  if (loading) return <div className="skeleton h-96" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to={`/trips/${tripId}`} className="btn-icon"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <h1 className="page-title">Itinerary Builder</h1>
          <p className="page-subtitle">{trip?.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: stops list */}
        <div className="space-y-4">
          {/* Add city */}
          <div className="card p-5 space-y-3">
            <h2 className="section-title mb-0">Add a City Stop</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
              <input
                type="text" placeholder="Search city (e.g. Paris, Goa, Tokyo)…"
                className="input pl-10" value={cityQ} onChange={e => setCityQ(e.target.value)}
              />
            </div>
            {cities.length > 0 && (
              <div className="card divide-y divide-cream-200 max-h-48 overflow-y-auto">
                {cities.map(city => (
                  <button key={city.id} onClick={() => { setSelectedCity(city); setCities([]); setCityQ(city.name + ', ' + city.country); }}
                    className="w-full text-left px-4 py-3 hover:bg-cream-100 transition-colors text-sm">
                    <span className="text-ink-900 font-medium">{city.name}</span>
                    <span className="text-ink-300 ml-2">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
            {selectedCity && (
              <div className="flex items-center gap-2">
                <div className="badge badge-teal flex-1">{selectedCity.name}, {selectedCity.country}</div>
                <button onClick={addStop} disabled={addingStop} className="btn-primary py-2">
                  {addingStop ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  Add Stop
                </button>
              </div>
            )}
          </div>

          {/* Stops */}
          {stops.length === 0 ? (
            <div className="card p-10 text-center">
              <MapPin className="w-10 h-10 text-ink-900/20 mx-auto mb-2" />
              <p className="text-ink-300">No stops yet. Search a city above to begin.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stops.map((stop, idx) => (
                <div key={stop.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-teal-700/30 border border-teal-500/50 flex items-center justify-center text-xs font-bold text-teal-500">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-ink-900">{stop.city?.name}</p>
                        <p className="text-xs text-ink-300">Day {stop.dayNumber} · {stop.city?.country}</p>
                      </div>
                    </div>
                    <button onClick={() => removeStop(stop.id)} className="btn-icon w-7 h-7 text-red-500 hover:bg-coral-500/10">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Activities on this stop */}
                  {stop.stopActivities?.length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      {stop.stopActivities.map(sa => (
                        <div key={sa.id} className="flex items-center justify-between bg-cream-100 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-ink-100" />
                            <span className="text-xs text-ink-500">{sa.activity?.name}</span>
                            <span className="badge badge-teal">{sa.activity?.category}</span>
                          </div>
                          <button onClick={() => removeActivity(stop, sa.activityId)} className="text-ink-900/20 hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add activities */}
                  {selectedCity?.id === stop.cityId && activities.length > 0 && (
                    <div className="border-t border-cream-300 pt-3">
                      <p className="text-xs text-ink-300 mb-2">Quick add activities:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {activities.slice(0, 8).map(act => (
                          <button key={act.id} onClick={() => addActivity(stop, act)}
                            className="text-xs px-2 py-1 rounded-lg bg-teal-700/20 text-teal-500 border border-teal-500/30 hover:bg-teal-700/40 transition-colors">
                            + {act.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {stop.city?.id !== selectedCity?.id && (
                    <button onClick={() => setSelectedCity(stop.city)} className="text-xs text-ink-100 hover:text-teal-600 transition-colors mt-1">
                      + Add activities to {stop.city?.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Map */}
        <div className="h-[500px] lg:h-auto card overflow-hidden sticky top-4">
          <MapContainer center={center} zoom={4} className="h-full w-full" style={{ minHeight: '400px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {mapStops.map((stop, idx) => (
              <Marker key={stop.id} position={[Number(stop.city.latitude), Number(stop.city.longitude)]}>
                <Popup>
                  <div className="text-sm">
                    <strong>Stop {idx + 1}: {stop.city.name}</strong>
                    <br />{stop.city.country}
                    {stop.stopActivities?.length > 0 && (
                      <><br />{stop.stopActivities.length} activity(-ies)</>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
