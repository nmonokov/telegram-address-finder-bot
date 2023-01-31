export interface CoordinateResponse {
    results: Result[];
    status: string;
}

export interface Result {
    address_components: Component[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    types: string[];
}

export interface Component {
    long_name: string;
    short_name: string;
    types: string[];
}
export interface Geometry {
    bounds: CoordinateSet;
    location: Coordinates;
    location_type: string;
    viewport: CoordinateSet;
}

export interface CoordinateSet {
    northeast: Coordinates;
    southwest: Coordinates;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface UserData {
    city?: string;
    coordinates: Coordinates;
    proximityThreshold: number;
}
