import React, { useRef, useEffect, useState } from 'react';
import { useJarvisTheme } from '../theme/ThemeContext';
import {
  WORLD_CONTINENT_POLYGONS,
  CACHED_LAND_GRID,
  STRATEGIC_GLOBAL_HUBS,
  TOPOGRAPHY_RIDGES,
  StrategicCity,
} from '../data/worldLandmasses';
import {
  Globe,
  Layers,
  Plane,
  Ship,
  Cable,
  Sun,
  Camera,
  Activity,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Radio,
  Eye,
  X,
  Mountain,
  Compass,
} from 'lucide-react';

export interface OsirisLayerState {
  continents: boolean;
  cables: boolean;
  sdk_air: boolean;
  sdk_naval: boolean;
  day_night: boolean;
  cctv: boolean;
  geohazards: boolean;
  gdelt: boolean;
  terrain_3d: boolean;
}

// Simulated real-world subsea cables Geo-paths
const SUBSEA_CABLES = [
  {
    name: 'Apollo / Transatlantic Fiber',
    capacity: '32 Tbps',
    coords: [
      [-73.9, 40.7], // New York
      [-50.0, 45.0],
      [-30.0, 48.0],
      [-10.0, 50.0],
      [-0.1, 51.5],  // London
    ],
  },
  {
    name: 'EllaLink / Europe-South America',
    capacity: '72 Tbps',
    coords: [
      [-9.1, 38.7],  // Lisbon
      [-25.0, 20.0],
      [-30.0, 0.0],
      [-38.5, -3.7], // Fortaleza, Brazil
      [-43.1, -22.9] // Rio de Janeiro
    ],
  },
  {
    name: 'Trans-Pacific Express (TPE)',
    capacity: '50 Tbps',
    coords: [
      [-122.4, 37.7], // San Francisco
      [-150.0, 32.0],
      [180.0, 30.0],
      [140.0, 34.0], // Tokyo
      [121.5, 31.2], // Shanghai
    ],
  },
  {
    name: 'SEA-ME-WE 6 (Europe-Asia-Pacific)',
    capacity: '120 Tbps',
    coords: [
      [5.3, 43.3],   // Marseille
      [32.5, 30.0],  // Suez
      [55.0, 25.0],  // Dubai
      [72.8, 19.0],  // Mumbai
      [103.8, 1.3],  // Singapore
    ],
  },
  {
    name: 'Monet Submarine Cable',
    capacity: '64 Tbps',
    coords: [
      [-80.1, 26.0],  // Miami
      [-65.0, 15.0],
      [-45.0, -5.0],
      [-43.2, -22.9], // Rio
      [-46.6, -23.5], // Santos
    ],
  },
  {
    name: 'Southern Cross Cable (Trans-Tasman/Pacific)',
    capacity: '72 Tbps',
    coords: [
      [151.2, -33.8], // Sydney
      [174.7, -36.8], // Auckland
      [-175.0, -15.0],
      [-157.8, 21.3], // Hawaii
      [-122.3, 47.6], // Seattle
    ],
  },
];

// Commercial ADS-B Flights
const ADS_B_FLIGHTS = [
  { id: 'BAW249', callsign: 'BAW249', airline: 'British Airways', origin: 'LHR', dest: 'GIG', alt: 36000, spd: 485, lat: 12.4, lon: -28.5, heading: 215 },
  { id: 'AFR443', callsign: 'AFR443', airline: 'Air France', origin: 'GIG', dest: 'CDG', alt: 37000, spd: 492, lat: 2.1, lon: -31.2, heading: 35 },
  { id: 'UAL850', callsign: 'UAL850', airline: 'United Airlines', origin: 'IAH', dest: 'NRT', alt: 38000, spd: 510, lat: 48.2, lon: -160.4, heading: 290 },
  { id: 'UAE241', callsign: 'UAE241', airline: 'Emirates', origin: 'DXB', dest: 'GRU', alt: 39000, spd: 478, lat: 4.8, lon: 18.2, heading: 240 },
  { id: 'QFA1', callsign: 'QFA1', airline: 'Qantas Airways', origin: 'SYD', dest: 'LHR', alt: 34000, spd: 520, lat: 8.5, lon: 88.4, heading: 305 },
  { id: 'TAM8084', callsign: 'TAM8084', airline: 'LATAM Brasil', origin: 'GRU', dest: 'MIA', alt: 35000, spd: 480, lat: -4.2, lon: -55.8, heading: 345 },
  { id: 'DLH506', callsign: 'DLH506', airline: 'Lufthansa', origin: 'FRA', dest: 'GRU', alt: 36000, spd: 495, lat: 22.1, lon: -22.3, heading: 210 },
  { id: 'JAL006', callsign: 'JAL006', airline: 'Japan Airlines', origin: 'HND', dest: 'JFK', alt: 37000, spd: 535, lat: 55.4, lon: -150.2, heading: 85 },
];

