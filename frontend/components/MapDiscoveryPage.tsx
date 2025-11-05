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
  const borderTone = isDarkMode ? 'border-gray-600' : 'border-gray-300';
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

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoaded || !safeBusinesses.length) return;
    const geocoder = new (window as any).google.maps.Geocoder();

    const geocodeAll = async () => {
      const results: (Business & { lat?: number; lng?: number })[] = [];

      await Promise.all(
        safeBusinesses.map(async (b) => {
          let lat = (b as any).latitude;
          let lng = (b as any).longitude;

          if (lat !== undefined && lng !== undefined && lat !== null && lng !== null) {
            console.log(`[DB] ${b.businessName} lat/lng:`, lat, lng);
          } else {
            const address = (b as any).address || '';
            if (!address) {
              console.log(`[NO ADDRESS] ${b.businessName}, skipping geocode.`);
              results.push(b as any);
              return;
            }

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

            if (res) {
              lat = res.lat;
              lng = res.lng;
              console.log(`[GEOCODED] ${b.businessName} lat/lng:`, lat, lng);
            } else {
              console.log(`[GEOCODE FAILED] ${b.businessName}`);
            }
          }

          results.push({ ...(b as any), lat, lng });
        })
      );

      setBusinessesWithCoords(results);
    };

    geocodeAll();
  }, [isLoaded, safeBusinesses]);

  const filteredBusinesses = (searchTerm
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

  const nearestUENs = new Set<string>();
  if (userLocation && businessesWithCoords.length > 0 && !searchTerm) {
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

  useEffect(() => {
    setSelectedPin(null);
  }, [searchTerm]);

  if (loadError) return <div className="text-red-500">Map cannot load</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-screen w-full flex flex-col" style={{ backgroundColor: pageBg }}>
      {/* MAP SECTION WITH VISIBLE BORDER AND PADDING */}
      <div
        className={`relative flex-1 m-4 mb-2 rounded-2xl border-4 ${borderTone}`}
        style={{
          padding: '8px',
          backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff', // theme-aware background
          borderColor: isDarkMode ? '#4b5563' : '#d1d5db', // dark/light border
        }}
      >
        {/* Inner map wrapper */}
        <div className="w-full h-full rounded-xl overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={userLocation ? 16 : 14}
            center={userLocation ?? defaultCenter}
            onLoad={(map) => (mapRef.current = map)}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              fullscreenControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
              zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
            }}
          >
            {/* User and business markers */}
            {userLocation && (
              <>
                <Marker
                  position={userLocation}
                  icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                  onClick={() => setShowUserInfo(true)}
                />
                {showUserInfo && (
                  <InfoWindow position={userLocation} onCloseClick={() => setShowUserInfo(false)}>
                    <div className="text-sm font-medium text-gray-800">You are here</div>
                  </InfoWindow>
                )}
              </>
            )}

            {filteredBusinesses.map((b) => {
              if (b.lat === undefined || b.lng === undefined) return null;
              const uen = (b as any).uen ?? b.uen ?? b.name;
              const isSelected = selectedPin && ((selectedPin.uen ?? selectedPin.name) === uen);
              const isNearest = nearestUENs.has(uen) && !searchTerm;

              const baseColor = isNearest
                ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
              const iconUrl = isSelected ? 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png' : baseColor;

              return <Marker key={String(uen)} position={{ lat: b.lat, lng: b.lng }} onClick={() => setSelectedPin(b)} icon={{ url: iconUrl }} />;
            })}
          </GoogleMap>
        </div>

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
                  {selectedPin.address && <div className={`mt-1 text-xs ${textMuted}`}>{selectedPin.address}</div>}
                  {userLocation && selectedPin.lat && selectedPin.lng && (
                    <div className={`mt-1 text-xs ${textMuted}`}>
                      {haversineDistance(userLocation.lat, userLocation.lng, selectedPin.lat, selectedPin.lng).toFixed(2)} km away
                    </div>
                  )}
                  <div className="mt-3">
                    <Button onClick={() => handleBusinessClick(selectedPin)} className="bg-primary hover:bg-primary/90 text-white">
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
        className={`shrink-0 mx-4 mt-2 mb-4 rounded-2xl border-4 ${borderTone}`}
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
                ? `Found ${filteredBusinesses.length} result${filteredBusinesses.length !== 1 ? 's' : ''}`
                : `${safeBusinesses.length} businesses nearby`}
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredBusinesses.map((b, index) => (
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
                        <Button onClick={() => handleBusinessClick(b)} className="bg-primary hover:bg-primary/90 text-white">
                          View details
                        </Button>
                        <Button onClick={() => handleShowOnMap(b)} className="bg-primary hover:bg-primary/90 text-white">
                          Show on map
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredBusinesses.length === 0 && <div className={`text-sm py-8 text-center ${textMuted}`}>No results.</div>}
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
