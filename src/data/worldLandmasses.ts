// High-precision geographic coordinates for world continents, coastlines, and landmasses
// Built for Osiris.ai & JARVIS geospatial tactical HUD

export interface GeoPolygon {
  name: string;
  coords: [number, number][]; // [lon, lat] pairs
  isIsland?: boolean;
}

export interface StrategicCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  category: 'hq' | 'hub' | 'intel' | 'relay';
}

export interface MountainRidge {
  name: string;
  coords: [number, number][];
}

// 1. Detailed continental coastline polygons [lon, lat]
export const WORLD_CONTINENT_POLYGONS: GeoPolygon[] = [
  // SOUTH AMERICA
  {
    name: 'South America',
    coords: [
      [-75.2, 11.8], [-72.8, 12.2], [-71.6, 11.8], [-69.8, 12.1], [-62.0, 10.7],
      [-59.8, 6.8], [-57.0, 5.9], [-54.0, 5.8], [-51.0, 0.1], [-48.5, -1.0],
      [-44.3, -2.5], [-38.5, -3.7], [-35.2, -5.5], [-34.8, -7.1], [-35.5, -9.0],
      [-38.5, -13.0], [-39.0, -15.0], [-40.0, -20.0], [-41.0, -21.5], [-43.2, -23.0],
      [-46.3, -24.0], [-48.5, -26.0], [-50.0, -29.0], [-52.1, -32.2], [-53.5, -34.0],
      [-55.0, -35.0], [-57.5, -36.0], [-58.4, -38.0], [-62.0, -39.0], [-65.0, -41.0],
      [-66.0, -44.0], [-67.0, -47.0], [-65.5, -51.0], [-68.5, -53.5], [-67.0, -55.5],
      [-69.0, -56.0], [-71.5, -54.0], [-74.0, -52.5], [-75.0, -49.0], [-74.0, -45.0],
      [-73.5, -41.5], [-72.5, -37.0], [-71.6, -33.0], [-70.5, -28.0], [-70.3, -23.5],
      [-70.2, -18.5], [-75.0, -14.5], [-77.0, -12.0], [-80.0, -6.0], [-81.3, -4.5],
      [-79.9, -2.2], [-80.0, 1.0], [-78.5, 2.5], [-77.5, 7.0], [-77.0, 8.5],
      [-75.2, 11.8]
    ]
  },

  // NORTH AMERICA (Canada, USA, Mexico, Central America)
  {
    name: 'North America',
    coords: [
      [-168.0, 65.5], [-164.0, 67.5], [-156.0, 71.3], [-148.0, 70.5], [-138.0, 69.5],
      [-128.0, 70.0], [-117.0, 68.0], [-108.0, 68.5], [-95.0, 69.0], [-85.0, 69.5],
      [-81.0, 66.0], [-86.0, 62.0], [-94.0, 59.0], [-92.0, 55.0], [-82.0, 52.0],
      [-79.0, 56.0], [-76.0, 62.0], [-68.0, 62.5], [-64.0, 59.0], [-56.0, 53.0],
      [-53.0, 48.0], [-59.0, 46.0], [-64.0, 45.0], [-67.0, 44.5], [-71.0, 42.0],
      [-74.0, 40.5], [-75.5, 38.5], [-76.0, 36.5], [-79.0, 33.5], [-81.0, 31.0],
      [-80.5, 25.5], [-81.5, 25.0], [-83.0, 29.0], [-88.0, 30.5], [-94.0, 29.5],
      [-97.0, 26.0], [-97.5, 22.0], [-96.0, 19.5], [-92.5, 18.5], [-90.5, 20.0],
      [-87.5, 21.5], [-87.0, 18.5], [-83.5, 15.0], [-83.0, 10.0], [-79.5, 9.0],
      [-77.5, 8.0], [-82.5, 8.5], [-85.5, 10.0], [-87.5, 13.0], [-92.5, 14.5],
      [-97.0, 16.0], [-105.0, 20.0], [-106.0, 23.0], [-109.0, 23.5], [-112.0, 28.0],
      [-114.5, 32.0], [-117.2, 32.5], [-122.0, 37.0], [-124.0, 40.0], [-124.5, 46.0],
      [-125.0, 49.0], [-128.0, 52.0], [-131.0, 55.0], [-135.0, 58.0], [-141.0, 60.0],
      [-150.0, 59.5], [-158.0, 56.5], [-164.0, 54.5], [-166.0, 57.0], [-162.0, 60.0],
      [-166.0, 65.0], [-168.0, 65.5]
    ]
  },

  // GREENLAND
  {
    name: 'Greenland',
    isIsland: true,
    coords: [
      [-44.0, 59.8], [-40.0, 63.0], [-35.0, 66.0], [-25.0, 71.0], [-20.0, 76.0],
      [-18.0, 81.0], [-30.0, 83.5], [-45.0, 83.0], [-55.0, 81.0], [-65.0, 78.0],
      [-70.0, 76.0], [-58.0, 72.0], [-52.0, 68.0], [-50.0, 64.0], [-48.0, 61.0],
      [-44.0, 59.8]
    ]
  },

  // AFRICA
  {
    name: 'Africa',
    coords: [
      [-5.8, 35.8], [-1.0, 36.0], [5.0, 37.0], [10.5, 37.0], [11.5, 33.5],
      [15.0, 32.5], [20.0, 32.0], [25.0, 32.0], [30.0, 31.5], [32.5, 31.0],
      [32.5, 27.0], [34.5, 24.0], [38.0, 18.0], [43.0, 12.5], [51.0, 10.5],
      [49.0, 6.0], [44.0, 1.0], [40.0, -4.0], [40.5, -10.0], [36.0, -17.0],
      [33.0, -24.0], [32.0, -28.0], [29.0, -32.0], [26.0, -33.5], [20.0, -34.8],
      [18.5, -34.0], [17.5, -30.0], [14.5, -23.0], [12.0, -16.0], [13.0, -9.0],
      [10.0, -1.0], [9.0, 4.0], [4.5, 5.0], [1.0, 6.0], [-4.0, 5.0],
      [-8.0, 4.5], [-13.0, 9.0], [-16.5, 12.0], [-17.5, 14.8], [-16.5, 19.0],
      [-13.0, 26.0], [-10.0, 29.0], [-6.0, 35.0], [-5.8, 35.8]
    ]
  },

  // MADAGASCAR
  {
    name: 'Madagascar',
    isIsland: true,
    coords: [
      [49.5, -12.0], [50.5, -15.5], [49.0, -20.0], [47.5, -25.0], [44.0, -25.2],
      [43.5, -21.0], [45.0, -16.0], [47.0, -13.5], [49.5, -12.0]
    ]
  },

  // EUROPE
  {
    name: 'Europe',
    coords: [
      [-9.5, 37.0], [-9.0, 41.5], [-8.5, 43.5], [-2.0, 43.5], [-1.0, 46.0],
      [-4.5, 48.5], [1.5, 50.5], [4.0, 51.5], [8.0, 54.0], [9.5, 57.5],
      [12.5, 56.0], [18.0, 54.5], [21.0, 55.5], [24.0, 57.5], [28.0, 60.0],
      [22.0, 65.5], [18.0, 68.5], [13.0, 68.0], [5.0, 62.0], [5.5, 59.0],
      [10.0, 54.5], [14.0, 54.0], [25.0, 45.0], [30.0, 46.5], [35.0, 45.0],
      [38.0, 47.0], [40.0, 44.0], [43.0, 41.5], [35.0, 41.5], [28.0, 41.5],
      [24.0, 39.5], [23.5, 36.5], [21.0, 37.0], [19.0, 41.0], [14.0, 45.0],
      [15.5, 41.0], [18.0, 40.0], [16.0, 38.0], [12.0, 42.0], [9.0, 44.0],
      [4.0, 43.5], [3.0, 42.0], [-0.5, 38.0], [-2.5, 36.5], [-5.5, 36.0],
      [-9.5, 37.0]
    ]
  },

  // BRITISH ISLES (UK & Ireland)
  {
    name: 'Great Britain',
    isIsland: true,
    coords: [
      [-5.0, 50.0], [-3.0, 50.5], [1.5, 51.5], [1.7, 52.5], [0.0, 54.0],
      [-2.0, 57.5], [-3.5, 58.5], [-5.5, 57.0], [-5.0, 55.0], [-3.0, 53.5],
      [-4.5, 52.0], [-5.5, 50.5], [-5.0, 50.0]
    ]
  },
  {
    name: 'Ireland',
    isIsland: true,
    coords: [
      [-6.0, 53.0], [-6.0, 55.0], [-8.5, 55.0], [-10.0, 53.5], [-10.5, 51.5],
      [-8.0, 51.5], [-6.0, 53.0]
    ]
  },

  // ASIA & RUSSIA
  {
    name: 'Asia',
    coords: [
      [30.0, 60.0], [35.0, 65.0], [45.0, 68.0], [60.0, 70.0], [75.0, 73.0],
      [90.0, 74.0], [110.0, 76.0], [130.0, 73.0], [150.0, 71.0], [170.0, 67.0],
      [180.0, 65.0], [170.0, 60.0], [160.0, 56.0], [156.0, 51.0], [143.0, 50.0],
      [136.0, 45.0], [131.0, 43.0], [129.0, 36.0], [126.5, 34.0], [128.5, 38.0],
      [125.0, 40.0], [121.0, 39.0], [118.0, 38.0], [122.0, 32.0], [120.0, 27.0],
      [116.0, 23.0], [110.0, 20.0], [108.0, 15.0], [104.0, 10.0], [101.0, 3.0],
      [98.5, 8.0], [96.0, 17.0], [91.0, 22.0], [87.0, 21.5], [80.5, 16.0],
      [79.8, 10.0], [77.5, 8.2], [73.0, 17.0], [69.0, 24.0], [63.0, 25.0],
      [57.0, 25.5], [54.0, 24.0], [51.0, 26.0], [48.0, 30.0], [50.0, 20.0],
      [45.0, 13.0], [43.0, 13.0], [35.0, 27.0], [35.0, 33.0], [32.0, 31.0],
      [35.0, 36.0], [40.0, 40.0], [50.0, 40.0], [55.0, 50.0], [45.0, 54.0],
      [40.0, 56.0], [30.0, 60.0]
    ]
  },

  // JAPAN (Honshu, Hokkaido, Kyushu)
  {
    name: 'Japan',
    isIsland: true,
    coords: [
      [141.0, 45.5], [145.5, 44.0], [144.0, 42.5], [140.5, 41.5], [141.5, 38.5],
      [140.0, 35.5], [136.0, 34.5], [133.0, 33.0], [130.5, 31.0], [129.5, 33.0],
      [133.0, 35.5], [137.0, 37.0], [140.0, 40.5], [141.0, 45.5]
    ]
  },

  // AUSTRALIA & NEW ZEALAND
  {
    name: 'Australia',
    coords: [
      [131.0, -12.0], [136.0, -12.0], [142.0, -11.0], [145.0, -15.0], [149.0, -21.0],
      [153.5, -28.0], [151.0, -34.0], [148.0, -38.0], [143.0, -39.0], [138.0, -35.5],
      [134.0, -32.5], [128.0, -32.0], [122.0, -34.0], [115.0, -34.5], [114.0, -26.0],
      [118.0, -20.0], [124.0, -16.0], [129.0, -15.0], [131.0, -12.0]
    ]
  },
  {
    name: 'Tasmania',
    isIsland: true,
    coords: [
      [145.0, -41.0], [148.0, -41.0], [148.0, -43.5], [146.0, -43.5], [145.0, -41.0]
    ]
  },
  {
    name: 'New Zealand',
    isIsland: true,
    coords: [
      [173.0, -35.0], [178.0, -37.5], [176.0, -40.0], [174.0, -41.5], [170.0, -43.5],
      [167.0, -46.0], [168.0, -47.0], [171.0, -44.0], [174.0, -41.0], [173.0, -35.0]
    ]
  },

  // INDONESIA & MALAYSIA (Key Islands)
  {
    name: 'Sumatra',
    isIsland: true,
    coords: [
      [95.5, 5.5], [98.5, 3.5], [102.5, 0.5], [106.0, -5.5], [104.0, -5.5],
      [101.5, -3.5], [97.5, 1.5], [95.5, 5.5]
    ]
  },
  {
    name: 'Borneo',
    isIsland: true,
    coords: [
      [110.0, 1.5], [115.0, 4.0], [118.0, 4.5], [119.0, 1.0], [116.5, -3.5],
      [112.0, -3.5], [109.0, -1.0], [110.0, 1.5]
    ]
  },
  {
    name: 'New Guinea',
    isIsland: true,
    coords: [
      [131.0, -1.0], [138.0, -2.5], [144.0, -4.5], [150.0, -9.5], [147.0, -10.0],
      [141.0, -8.5], [136.0, -5.0], [131.0, -1.0]
    ]
  },

  // ANTARCTICA (Outer perimeter contours)
  {
    name: 'Antarctica',
    coords: [
      [-64.0, -64.0], [-60.0, -65.0], [-55.0, -70.0], [-40.0, -74.0], [-20.0, -72.0],
      [0.0, -70.0], [20.0, -69.0], [40.0, -67.0], [60.0, -66.0], [80.0, -66.5],
      [100.0, -65.0], [120.0, -65.5], [140.0, -67.0], [160.0, -70.0], [170.0, -75.0],
      [-170.0, -78.0], [-150.0, -75.0], [-130.0, -74.0], [-110.0, -73.0], [-90.0, -72.0],
      [-80.0, -73.0], [-70.0, -70.0], [-64.0, -64.0]
    ]
  }
];