// AIS Naval Commercial Fleet & Strategic Maritime Chokepoints
const AIS_VESSELS = [
  { id: 'IMO9839438', name: 'Ever Given', vesselType: 'Ultra Large Container', flag: 'Panama', spd: 14.2, lat: 29.9, lon: 32.5, region: 'Canal de Suez' },
  { id: 'IMO9708681', name: 'MSC Oscar', vesselType: 'Container Ship', flag: 'Panama', spd: 18.1, lat: 1.25, lon: 103.8, region: 'Estreito de Malaca' },
  { id: 'IMO9629495', name: 'CMA CGM Zheng He', vesselType: 'Container Ship', flag: 'Malta', spd: 16.5, lat: 9.1, lon: -79.7, region: 'Canal do Panamá' },
  { id: 'IMO9436496', name: 'Front Altair', vesselType: 'VLCC Crude Oil Tanker', flag: 'Marshall Is', spd: 12.8, lat: 26.2, lon: 56.4, region: 'Estreito de Ormuz' },
  { id: 'IMO9776171', name: 'Vale Rio de Janeiro', vesselType: 'Valemax Ore Carrier', flag: 'Liberia', spd: 13.5, lat: -24.1, lon: -46.2, region: 'Porto de Santos / Atlântico Sul' },
  { id: 'IMO9811000', name: 'COSCO Universe', vesselType: 'Ultra Container', flag: 'Hong Kong', spd: 17.8, lat: 22.2, lon: 114.1, region: 'Hong Kong Harbor' },
  { id: 'IMO9315331', name: 'Maersk Mc-Kinney', vesselType: 'Container Carrier', flag: 'Denmark', spd: 15.4, lat: 51.9, lon: 4.1, region: 'Rotterdam Port' },
];

// Global Public CCTV Surveillance Network
const PUBLIC_CCTV_CAMERAS = [
  { id: 'cctv_tokyo_shibuya', name: 'Tokyo // Cruzamento de Shibuya', city: 'Tóquio, Japão', lat: 35.659, lon: 139.700, status: 'AO VIVO', viewers: 18420 },
  { id: 'cctv_nyc_times_sq', name: 'New York // Times Square HD 4K', city: 'Nova York, EUA', lat: 40.758, lon: -73.985, status: 'AO VIVO', viewers: 24900 },
  { id: 'cctv_london_tower', name: 'London // Tower Bridge Thames', city: 'Londres, Reino Unido', lat: 51.505, lon: -0.075, status: 'AO VIVO', viewers: 9140 },
  { id: 'cctv_sp_paulista', name: 'São Paulo // Av. Paulista & MASP', city: 'São Paulo, Brasil', lat: -23.561, lon: -46.655, status: 'AO VIVO', viewers: 14210 },
  { id: 'cctv_sydney_harbour', name: 'Sydney // Sydney Opera & Harbour', city: 'Sydney, Austrália', lat: -33.856, lon: 151.215, status: 'AO VIVO', viewers: 8300 },
  { id: 'cctv_dubai_marina', name: 'Dubai // Dubai Marina & Port', city: 'Dubai, EAU', lat: 25.080, lon: 55.140, status: 'AO VIVO', viewers: 6720 },
];

// Geohazards (USGS Earthquakes & Thermal anomalies)
const GEOHAZARDS = [
  { id: 'usgs_1', type: 'earthquake', mag: 6.2, place: 'Honshu, Japão', lat: 37.4, lon: 141.2, depth: '42 km' },
  { id: 'usgs_2', type: 'earthquake', mag: 5.4, place: 'Costa do Chile', lat: -31.2, lon: -71.8, depth: '35 km' },
  { id: 'usgs_3', type: 'earthquake', mag: 4.8, place: 'Falha de San Andreas, CA', lat: 35.8, lon: -120.4, depth: '8 km' },
  { id: 'nasa_1', type: 'thermal_firms', label: 'Anomalia Térmica / Foco', place: 'Bacia Amazônica', lat: -8.4, lon: -62.1, tempK: 342 },
  { id: 'nasa_2', type: 'thermal_firms', label: 'Atividade Vulcânica Etna', place: 'Sicília, Itália', lat: 37.7, lon: 15.0, tempK: 410 },
];

// GDELT Global Intelligence Conflict & News
const GDELT_INTEL = [
  { id: 'gdelt_1', title: 'Segurança Cibernética: Alerta em Infraestruturas Críticas', region: 'Europa Oriental', lat: 50.4, lon: 30.5, impact: 'ALTO' },
  { id: 'gdelt_2', title: 'Comércio Marítimo: Congestionamento no Estreito de Malaca', region: 'Sudeste Asiático', lat: 2.5, lon: 101.8, impact: 'MÉDIO' },
  { id: 'gdelt_3', title: 'Transição Energética: Investimento em Cabos Submarinos', region: 'América do Norte', lat: 38.9, lon: -77.0, impact: 'INFO' },
];

