import { Coordinates } from '../models';

/**
 * Function that calculates the Haversine distance between two points
 * and returns true if the distance is less than a specified threshold
 *
 * @param currentCoordinates of the user
 * @param coordinatesToCompare incoming coordinates for a comparison
 * @param threshold value in meters
 */
export const isNear = (currentCoordinates: Coordinates,
                       coordinatesToCompare: Coordinates,
                       threshold: number) => {
  const toRadians = (degree: number) => degree * Math.PI / 180;
  const earthRadius = 6371e3; // Earth's radius in meters

  const lat1Rad = toRadians(currentCoordinates.lat);
  const lat2Rad = toRadians(coordinatesToCompare.lat);
  const deltaLat = toRadians(coordinatesToCompare.lat - currentCoordinates.lat);
  const deltaLng = toRadians(coordinatesToCompare.lng - currentCoordinates.lng);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance < threshold;
};

