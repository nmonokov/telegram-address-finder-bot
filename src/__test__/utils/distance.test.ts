import { isNear } from '../../utils/distance';

describe('distance test', () => {
  const threshold = 500;

  test('distance::isNear === true', () => {
    expect(isNear(
      { lat: 49.223839, lng: 28.435827 },
      { lat: 49.225436, lng: 28.441465 },
      threshold)).toBeTruthy();
    expect(isNear(
      { lat: 49.223839, lng: 28.435827 },
      { lat: 49.220102, lng: 28.437007 },
      threshold)).toBeTruthy();
    expect(isNear(
      { lat: 49.223839, lng: 28.435827 },
      { lat: 49.225189, lng: 28.430055 },
      threshold)).toBeTruthy();
    expect(isNear(
      { lat: 49.223839, lng: 28.435827 },
      { lat: 49.228255, lng: 28.435446 },
      threshold)).toBeTruthy();
  });

  test('distance::isNear === false', () => {
    expect(isNear(
      { lat: 49.223839, lng: 28.435827 },
      { lat: 49.230562, lng: 28.435197 },
      threshold)).toBeFalsy();
    expect(isNear(
      { lat: 49.223839, lng: 28.435827 },
      { lat: 49.225039, lng: 28.420290 },
      threshold)).toBeFalsy();
    expect(isNear(
      { lat: 49.223839, lng: 28.435827 },
      { lat: 49.233683, lng: 28.465075 },
      threshold)).toBeFalsy();
    expect(isNear(
      { lat: 49.223839, lng: 28.435827 },
      { lat: 49.217676, lng: 28.438543 },
      threshold)).toBeFalsy();
  });
});