export const OsirisGlobalMap: React.FC<{
  className?: string;
  onSelectEntity?: (entity: any) => void;
}> = ({ className = '', onSelectEntity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { colors } = useJarvisTheme();

  // Layer switches (All Osiris layers active by default)
  const [layers, setLayers] = useState<OsirisLayerState>({
    continents: true,
    cables: true,
    sdk_air: true,
    sdk_naval: true,
    day_night: true,
    cctv: true,
    geohazards: true,
    gdelt: true,
    terrain_3d: true,
  });

  const [projection, setProjection] = useState<'3d' | '2d'>('3d');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [inspectingCctv, setInspectingCctv] = useState<any | null>(null);

  // Globe orientation (rotation angles in radians)
  // Default centered roughly over the Atlantic showing the Americas & Europe/Africa
  const rotation = useRef<{ lon: number; lat: number }>({ lon: 0.9, lat: 0.25 });
  const isDragging = useRef<boolean>(false);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const zoomLevel = useRef<number>(1.0);

  // Animated positions for flights & ships
  const flightOffsets = useRef<number[]>(ADS_B_FLIGHTS.map(() => Math.random() * 100));

  // Toggle specific layer
  const toggleLayer = (layerKey: keyof OsirisLayerState) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Convert Lon/Lat (degrees) to 3D Sphere (x, y, z) or 2D Plane
  const projectCoords = (
    lonDeg: number,
    latDeg: number,
    width: number,
    height: number,
    radius: number,
    rotLon: number,
    rotLat: number,
    projMode: '3d' | '2d'
  ) => {
    if (projMode === '2d') {
      // 2D Equirectangular projection
      const x = ((lonDeg + 180) / 360) * width;
      const y = ((90 - latDeg) / 180) * height;
      return { x, y, visible: true, depth: 1, x3d: 0, y3d: 0, z3d: 1 };
    }

    // 3D Orthographic Globe
    const lambda = (lonDeg * Math.PI) / 180 + rotLon;
    const phi = (latDeg * Math.PI) / 180;

    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosLambda = Math.cos(lambda);
    const sinLambda = Math.sin(lambda);

    const cosTilt = Math.cos(rotLat);
    const sinTilt = Math.sin(rotLat);

    // 3D vector coordinates on unit sphere
    const x3d = cosPhi * sinLambda;
    const y3d = sinPhi * cosTilt - cosPhi * cosLambda * sinTilt;
    const z3d = sinPhi * sinTilt + cosPhi * cosLambda * cosTilt;

    const visible = z3d > 0.02; // Visible on front-facing hemisphere
    const screenX = width / 2 + x3d * radius;
    const screenY = height / 2 - y3d * radius;

    return { x: screenX, y: screenY, visible, depth: z3d, x3d, y3d, z3d };
  };

  // Interpolate and draw polyline segment smoothly adhering to spherical horizon
  const drawSphericalPolyline = (
    ctx: CanvasRenderingContext2D,
    coords: [number, number][],
    width: number,
    height: number,
    radius: number,
    rotLon: number,
    rotLat: number,
    projMode: '3d' | '2d',
    closeLoop: boolean = false
  ) => {
    if (coords.length < 2) return;

    if (projMode === '2d') {
      ctx.beginPath();
      coords.forEach(([lon, lat], i) => {
        const pt = projectCoords(lon, lat, width, height, radius, rotLon, rotLat, '2d');
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      if (closeLoop) ctx.closePath();
      ctx.stroke();
      return;
    }

    // 3D Mode: Subdivide segments and clip to front hemisphere
    ctx.beginPath();
    const count = closeLoop ? coords.length : coords.length - 1;

    for (let i = 0; i < count; i++) {
      const p1 = coords[i];
      const p2 = coords[(i + 1) % coords.length];

      // Subdivide long geographic segments into 3-degree steps for smooth spherical curvature
      const dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const steps = Math.max(1, Math.min(10, Math.ceil(dist / 3)));

      for (let s = 0; s < steps; s++) {
        const t1 = s / steps;
        const t2 = (s + 1) / steps;
        const lonA = p1[0] + (p2[0] - p1[0]) * t1;
        const latA = p1[1] + (p2[1] - p1[1]) * t1;
        const lonB = p1[0] + (p2[0] - p1[0]) * t2;
        const latB = p1[1] + (p2[1] - p1[1]) * t2;

        const ptA = projectCoords(lonA, latA, width, height, radius, rotLon, rotLat, '3d');
        const ptB = projectCoords(lonB, latB, width, height, radius, rotLon, rotLat, '3d');

        if (ptA.z3d > 0 && ptB.z3d > 0) {
          ctx.moveTo(ptA.x, ptA.y);
          ctx.lineTo(ptB.x, ptB.y);
        } else if (ptA.z3d > 0 && ptB.z3d <= 0) {
          // Horizon exit interpolation
          const fraction = ptA.z3d / (ptA.z3d - ptB.z3d);
          let hx = ptA.x3d + (ptB.x3d - ptA.x3d) * fraction;
          let hy = ptA.y3d + (ptB.y3d - ptA.y3d) * fraction;
          const len = Math.hypot(hx, hy) || 1;
          hx /= len;
          hy /= len;
          const screenHx = width / 2 + hx * radius;
          const screenHy = height / 2 - hy * radius;
          ctx.moveTo(ptA.x, ptA.y);
          ctx.lineTo(screenHx, screenHy);
        } else if (ptA.z3d <= 0 && ptB.z3d > 0) {
          // Horizon entrance interpolation
          const fraction = ptA.z3d / (ptA.z3d - ptB.z3d);
          let hx = ptA.x3d + (ptB.x3d - ptA.x3d) * fraction;
          let hy = ptA.y3d + (ptB.y3d - ptA.y3d) * fraction;
          const len = Math.hypot(hx, hy) || 1;
          hx /= len;
          hy /= len;
          const screenHx = width / 2 + hx * radius;
          const screenHy = height / 2 - hy * radius;
          ctx.moveTo(screenHx, screenHy);
          ctx.lineTo(ptB.x, ptB.y);
        }
      }
    }
    ctx.stroke();
  };

  // Mouse drag & zoom listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };

      rotation.current.lon += dx * 0.005;
      rotation.current.lat = Math.max(-1.25, Math.min(1.25, rotation.current.lat + dy * 0.005));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomLevel.current = Math.max(0.65, Math.min(2.5, zoomLevel.current - e.deltaY * 0.001));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Main 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.012;

      // Auto rotation in 3D when user is not manually interacting
      if (!isDragging.current && projection === '3d') {
        rotation.current.lon += 0.0006;
      }

      const width = canvas.clientWidth || 800;
      const height = canvas.clientHeight || 600;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const radius = Math.min(width, height) * 0.42 * zoomLevel.current;
      const rotLon = rotation.current.lon;
      const rotLat = rotation.current.lat;

      // Clear space background
      ctx.fillStyle = colors.background || '#030712';
      ctx.fillRect(0, 0, width, height);

      // Sci-fi Celestial Coordinates Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      const step = 45;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // 3D GLOBE ATMOSPHERE & OCEAN SPHERE
      // ----------------------------------------------------
      if (projection === '3d') {
        // Outer Holographic Aura
        const aura = ctx.createRadialGradient(
          width / 2,
          height / 2,
          radius * 0.92,
          width / 2,
          height / 2,
          radius * 1.14
        );
        aura.addColorStop(0, 'rgba(0, 217, 255, 0.22)');
        aura.addColorStop(0.5, 'rgba(56, 189, 248, 0.09)');
        aura.addColorStop(1, 'transparent');

        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius * 1.14, 0, Math.PI * 2);
        ctx.fill();

        // Ocean Sphere Body (Deep Oceanic Space Tint)
        const oceanGrad = ctx.createRadialGradient(
          width / 2 - radius * 0.2,
          height / 2 - radius * 0.2,
          radius * 0.1,
          width / 2,
          height / 2,
          radius
        );
        oceanGrad.addColorStop(0, 'rgba(10, 25, 50, 0.95)');
        oceanGrad.addColorStop(0.8, 'rgba(4, 12, 28, 0.98)');
        oceanGrad.addColorStop(1, 'rgba(2, 6, 18, 1)');

        ctx.fillStyle = oceanGrad;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        ctx.fill();

        // Sphere Outer Rim Border
        ctx.strokeStyle = colors.primary || '#00d9ff';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Day / Night Terminator Shading
        if (layers.day_night) {
          const sunAngle = (time * 0.08) % (Math.PI * 2);
          const sunX = width / 2 + Math.cos(sunAngle) * radius * 0.6;
          const sunY = height / 2 + Math.sin(sunAngle) * radius * 0.6;
          const nightGrad = ctx.createRadialGradient(sunX, sunY, radius * 0.15, width / 2, height / 2, radius);
          nightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
          nightGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
          nightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.72)');

          ctx.fillStyle = nightGrad;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Graticule Lines (Parallels & Meridians)
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';

        // Parallels
        for (let lat = -60; lat <= 60; lat += 30) {
          ctx.beginPath();
          let started = false;
          for (let lon = -180; lon <= 180; lon += 4) {
            const p = projectCoords(lon, lat, width, height, radius, rotLon, rotLat, '3d');
            if (p.visible) {
              if (!started) {
                ctx.moveTo(p.x, p.y);
                started = true;
              } else {
                ctx.lineTo(p.x, p.y);
              }
            } else {
              started = false;
            }
          }
          ctx.stroke();
        }

        // Meridians
        for (let lon = -180; lon < 180; lon += 30) {
          ctx.beginPath();
          let started = false;
          for (let lat = -80; lat <= 80; lat += 4) {
            const p = projectCoords(lon, lat, width, height, radius, rotLon, rotLat, '3d');
            if (p.visible) {
              if (!started) {
                ctx.moveTo(p.x, p.y);
                started = true;
              } else {
                ctx.lineTo(p.x, p.y);
              }
            } else {
              started = false;
            }
          }
          ctx.stroke();
        }

        // Equator Accent Line
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.beginPath();
        let eqStarted = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = projectCoords(lon, 0, width, height, radius, rotLon, rotLat, '3d');
          if (p.visible) {
            if (!eqStarted) {
              ctx.moveTo(p.x, p.y);
              eqStarted = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            eqStarted = false;
          }
        }
        ctx.stroke();
      } else {
        // ----------------------------------------------------
        // 2D EQUIRECTANGULAR MAP BACKGROUND & FRAME
        // ----------------------------------------------------
        // Ocean map background
        ctx.fillStyle = 'rgba(5, 14, 32, 0.95)';
        ctx.fillRect(0, 0, width, height);

        // Map Border & Frame
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        // 2D Graticule Grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 0.6;
        for (let lat = -60; lat <= 60; lat += 30) {
          const y = ((90 - lat) / 180) * height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();

          // Latitude Labels
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.font = '9px monospace';
          ctx.fillText(`${lat > 0 ? '+' : ''}${lat}°`, 6, y - 3);
        }

        for (let lon = -150; lon <= 150; lon += 30) {
          const x = ((lon + 180) / 360) * width;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();

          // Longitude Labels
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.font = '9px monospace';
          ctx.fillText(`${lon}°`, x + 3, height - 6);
        }

        // Equator & Prime Meridian Highlight
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.lineWidth = 1.2;
        const eqY = height / 2;
        const pmX = width / 2;
        ctx.beginPath();
        ctx.moveTo(0, eqY);
        ctx.lineTo(width, eqY);
        ctx.moveTo(pmX, 0);
        ctx.lineTo(pmX, height);
        ctx.stroke();
      }

      // =========================================================================
      // FOUNDATIONAL BASE LAYER: WORLD CONTINENTS, COASTLINES & RADAR LAND MATRIX
      // =========================================================================
      if (layers.continents) {
        // 1. Continent Polygon Fills (2D Mode)
        if (projection === '2d') {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
          WORLD_CONTINENT_POLYGONS.forEach((poly) => {
            ctx.beginPath();
            poly.coords.forEach(([lon, lat], i) => {
              const pt = projectCoords(lon, lat, width, height, radius, rotLon, rotLat, '2d');
              if (i === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            });
            ctx.closePath();
            ctx.fill();
          });
        }

        // 2. High-Tech Cybernetic Land Dot Matrix (Both 3D & 2D)
        // Provides the authentic Stark / Osiris.ai tactical radar satellite scanning surface
        ctx.fillStyle = 'rgba(34, 211, 238, 0.42)';
        const dotSize = projection === '3d' ? 1.6 : 1.4;

        CACHED_LAND_GRID.forEach(([lon, lat]) => {
          const pt = projectCoords(lon, lat, width, height, radius, rotLon, rotLat, projection);
          if (pt.visible) {
            // In 3D, scale opacity by sphere depth so edges fade gracefully
            if (projection === '3d') {
              const alpha = Math.max(0.12, Math.min(0.65, pt.depth * 0.7));
              ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
            }
            ctx.fillRect(pt.x - dotSize / 2, pt.y - dotSize / 2, dotSize, dotSize);
          }
        });

        // 3. Crisp Glowing Coastlines
        // Faint Outer Coastline Glow Stroke
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.28)';
        ctx.lineWidth = 3.0;
        WORLD_CONTINENT_POLYGONS.forEach((poly) => {
          drawSphericalPolyline(ctx, poly.coords, width, height, radius, rotLon, rotLat, projection, true);
        });

        // Crisp Inner Coastline Contour
        ctx.strokeStyle = colors.primary || '#00d9ff';
        ctx.lineWidth = 1.3;
        WORLD_CONTINENT_POLYGONS.forEach((poly) => {
          drawSphericalPolyline(ctx, poly.coords, width, height, radius, rotLon, rotLat, projection, true);
        });

        // 4. Strategic Mountain Ridges (when terrain_3d is active)
        if (layers.terrain_3d) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)'; // Amber topographical contour
          ctx.lineWidth = 1.5;
          TOPOGRAPHY_RIDGES.forEach((ridge) => {
            drawSphericalPolyline(ctx, ridge.coords, width, height, radius, rotLon, rotLat, projection, false);

            // Mountain peak markers along the ridge
            ridge.coords.forEach(([lon, lat], idx) => {
              if (idx % 3 === 0) {
                const pt = projectCoords(lon, lat, width, height, radius, rotLon, rotLat, projection);
                if (pt.visible) {
                  ctx.fillStyle = '#f59e0b';
                  ctx.beginPath();
                  ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            });
          });
        }

        // 5. Strategic Global Hubs & Metropolises
        STRATEGIC_GLOBAL_HUBS.forEach((hub) => {
          const pt = projectCoords(hub.lon, hub.lat, width, height, radius, rotLon, rotLat, projection);
          if (pt.visible) {
            // Pulse ring
            const hubPulse = 3.5 + Math.sin(time * 2.5 + hub.lat) * 1.5;
            ctx.strokeStyle = hub.category === 'hq' ? '#00e5ff' : 'rgba(56, 189, 248, 0.6)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, hubPulse, 0, Math.PI * 2);
            ctx.stroke();

            // Core dot
            ctx.fillStyle = hub.category === 'hq' ? '#00e5ff' : '#38bdf8';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // City Name Label (if zoomed in or key hub)
            if (zoomLevel.current >= 0.85 || hub.category === 'hq') {
              ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
              ctx.font = '9px monospace';
              ctx.fillText(hub.name, pt.x + 6, pt.y - 3);
            }
          }
        });
      }

      // ================= LAYER 1: SUBSEA FIBER-OPTIC CABLES =================
      if (layers.cables) {
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#06b6d4';
        SUBSEA_CABLES.forEach((cable) => {
          drawSphericalPolyline(ctx, cable.coords as [number, number][], width, height, radius, rotLon, rotLat, projection, false);

          // Landing station nodes
          cable.coords.forEach(([lon, lat]) => {
            const pt = projectCoords(lon, lat, width, height, radius, rotLon, rotLat, projection);
            if (pt.visible) {
              ctx.fillStyle = '#22d3ee';
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        });
      }

      // ================= LAYER 2: ADS-B COMMERCIAL FLIGHTS =================
      if (layers.sdk_air) {
        ADS_B_FLIGHTS.forEach((fl, idx) => {
          const travelProg = ((time * 0.3 + flightOffsets.current[idx]) % 100) / 100;
          const currentLon = fl.lon + (travelProg - 0.5) * 12;
          const currentLat = fl.lat + (travelProg - 0.5) * 6;

          const pt = projectCoords(currentLon, currentLat, width, height, radius, rotLon, rotLat, projection);
          if (pt.visible) {
            // Flight beacon glow
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Vector heading indicator
            const rad = ((fl.heading - 90) * Math.PI) / 180;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.x + Math.cos(rad) * 9, pt.y + Math.sin(rad) * 9);
            ctx.stroke();

            // Flight Callsign tag
            ctx.fillStyle = '#bae6fd';
            ctx.font = '9px monospace';
            ctx.fillText(`${fl.callsign} FL${Math.round(fl.alt / 100)}`, pt.x + 8, pt.y - 4);
          }
        });
      }

      // ================= LAYER 3: AIS MARITIME SHIPPING =================
      if (layers.sdk_naval) {
        AIS_VESSELS.forEach((ship) => {
          const pt = projectCoords(ship.lon, ship.lat, width, height, radius, rotLon, rotLat, projection);
          if (pt.visible) {
            // Ship icon / diamond shape
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y - 4);
            ctx.lineTo(pt.x + 4, pt.y);
            ctx.lineTo(pt.x, pt.y + 4);
            ctx.lineTo(pt.x - 4, pt.y);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#6ee7b7';
            ctx.font = '9px monospace';
            ctx.fillText(`${ship.name}`, pt.x + 7, pt.y + 3);
          }
        });
      }

      // ================= LAYER 4: PUBLIC CCTV CAMERAS =================
      if (layers.cctv) {
        PUBLIC_CCTV_CAMERAS.forEach((cam) => {
          const pt = projectCoords(cam.lon, cam.lat, width, height, radius, rotLon, rotLat, projection);
          if (pt.visible) {
            const pulse = 4 + Math.sin(time * 3 + cam.lat) * 2;
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pulse, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fda4af';
            ctx.font = '10px sans-serif';
            ctx.fillText(`CAM // ${cam.name.split('//')[0].trim()}`, pt.x + 8, pt.y + 11);
          }
        });
      }

      // ================= LAYER 5: GEOHAZARDS (USGS & FIRMS) =================
      if (layers.geohazards) {
        GEOHAZARDS.forEach((geo) => {
          const pt = projectCoords(geo.lon, geo.lat, width, height, radius, rotLon, rotLat, projection);
          if (pt.visible) {
            if (geo.type === 'earthquake') {
              const ringRadius = (geo.mag || 5) * 2.2 + ((time * 4) % 12);
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, ringRadius, 0, Math.PI * 2);
              ctx.stroke();

              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillStyle = '#f59e0b';
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      }

      // ================= LAYER 6: GDELT GLOBAL INTELLIGENCE =================
      if (layers.gdelt) {
        GDELT_INTEL.forEach((item) => {
          const pt = projectCoords(item.lon, item.lat, width, height, radius, rotLon, rotLat, projection);
          if (pt.visible) {
            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [layers, projection, colors]);

  // Click handler to select entities or open CCTV
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) * 0.42 * zoomLevel.current;
    const rotLon = rotation.current.lon;
    const rotLat = rotation.current.lat;

    // Check CCTV cameras
    for (const cam of PUBLIC_CCTV_CAMERAS) {
      const pt = projectCoords(cam.lon, cam.lat, width, height, radius, rotLon, rotLat, projection);
      if (pt.visible) {
        const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
        if (dist < 14) {
          setInspectingCctv(cam);
          setSelectedEntity({ type: 'cctv', ...cam });
          if (onSelectEntity) onSelectEntity({ type: 'cctv', ...cam });
          return;
        }
      }
    }

    // Check Strategic Hubs
    for (const hub of STRATEGIC_GLOBAL_HUBS) {
      const pt = projectCoords(hub.lon, hub.lat, width, height, radius, rotLon, rotLat, projection);
      if (pt.visible) {
        const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
        if (dist < 14) {
          setSelectedEntity({ type: 'hub', ...hub });
          if (onSelectEntity) onSelectEntity({ type: 'hub', ...hub });
          return;
        }
      }
    }

    // Check Flights
    for (const fl of ADS_B_FLIGHTS) {
      const pt = projectCoords(fl.lon, fl.lat, width, height, radius, rotLon, rotLat, projection);
      if (pt.visible) {
        const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
        if (dist < 14) {
          setSelectedEntity({ type: 'flight', ...fl });
          if (onSelectEntity) onSelectEntity({ type: 'flight', ...fl });
          return;
        }
      }
    }

    // Check Ships
    for (const ship of AIS_VESSELS) {
      const pt = projectCoords(ship.lon, ship.lat, width, height, radius, rotLon, rotLat, projection);
      if (pt.visible) {
        const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
        if (dist < 14) {
          setSelectedEntity({ type: 'vessel', ...ship });
          if (onSelectEntity) onSelectEntity({ type: 'vessel', ...ship });
          return;
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none bg-slate-950 ${className}`}
    >
      {/* 3D / 2D WebGL & Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Telemetry Header Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-lg border border-cyan-500/30 text-xs font-mono text-cyan-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider text-cyan-300">OSIRIS.AI GEO-INTEL</span>
        </div>
        <span className="text-slate-600">·</span>
        <span>MODO: {projection === '3d' ? 'GLOBO ESFÉRICO 3D' : 'PROJEÇÃO PLANA 2D'}</span>
        <span className="text-slate-600">·</span>
        <span>LAT: {(rotation.current.lat * 57.3).toFixed(1)}°</span>
        <span className="text-slate-600">·</span>
        <span>LON: {(rotation.current.lon * 57.3).toFixed(1)}°</span>
        <span className="text-slate-600">·</span>
        <span className="text-emerald-400">MAPA GLOBAL SATELLITE ONLINE</span>
      </div>

      {/* Camera & Navigation Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-lg border border-cyan-500/30">
        <button
          onClick={() => setProjection(projection === '3d' ? '2d' : '3d')}
          className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
          title={projection === '3d' ? 'Mudar para Projeção Plana 2D' : 'Mudar para Globo 3D'}
        >
          {projection === '3d' ? <Globe className="w-4 h-4 text-cyan-400" /> : <Compass className="w-4 h-4 text-emerald-400" />}
        </button>
        <button
          onClick={() => (zoomLevel.current = Math.min(2.5, zoomLevel.current + 0.2))}
          className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => (zoomLevel.current = Math.max(0.65, zoomLevel.current - 0.2))}
          className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            rotation.current = { lon: 0.9, lat: 0.25 };
            zoomLevel.current = 1.0;
          }}
          className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
          title="Resetar Orientação"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Toggle Bar (Bottom Dock) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-cyan-500/30 max-w-[95vw] shadow-2xl">
        <span className="text-[11px] font-mono font-semibold uppercase text-slate-400 tracking-wider mr-1">
          Camadas:
        </span>

        {/* Continents & Landmasses Layer */}
        <button
          onClick={() => toggleLayer('continents')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.continents
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Continentes & Costas</span>
        </button>

        {/* 3D Topography / Ridges */}
        <button
          onClick={() => toggleLayer('terrain_3d')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.terrain_3d
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>Relevo 3D</span>
        </button>

        {/* Subsea Cables */}
        <button
          onClick={() => toggleLayer('cables')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.cables
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Cable className="w-3.5 h-3.5" />
          <span>Cabos Submarinos</span>
        </button>

        {/* ADS-B Air */}
        <button
          onClick={() => toggleLayer('sdk_air')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.sdk_air
              ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Voos ADS-B</span>
        </button>

        {/* AIS Naval */}
        <button
          onClick={() => toggleLayer('sdk_naval')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.sdk_naval
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>Rotas Navais</span>
        </button>

        {/* Day / Night Terminator */}
        <button
          onClick={() => toggleLayer('day_night')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.day_night
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Dia / Noite</span>
        </button>

        {/* Public CCTV */}
        <button
          onClick={() => toggleLayer('cctv')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.cctv
              ? 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>CCTV Global</span>
        </button>

        {/* Geohazards */}
        <button
          onClick={() => toggleLayer('geohazards')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.geohazards
              ? 'bg-red-500/20 text-red-300 border-red-400/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Sismos USGS</span>
        </button>

        {/* GDELT Intel */}
        <button
          onClick={() => toggleLayer('gdelt')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all border ${
            layers.gdelt
              ? 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
              : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>GDELT Intel</span>
        </button>
      </div>

      {/* Selected Entity Inspector Card */}
      {selectedEntity && (
        <div className="absolute top-16 right-4 z-30 w-80 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-cyan-500/40 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Telemetria // {selectedEntity.type}
            </span>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedEntity.type === 'hub' && (
            <div className="space-y-1.5 text-slate-300">
              <div className="text-sm font-bold text-cyan-300">{selectedEntity.name} ({selectedEntity.country})</div>
              <div>Categoria: <span className="text-emerald-400 uppercase font-semibold">{selectedEntity.category === 'hq' ? 'Centro de Comando Central' : 'Hub de Telecom & Inteligência'}</span></div>
              <div>Status: <span className="text-emerald-400">100% OPERACIONAL / CONECTADO</span></div>
              <div>Coordenadas: <span className="text-white">{selectedEntity.lat.toFixed(2)}°, {selectedEntity.lon.toFixed(2)}°</span></div>
              <div>Latência de Rede: <span className="text-sky-300">4.2 ms</span></div>
            </div>
          )}

          {selectedEntity.type === 'flight' && (
            <div className="space-y-1.5 text-slate-300">
              <div className="text-sm font-bold text-sky-400">{selectedEntity.callsign} ({selectedEntity.airline})</div>
              <div>Rota: <span className="text-white">{selectedEntity.origin} ➔ {selectedEntity.dest}</span></div>
              <div>Altitude: <span className="text-emerald-400">{selectedEntity.alt.toLocaleString()} pés</span></div>
              <div>Velocidade: <span className="text-cyan-400">{selectedEntity.spd} nós (kt)</span></div>
              <div>Proa: <span className="text-white">{selectedEntity.heading}°</span></div>
              <div>Coordenadas: <span className="text-slate-400">{selectedEntity.lat.toFixed(2)}°, {selectedEntity.lon.toFixed(2)}°</span></div>
            </div>
          )}

          {selectedEntity.type === 'vessel' && (
            <div className="space-y-1.5 text-slate-300">
              <div className="text-sm font-bold text-emerald-400">{selectedEntity.name}</div>
              <div>Tipo: <span className="text-white">{selectedEntity.vesselType}</span></div>
              <div>Bandeira: <span className="text-white">{selectedEntity.flag}</span></div>
              <div>Região Estratégica: <span className="text-cyan-300">{selectedEntity.region}</span></div>
              <div>Velocidade: <span className="text-emerald-400">{selectedEntity.spd} nós</span></div>
              <div>Identificador IMO: <span className="text-slate-400">{selectedEntity.id}</span></div>
            </div>
          )}

          {selectedEntity.type === 'cctv' && (
            <div className="space-y-2 text-slate-300">
              <div className="text-sm font-bold text-rose-400">{selectedEntity.name}</div>
              <div>Localização: <span className="text-white">{selectedEntity.city}</span></div>
              <div>Espectadores: <span className="text-emerald-400">{selectedEntity.viewers.toLocaleString()}</span></div>
              <button
                onClick={() => setInspectingCctv(selectedEntity)}
                className="w-full mt-2 py-1.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Expandir Feed de Transmissão
              </button>
            </div>
          )}
        </div>
      )}

      {/* CCTV Live Feed Video Modal */}
      {inspectingCctv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-rose-500/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                TRANSMISSÃO AO VIVO // {inspectingCctv.name}
              </div>
              <button
                onClick={() => setInspectingCctv(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live Camera Visual with HUD Overlay */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />

              {/* High-tech animated camera frame */}
              <div className="absolute top-4 left-4 z-20 font-mono text-[11px] text-white/80 space-y-1">
                <div>FEED ID: {inspectingCctv.id.toUpperCase()}</div>
                <div>LOCAL: {inspectingCctv.city}</div>
                <div>RES: 3840x2160 UHD @ 60FPS</div>
                <div>LAT/LON: {inspectingCctv.lat}°, {inspectingCctv.lon}°</div>
              </div>

              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                AO VIVO
              </div>

              {/* Dynamic Camera Grid & Crosshairs */}
              <div className="absolute inset-8 border border-white/10 pointer-events-none">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-400" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-rose-400" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-rose-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-400" />
              </div>

              {/* Realistic Ambient CCTV Motion Graphic */}
              <div className="text-center space-y-2 z-10">
                <Camera className="w-12 h-12 text-rose-500/60 mx-auto animate-pulse" />
                <div className="text-sm font-mono text-slate-300 font-semibold">
                  Sinal de Vídeo Seguro Sincronizado
                </div>
                <div className="text-xs font-mono text-slate-500">
                  Latência nominal: 14ms · Protocolo RTSP / WebRTC Telemetria Osiris
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div>Espectadores simultâneos: <span className="text-white font-bold">{inspectingCctv.viewers.toLocaleString()}</span></div>
              <button
                onClick={() => setInspectingCctv(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors"
              >
                Fechar Visualizador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