// 2. High-Tech Strategic Intelligence & Command Hubs (World Metropolises)
export const STRATEGIC_GLOBAL_HUBS: StrategicCity[] = [
  { id: 'hub_sp', name: 'São Paulo', country: 'Brasil', lat: -23.55, lon: -46.63, category: 'hq' },
  { id: 'hub_bsb', name: 'Brasília', country: 'Brasil', lat: -15.79, lon: -47.88, category: 'hub' },
  { id: 'hub_rio', name: 'Rio de Janeiro', country: 'Brasil', lat: -22.90, lon: -43.17, category: 'hub' },
  { id: 'hub_nyc', name: 'New York City', country: 'EUA', lat: 40.71, lon: -74.00, category: 'hub' },
  { id: 'hub_dc', name: 'Washington D.C.', country: 'EUA', lat: 38.90, lon: -77.03, category: 'hq' },
  { id: 'hub_sfo', name: 'Silicon Valley', country: 'EUA', lat: 37.38, lon: -122.08, category: 'intel' },
  { id: 'hub_ldn', name: 'Londres', country: 'Reino Unido', lat: 51.50, lon: -0.12, category: 'hq' },
  { id: 'hub_par', name: 'Paris', country: 'França', lat: 48.85, lon: 2.35, category: 'hub' },
  { id: 'hub_ber', name: 'Berlim', country: 'Alemanha', lat: 52.52, lon: 13.40, category: 'intel' },
  { id: 'hub_tky', name: 'Tóquio', country: 'Japão', lat: 35.68, lon: 139.69, category: 'hq' },
  { id: 'hub_bej', name: 'Beijing', country: 'China', lat: 39.90, lon: 116.40, category: 'intel' },
  { id: 'hub_shg', name: 'Shanghai', country: 'China', lat: 31.23, lon: 121.47, category: 'hub' },
  { id: 'hub_sin', name: 'Cingapura', country: 'Cingapura', lat: 1.35, lon: 103.82, category: 'relay' },
  { id: 'hub_dxb', name: 'Dubai', country: 'EAU', lat: 25.20, lon: 55.27, category: 'hub' },
  { id: 'hub_syd', name: 'Sydney', country: 'Austrália', lat: -33.86, lon: 151.20, category: 'hub' },
  { id: 'hub_del', name: 'Nova Delhi', country: 'Índia', lat: 28.61, lon: 77.20, category: 'hub' },
  { id: 'hub_cpt', name: 'Cape Town', country: 'África do Sul', lat: -33.92, lon: 18.42, category: 'relay' },
  { id: 'hub_sel', name: 'Seul', country: 'Coreia do Sul', lat: 37.56, lon: 126.97, category: 'intel' }
];

