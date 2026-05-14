export interface Place {
  fsq_place_id: string;
  latitude: number;
  longitude: number;
  name: string;
  categories: { name: string }[];
  location: { formatted_address: string };
  geocodes: { main: { latitude: number; longitude: number } };
  distance?: number;
  rating?: number;
  photos?: { id: string; prefix: string; suffix: string }[];
  tips?: { text: string; created_at: string }[];
}

export interface CacheEntry {
  data: Place[];
  timestamp: number;
}
