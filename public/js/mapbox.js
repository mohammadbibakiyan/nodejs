
/*esling-disable*/
export const displayMap = (locations) => {
  console.log(locations);
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9oYW1tYWRiaWJha2l5YW4iLCJhIjoiY2w1NmNpZmEyMHZ6dzNxcGJvZm8wdHZpayJ9.iug42z1XPTT_Z0aq2xVTzA';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mohammadbibakiyan/cl56i1uim000d14ptaoh3gw4r', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    enteractive: false,
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
