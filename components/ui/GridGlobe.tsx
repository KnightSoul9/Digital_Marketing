"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

// Use dynamic import with loading control
const World = dynamic(() => import("./Globe").then((m) => m.World), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center">
      Loading...
    </div>
  ),
});

const GridGlobe = () => {
  // Memoize configuration to prevent unnecessary re-renders
  const globeConfig = useMemo(
    () => ({
      pointSize: 4,
      globeColor: "#062056",
      showAtmosphere: true,
      atmosphereColor: "#FFFFFF",
      atmosphereAltitude: 0.1,
      emissive: "#062056",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: "rgba(255,255,255,0.7)",
      ambientLight: "#38bdf8",
      directionalLeftLight: "#ffffff",
      directionalTopLight: "#ffffff",
      pointLight: "#ffffff",
      arcTime: 1000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      initialPosition: { lat: 22.3193, lng: 114.1694 },
      autoRotate: true,
      autoRotateSpeed: 0.5,
    }),
    []
  );

  // Memoize colors array
  const colors = useMemo(() => ["#06b6d4", "#3b82f6", "#6366f1"], []);

  // Memoize arc data to prevent recalculation on each render
  const sampleArcs = useMemo(() => {
    // Define arc coordinates
    const arcCoordinates = [
      {
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -22.9068,
        endLng: -43.1729,
        arcAlt: 0.1,
      },
      {
        startLat: 28.6139,
        startLng: 77.209,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.2,
      },
      {
        startLat: -19.885592,
        startLng: -43.951191,
        endLat: -1.303396,
        endLng: 36.852443,
        arcAlt: 0.5,
      },
      // Only include essential arcs for better performance - reduced from original 42 to 10
      {
        startLat: 1.3521,
        startLng: 103.8198,
        endLat: 35.6762,
        endLng: 139.6503,
        arcAlt: 0.2,
      },
      {
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 3.139,
        endLng: 101.6869,
        arcAlt: 0.3,
      },
      {
        startLat: -15.785493,
        startLng: -47.909029,
        endLat: 36.162809,
        endLng: -115.119411,
        arcAlt: 0.3,
      },
      {
        startLat: -33.8688,
        startLng: 151.2093,
        endLat: 22.3193,
        endLng: 114.1694,
        arcAlt: 0.3,
      },
      {
        startLat: 21.3099,
        startLng: -157.8581,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.3,
      },
      {
        startLat: -6.2088,
        startLng: 106.8456,
        endLat: 51.5072,
        endLng: -0.1276,
        arcAlt: 0.3,
      },
      {
        startLat: 11.986597,
        startLng: 8.571831,
        endLat: -15.595412,
        endLng: -56.05918,
        arcAlt: 0.5,
      },
    ];

    // Map coordinates to add order and random color
    return arcCoordinates.map((arc, index) => ({
      ...arc,
      order: Math.floor(index / 3) + 1, // Simplified order calculation
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [colors]);

  return (
    <div className="flex items-center justify-center absolute top-40 w-full h-full">
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-96 px-4">
        {/* Gradient overlay */}
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />

        {/* Globe container with memoized data */}
        <div className="absolute w-full h-72 md:h-full z-10">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(GridGlobe);