// 3. Major Mountain Ridges & Topography Lines (Visible with terrain_3d)
export const TOPOGRAPHY_RIDGES: MountainRidge[] = [
  {
    name: 'Cordilheira dos Andes',
    coords: [
      [-73.0, 10.0], [-75.0, 5.0], [-78.0, 0.0], [-77.0, -5.0], [-75.0, -10.0],
      [-71.0, -15.0], [-68.0, -20.0], [-69.0, -25.0], [-70.0, -30.0], [-70.5, -35.0],
      [-71.0, -40.0], [-72.0, -45.0], [-71.0, -50.0], [-68.0, -54.0]
    ]
  },
  {
    name: 'Montanhas Rochosas',
    coords: [
      [-140.0, 64.0], [-130.0, 58.0], [-120.0, 52.0], [-115.0, 48.0], [-110.0, 44.0],
      [-106.0, 39.0], [-105.0, 35.0], [-103.0, 30.0], [-100.0, 24.0]
    ]
  },
  {
    name: 'Cordilheira do Himalaia',
    coords: [
      [72.0, 36.0], [75.0, 34.0], [80.0, 31.0], [85.0, 28.5], [90.0, 28.0],
      [95.0, 29.0], [100.0, 28.0]
    ]
  },
  {
    name: 'Alpes Europeus',
    coords: [
      [5.5, 45.0], [7.0, 46.0], [9.5, 46.5], [12.0, 47.0], [15.0, 47.0]
    ]
  }
];

// 4. Geodesic Cybernetic Land Dot Matrix
// Generates a dense, accurate radar point-cloud of the world's continents.
// Fast Point-in-Polygon check to seed points precisely on landmasses.
function isPointInPolygon(pt: [number, number], poly: [number, number][]): boolean {
  const [x, y] = pt;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Generate an ultra-fast cached array of world land coordinates
export function generateLandGrid(stepDegrees: number = 3.5): [number, number][] {
  const points: [number, number][] = [];
  const polys = WORLD_CONTINENT_POLYGONS.map(p => p.coords);

  for (let lat = -65; lat <= 78; lat += stepDegrees) {
    // Dynamic longitude density for polar spherical convergence
    const lonStep = Math.max(stepDegrees, stepDegrees / Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += lonStep) {
      for (const poly of polys) {
        if (isPointInPolygon([lon, lat], poly)) {
          points.push([lon, lat]);
          break;
        }
      }
    }
  }
  return points;
}

// Precomputed world land matrix (~1,600 nodes) for 60FPS instant rendering
export const CACHED_LAND_GRID: [number, number][] = generateLandGrid(3.2);
