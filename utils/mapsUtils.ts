// Generate platform-aware maps link
export const openMapsLink = (address: string): void => {
  const encodedAddress = encodeURIComponent(address);

  // Detect iOS/macOS for Apple Maps, otherwise use Google Maps
  const isAppleDevice = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);

  let mapsUrl: string;

  if (isAppleDevice) {
    // Apple Maps with query parameter
    mapsUrl = `https://maps.apple.com/?q=${encodedAddress}`;
  } else {
    // Google Maps search
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  }

  // Open in new tab
  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
};
