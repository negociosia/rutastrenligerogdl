
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Search, Info, Map as MapIcon, Train, MessageSquare, ChevronRight, X, Menu, Navigation, Locate, Edit, Copy, Check, Bus, Compass } from 'lucide-react';
import { STATIONS, LINE_COLORS } from './constants';
import { Station, ChatMessage } from './types';
import { GoogleGenAI } from "@google/genai";

// Fix for default Leaflet icon
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// User Location Icon (Blue Dot)
const createUserLocationIcon = () => L.divIcon({
  className: 'user-location-marker',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
      <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Custom icons for stations: Show icon + name
const createStationIcon = (name: string, line: string | number) => {
  const isBus = typeof line === 'string' && (line === 'mc' || line === 'mp');
  const iconColor = isBus ? '#4b5563' : '#1d4ed8'; 
  
  return L.divIcon({
    className: 'custom-station-icon bg-transparent border-none',
    html: `
      <div style="display: flex; align-items: center; width: max-content; pointer-events: none;">
        <div style="
          width: 14px; 
          height: 14px; 
          background-color: ${iconColor}; 
          border: 1.5px solid white; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          color: white;
          font-size: 8px;
        ">
          ${isBus ? '🚌' : '🚆'}
        </div>
        <span style="
          color: ${isBus ? '#374151' : '#7e22ce'}; 
          font-weight: 800; 
          font-size: 11px; 
          margin-left: 5px; 
          text-shadow: 
            -1px -1px 0 #fff,  
            1px -1px 0 #fff,
            -1px 1px 0 #fff,
            1px 1px 0 #fff;
          white-space: nowrap;
        ">${name}</span>
      </div>
    `,
    iconSize: [14, 14], 
    iconAnchor: [7, 7], 
  });
};

// Component for User Location Tracking
const UserLocationMarker = ({ isTracking, setMapCenter }: { isTracking: boolean, setMapCenter: (pos: [number, number]) => void }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        if (isTracking) {
          map.flyTo(newPos, map.getZoom(), { duration: 1 });
          setMapCenter(newPos);
        }
      },
      (err) => console.error("Error geolocalizando:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking, map, setMapCenter]);

  return position === null ? null : (
    <Marker position={position} icon={createUserLocationIcon()} zIndexOffset={1000}>
      <Popup>Tu ubicación actual</Popup>
    </Marker>
  );
};

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const App: React.FC = () => {
  const [stations, setStations] = useState<Station[]>(STATIONS);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleLines, setVisibleLines] = useState<(number | string)[]>([1, 2, 3, 4, 'mc', 'mp']);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.6749, -103.3533]);
  const [mapZoom, setMapZoom] = useState(13);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); 
  const [isTracking, setIsTracking] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const dragStartCoords = useRef<{ lat: number, lng: number } | null>(null);
  const initialGroupPositions = useRef<Record<string, { lat: number, lng: number }>>({});
  const rafRef = useRef<number | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de transporte de Guadalajara. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const currentLinePaths = useMemo(() => {
    return [1, 2, 3, 4, 'mc', 'mp'].map(lineId => ({
      id: lineId,
      color: LINE_COLORS[lineId],
      coordinates: stations.filter(s => s.line === lineId).map(s => [s.lat, s.lng]) as [number, number][],
    }));
  }, [stations]);

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    visibleLines.includes(s.line)
  );

  const toggleLine = (line: number | string) => {
    setVisibleLines(prev => 
      prev.includes(line) ? prev.filter(l => l !== line) : [...prev, line]
    );
  };

  const handleStationClick = (station: Station) => {
    if (!isEditMode) {
      setSelectedStation(station);
      setMapCenter([station.lat, station.lng]);
      setMapZoom(16);
      setIsTracking(false); // Stop tracking when manually picking a station
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    }
  };

  const handleDirections = () => {
    if (selectedStation) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.lat},${selectedStation.lng}`, '_blank');
    }
  };

  const handleMarkerDragStart = (id: string, e: L.LeafletEvent) => {
    if (id === 'mc-01') {
      const marker = e.target as L.Marker;
      const pos = marker.getLatLng();
      dragStartCoords.current = { lat: pos.lat, lng: pos.lng };
      
      const group: Record<string, { lat: number, lng: number }> = {};
      stations.forEach(s => {
        if (s.line === 'mc') {
          group[s.id] = { lat: s.lat, lng: s.lng };
        }
      });
      initialGroupPositions.current = group;
    }
  };

  const handleMarkerDrag = (id: string, e: L.LeafletEvent) => {
    if (id === 'mc-01' && dragStartCoords.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        const marker = e.target as L.Marker;
        const newPos = marker.getLatLng();
        const deltaLat = newPos.lat - dragStartCoords.current!.lat;
        const deltaLng = newPos.lng - dragStartCoords.current!.lng;

        setStations(prev => prev.map(s => {
          if (s.line === 'mc' && initialGroupPositions.current[s.id]) {
            return {
              ...s,
              lat: initialGroupPositions.current[s.id].lat + deltaLat,
              lng: initialGroupPositions.current[s.id].lng + deltaLng
            };
          }
          return s;
        }));
      });
    }
  };

  const handleMarkerDragEnd = (id: string, e: L.LeafletEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const marker = e.target as L.Marker;
    const position = marker.getLatLng();
    if (id !== 'mc-01') {
      setStations(prev => prev.map(s => 
        s.id === id ? { ...s, lat: position.lat, lng: position.lng } : s
      ));
    }
    dragStartCoords.current = null;
    initialGroupPositions.current = {};
  };

  const exportConfiguration = () => {
    const exportData = stations.map(s => {
      const lat = Number(s.lat.toFixed(5));
      const lng = Number(s.lng.toFixed(5));
      let lineStr = `  { id: '${s.id}', name: '${s.name}', lat: ${lat}, lng: ${lng}, line: ${typeof s.line === 'string' ? `'${s.line}'` : s.line}`;
      if (s.isTransfer) lineStr += `, isTransfer: true, transferLines: [${s.transferLines?.map(tl => typeof tl === 'string' ? `'${tl}'` : tl).join(', ')}]`;
      if (s.description) lineStr += `, description: '${s.description}'`;
      lineStr += ` },`;
      return lineStr;
    }).join('\n');
    const fullExport = `export const STATIONS: Station[] = [\n${exportData}\n];`;
    navigator.clipboard.writeText(fullExport).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', content: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsLoadingChat(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Eres un asistente experto en SITEUR y Macrobus Guadalajara. Pregunta: ${userInput}`,
      });
      setChatMessages([...newMessages, { role: 'assistant', content: response.text || 'Lo siento.' }]);
    } catch (error) {
      setChatMessages([...newMessages, { role: 'assistant', content: 'Error.' }]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const toggleGPS = () => {
    if (!isTracking) {
      setIsTracking(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
          setMapZoom(16);
        });
      }
    } else {
      setIsTracking(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans text-gray-900 overflow-hidden bg-gray-100">
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-[70] w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-80`}>
        <div className="flex flex-col h-full">
          <div className="p-4 md:p-6 bg-blue-700 text-white shadow-md shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Train size={24} /> SITEUR GDL
              </h1>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 hover:bg-blue-600 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 text-blue-300" size={18} />
              <input 
                type="text" 
                placeholder="Buscar estación..." 
                className="w-full pl-10 pr-4 py-2 bg-blue-800 border-none rounded-xl text-white placeholder-blue-300 focus:ring-2 focus:ring-white transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  if (!isEditMode) setSelectedStation(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${isEditMode ? 'bg-orange-500 text-white shadow-lg' : 'bg-blue-800 text-blue-100 hover:bg-blue-600'}`}
              >
                <Edit size={12} /> {isEditMode ? 'Listo' : 'Edición'}
              </button>

              {isEditMode && (
                <button 
                  onClick={exportConfiguration}
                  className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-white text-blue-800 shadow-lg'}`}
                >
                  {copySuccess ? <Check size={12} /> : <Copy size={12} />} Config
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Líneas de Tren</h2>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map(line => (
                  <button key={line} onClick={() => toggleLine(line)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm ${visibleLines.includes(line) ? 'bg-gray-100 border-gray-300 shadow-sm font-bold ring-2 ring-blue-500/20' : 'bg-white border-gray-100 opacity-60'}`}>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: LINE_COLORS[line] }}></div>
                    <span>Línea {line}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Mi Macro (BRT)</h2>
              <div className="flex flex-col gap-2">
                {[{ id: 'mc', name: 'Macro Calzada' }, { id: 'mp', name: 'Macro Periférico' }].map(macro => (
                  <button key={macro.id} onClick={() => toggleLine(macro.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm ${visibleLines.includes(macro.id) ? 'bg-gray-100 border-gray-300 shadow-sm font-bold ring-2 ring-gray-500/20' : 'bg-white border-gray-100 opacity-60'}`}>
                    <Bus size={16} className="text-gray-400" />
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: LINE_COLORS[macro.id] }}></div>
                    <span>{macro.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pb-8">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Estaciones ({filteredStations.length})</h2>
              <div className="space-y-1">
                {filteredStations.map(station => {
                  const isBus = typeof station.line === 'string';
                  return (
                    <button key={station.id} onClick={() => handleStationClick(station)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50 text-left ${selectedStation?.id === station.id ? 'bg-blue-50 border-blue-200' : 'border border-transparent'}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: LINE_COLORS[station.line] }}>
                          {isBus ? <Bus size={12} /> : station.line}
                        </div>
                        <span className="font-semibold text-sm truncate max-w-[150px]">{station.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 h-full">
        {/* Mobile Header FAB */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="absolute top-4 left-4 z-40 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-600 md:hidden active:scale-95 transition-transform"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Action Buttons FABs */}
        <div className="absolute top-4 right-4 z-40 flex flex-col gap-3">
          <button 
            onClick={toggleGPS} 
            className={`p-3 rounded-2xl shadow-xl border transition-all active:scale-95 ${isTracking ? 'bg-blue-600 text-white border-blue-500 animate-pulse' : 'bg-white text-blue-600 border-gray-100'}`}
          >
            {isTracking ? <Compass size={24} /> : <Locate size={24} />}
          </button>
          {!isEditMode && (
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)} 
              className={`p-3 rounded-2xl shadow-xl border transition-all active:scale-95 ${isChatOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-blue-600 border-gray-100'}`}
            >
              <MessageSquare size={24} />
            </button>
          )}
        </div>

        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          zoomControl={false} 
          className="w-full h-full"
          style={{ zIndex: 10 }}
        >
          <ZoomControl position="bottomright" />
          <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          />
          <MapController center={mapCenter} zoom={mapZoom} />
          <UserLocationMarker isTracking={isTracking} setMapCenter={setMapCenter} />

          {currentLinePaths.filter(lp => visibleLines.includes(lp.id)).map(path => (
            <Polyline 
              key={path.id} 
              positions={path.coordinates} 
              pathOptions={{ 
                color: path.color, 
                weight: typeof path.id === 'string' ? 4 : 6, 
                opacity: 0.8, 
                dashArray: typeof path.id === 'string' ? '1, 8' : undefined 
              }} 
            />
          ))}

          {filteredStations.map(station => (
            <Marker 
              key={station.id} 
              position={[station.lat, station.lng]} 
              icon={createStationIcon(station.name, station.line)} 
              draggable={isEditMode}
              eventHandlers={{
                click: () => handleStationClick(station),
                dragstart: (e) => handleMarkerDragStart(station.id, e),
                drag: (e) => handleMarkerDrag(station.id, e),
                dragend: (e) => handleMarkerDragEnd(station.id, e)
              }}
            >
              {!isEditMode && (
                <Popup>
                  <div className="p-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LINE_COLORS[station.line] }}></div>
                      <span className="font-bold text-sm">{station.name}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-1">
                      {typeof station.line === 'string' ? (station.line === 'mc' ? 'Mi Macro Calzada' : 'Mi Macro Periférico') : `Tren Ligero L${station.line}`}
                    </p>
                  </div>
                </Popup>
              )}
            </Marker>
          ))}
        </MapContainer>

        {/* Selected Station Card - Better Mobile Support */}
        {selectedStation && !isEditMode && (
          <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center px-4 md:px-0">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-l-0 md:border-l-8 md:border-t-0 animate-in fade-in slide-in-from-bottom-8 duration-300" style={{ borderColor: LINE_COLORS[selectedStation.line] }}>
              <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 md:p-4 rounded-2xl text-white shadow-lg shrink-0" style={{ backgroundColor: LINE_COLORS[selectedStation.line] }}>
                    {typeof selectedStation.line === 'string' ? <Bus size={24} /> : <Train size={24} />}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight truncate">{selectedStation.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">
                      {typeof selectedStation.line === 'string' ? (selectedStation.line === 'mc' ? 'Macro Calzada' : 'Macro Periférico') : `Línea ${selectedStation.line} - Tren Ligero`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={handleDirections} 
                    className="flex-1 md:flex-none bg-blue-600 text-white py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95 text-sm"
                  >
                    <Navigation size={18} /> Ir
                  </button>
                  <button 
                    onClick={() => setSelectedStation(null)} 
                    className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-colors active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Chat - Mobile Friendly Full Screenish */}
        {isChatOpen && !isEditMode && (
          <div className="fixed inset-0 z-[100] md:absolute md:inset-auto md:top-20 md:right-4 md:w-[400px] md:h-3/4 bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right md:zoom-in-95">
            <div className="bg-blue-600 p-4 md:p-5 text-white flex justify-between items-center shrink-0 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <MessageSquare size={20} />
                </div>
                <span className="font-bold text-lg tracking-tight">Guía SITEUR</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoadingChat && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl border border-gray-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-white flex gap-2 pb-safe-area-inset">
              <input 
                type="text" 
                placeholder="¿A dónde quieres ir?" 
                className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner bg-gray-50" 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
              />
              <button 
                onClick={sendMessage} 
                disabled={isLoadingChat}
                className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
