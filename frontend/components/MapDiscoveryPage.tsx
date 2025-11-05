import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Store, X } from 'lucide-react';
import { Business } from '../types/business';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useBusinessStore } from '../store/businessStore';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 1.3521, lng: 103.8198 }; // Singapore fallback

export function MapDiscoveryPage() {
  const navigate = useNavigate();
  const mapRef = useRef<google.maps.Map | null>(null);
  const businesses = useBusinessStore((state) => state.businesses);
  const setSelectedBusiness = useBusinessStore((state) => state.setSelectedBusiness);
  const logout = useAuthStore((state) => state.logout);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const safeBusinesses: Business[] = Array.isArray(businesses) ? businesses : [];

  const pageBg = isDarkMode ? '#3a3a3a' : '#f9fafb';
  const panelBg = isDarkMode ? '#2a2a2a' : '#ffffff';
  const railBg = isDarkMode ? '#3a3a3a' : '#f9fafb';
  const borderTone = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textMain = isDarkMode ? 'text-white' : 'text-black';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputText = isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-black placeholder:text-gray-500';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPin, setSelectedPin] = useState<Business | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [businessesWithCoords, setBusinessesWithCoords] = useState<(Business & { lat?: number; lng?: number })[]>([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBEJP1GmEezTaIfMFZ-eT36PkiF3s9UgQg',
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('Geolocation failed:', err)
      );
    }
  }, []);

  // Detect screen size for responsive padding
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Geocode businesses' addresses
  useEffect(() => {
    if (!isLoaded || !safeBusinesses.length) return;
    const geocoder = new (window as any).google.maps.Geocoder();

    const geocodeAll = async () => {
      const results: (Business & { lat?: number; lng?: number })[] = [];

      await Promise.all(
        safeBusinesses.map(async (b) => {
          const address = (b as any).address || '';
          if (!address) return results.push(b as any);

          const res: any = await new Promise((resolve) => {
            geocoder.geocode({ address }, (geoResults: any, status: any) => {
              if (status === 'OK' && geoResults[0]) {
                const loc = geoResults[0].geometry.location;
                resolve({ lat: loc.lat(), lng: loc.lng() });
              } else {
                resolve(null);
              }
            });
          });

          if (res) results.push({ ...(b as any), lat: res.lat, lng: res.lng });
          else results.push(b as any);
        })
      );

      setBusinessesWithCoords(results);
    };

    geocodeAll();
  }, [isLoaded, safeBusinesses]);

  const filtered = (searchTerm
    ? businessesWithCoords.filter((b) => {
        const q = searchTerm.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          (b.category ?? '').toLowerCase().includes(q) ||
          (b.address ?? '').toLowerCase().includes(q) ||
          (b.description ?? '').toLowerCase().includes(q)
        );
      })
    : businessesWithCoords
  ).slice(0, 50);

  // ✅ Compute nearest 5 businesses robustly
  const nearestUENs = new Set<string>();
  if (userLocation && businessesWithCoords.length > 0) {
    const withCoords = businessesWithCoords.filter((b) => b.lat !== undefined && b.lng !== undefined);
    const distances = withCoords.map((b) => ({
      uen: (b as any).uen ?? b.uen ?? b.name,
      distance: haversineDistance(userLocation.lat, userLocation.lng, b.lat!, b.lng!),
    }));
    distances.sort((a, b) => a.distance - b.distance);
    distances.slice(0, 5).forEach((b) => nearestUENs.add(b.uen));
  }

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    navigate(`/business/${business.uen}`);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/');
    }
  };
  const handleShowOnMap = (b: Business & { lat?: number; lng?: number }) => {
    setSelectedPin(b);
    if (b.lat && b.lng && mapRef.current) {
      mapRef.current.panTo({ lat: b.lat, lng: b.lng });
      mapRef.current.setZoom(17);
    }
  };

  if (loadError) return <div className="text-red-500">Map cannot load</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-screen w-full flex flex-col" style={{ backgroundColor: pageBg }}>
      {/* MAP SECTION */}
      <div className="relative flex-1 overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={userLocation ? 16 : 14}
          center={userLocation ?? defaultCenter}
          onLoad={(map) => (mapRef.current = map)}
        >
          {/* LEGEND CARD INSIDE MAP */}
          <div
            key={isDarkMode ? 'dark' : 'light'} // forces re-render on theme change
            className={`absolute z-10 p-3 rounded-lg shadow-lg`}
            style={{ backgroundColor: panelBg, top: '55px', left: '10px' }}
          >
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <img
                  src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  alt="User Location"
                  className="w-4 h-4"
                />
                <span className={textMain}>Your location</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  alt="Nearest Business"
                  className="w-4 h-4"
                />
                <span className={textMain}>Nearest businesses</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="http://maps.google.com/mapfiles/ms/icons/pink-dot.png"
                  alt="Selected Business"
                  className="w-4 h-4"
                />
                <span className={textMain}>Selected business</span>
              </div>
            </div>
          </div>

          {/* Center on User Button */}
          {userLocation && (
            <div
              style={{
                position: 'absolute',
                top: '55px', // below the fullscreen icon
                right: '10px',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => {
                  if (mapRef.current && userLocation) {
                    mapRef.current.panTo(userLocation);
                    mapRef.current.setZoom(16);
                  }
                }}
                className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
                title="Go to my location"
              >
                <img
                  src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  alt="My Location"
                  className="w-6 h-6"
                />
              </button>
            </div>
          )}

          {/* User marker (green) */}
          {userLocation && (
            <>
              <Marker
                position={userLocation}
                icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                onClick={() => setShowUserInfo(true)}
              />
              {showUserInfo && (
                <InfoWindow position={userLocation} onCloseClick={() => setShowUserInfo(false)}>
                  {/* <div className="text-sm font-medium text-gray-800">You are here</div> */}
                </InfoWindow>
              )}
            </>
          )}

          {/* Business pins */}
          {businessesWithCoords.map((b) => {
            if (b.lat === undefined || b.lng === undefined) return null;

            const uen = (b as any).uen ?? b.uen ?? b.name;
            const isSelected = selectedPin && ((selectedPin.uen ?? selectedPin.name) === uen);
            const isNearest = nearestUENs.has(uen);

            const baseColor = isNearest
              ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            const iconUrl = isSelected ? 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png' : baseColor;

            return (
              <Marker
                key={String(uen)}
                position={{ lat: b.lat, lng: b.lng }}
                onClick={() => setSelectedPin(b)}
                icon={{ url: iconUrl }}
              />
            );
          })}
        </GoogleMap>

        {/* Selected-pin mini card */}
        {selectedPin && (
          <div className="absolute bottom-6 left-6 z-10 max-w-sm">
            <Card className={`p-4 ${borderTone}`} style={{ backgroundColor: panelBg }}>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-lg font-semibold ${textMain}`}>{selectedPin.name}</h3>
                    <Button
                      size="icon"
                      variant="outline"
                      className={`${borderTone} ${
                        isDarkMode ? 'text-white hover:bg-neutral-800' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedPin(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className={`mt-1 text-sm ${textMuted}`}>
                    {selectedPin.category}
                    {selectedPin.priceRange ? ` · ${selectedPin.priceRange}` : ''}
                  </div>
                  {selectedPin.address && (
                    <div className={`mt-1 text-xs ${textMuted}`}>{selectedPin.address}</div>
                  )}

                  {userLocation && selectedPin.lat && selectedPin.lng && (
                    <div className={`mt-1 text-xs ${textMuted}`}>
                      {haversineDistance(
                        userLocation.lat,
                        userLocation.lng,
                        selectedPin.lat,
                        selectedPin.lng
                      ).toFixed(2)} km away
                    </div>
                  )}

                  <div className="mt-3">
                    <Button
                      onClick={() => handleBusinessClick(selectedPin)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* LOWER PANEL */}
      <div
        className={`shrink-0 border-t ${borderTone}`}
        style={{ backgroundColor: railBg, height: '52vh' }}
      >
        <div className="max-w-none mx-auto h-full flex flex-col gap-3 px-4 pt-4 pb-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search businesses…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 h-10 border-none rounded-full text-sm ${inputText}`}
                style={{ backgroundColor: panelBg }}
              />
            </div>
            <div className={`mt-2 text-xs ${textMuted}`}>
              {searchTerm.trim()
                ? `Found ${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
                : `${safeBusinesses.length} businesses nearby`}
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((b, index) => (
                <Card key={b.uen || `business-${index}`} className={`p-4 hover:shadow ${borderTone}`} style={{ backgroundColor: panelBg }}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Store className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={`text-base font-semibold ${textMain}`}>{b.name}</h3>
                        {b.category && <Badge variant="secondary">{b.category}</Badge>}
                      </div>
                      <div className={`mt-1 text-sm ${textMuted}`}>
                        {(b.priceRange ? `${b.priceRange} · ` : '') + (b.address ?? '')}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          onClick={() => handleBusinessClick(b)}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          View details
                        </Button>
                        <Button
                          onClick={() => handleShowOnMap(b)}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Show on map
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className={`text-sm py-8 text-center ${textMuted}`}>No results.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: compute distance
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
