"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Object3DNode, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

type GlobePoint = {
  size: number;
  order: number;
  color: (t: number) => string;
  lat: number;
  lng: number;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

// Move outside component to avoid recreation
const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(
    shorthandRegex,
    (m, r, g, b) => r + r + g + g + b + b
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const genRandomNumbers = (min: number, max: number, count: number) => {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);

  // Memoize default props to avoid recreating on each render
  const defaultProps = useMemo(
    () => ({
      pointSize: 1,
      atmosphereColor: "#ffffff",
      showAtmosphere: true,
      atmosphereAltitude: 0.1,
      polygonColor: "rgba(255,255,255,0.7)",
      globeColor: "#1d072e",
      emissive: "#000000",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig]
  );

  // Memoize the points data calculation to avoid unnecessary recalculations
  const globeData = useMemo<GlobePoint[]>(() => {
    const points: GlobePoint[] = [];

    for (let i = 0; i < data.length; i++) {
      const arc = data[i];
      const rgb = hexToRgb(arc.color);

      if (rgb) {
        const colorFn = (t: number) =>
          `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`;

        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: colorFn,
          lat: arc.startLat,
          lng: arc.startLng,
        });

        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: colorFn,
          lat: arc.endLat,
          lng: arc.endLng,
        });
      }
    }

    // Remove duplicates for same lat and lng
    return points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as keyof GlobePoint] === v[k as keyof GlobePoint]
          )
        ) === i
    );
  }, [data, defaultProps.pointSize]);

  // Build material once when properties change
  const buildMaterial = useCallback(() => {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };

    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
  }, [
    defaultProps.globeColor,
    defaultProps.emissive,
    defaultProps.emissiveIntensity,
    defaultProps.shininess,
  ]);

  // Set up globe visualization properties
  const configureGlobe = useCallback(() => {
    if (!globeRef.current || !globeData.length) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);
  }, [
    globeData,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
  ]);

  // Configure arcs and points
  const configureArcsAndPoints = useCallback(() => {
    if (!globeRef.current || !globeData.length) return;

    // Configure arcs with proper type annotations
    globeRef.current
      .arcsData(data)
      .arcStartLat((d: unknown) => (d as Position).startLat)
      .arcStartLng((d: unknown) => (d as Position).startLng)
      .arcEndLat((d: unknown) => (d as Position).endLat)
      .arcEndLng((d: unknown) => (d as Position).endLng)
      .arcColor((d: unknown) => (d as Position).color)
      .arcAltitude((d: unknown) => (d as Position).arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((d: unknown) => (d as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    // Configure points with proper type annotations
    globeRef.current
      .pointsData(globeData)
      .pointColor((d: unknown) => (d as GlobePoint).color(0))
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    // Configure rings with proper type annotations
    globeRef.current
      .ringsData([])
      .ringColor((d: unknown) => (t: number) => (d as GlobePoint).color(t))
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      );
  }, [
    globeData,
    data,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.maxRings,
    defaultProps.rings,
  ]);

  // Initialize globe when component mounts
  useEffect(() => {
    if (globeRef.current && globeData.length) {
      buildMaterial();
      configureGlobe();
      configureArcsAndPoints();
    }
  }, [buildMaterial, configureGlobe, configureArcsAndPoints, globeData]);

  // Handle ring animation with requestAnimationFrame for better performance
  useEffect(() => {
    if (!globeRef.current || !globeData.length) return;

    let animationFrameId: number;
    let lastUpdateTime = 0;
    const updateInterval = 2000; // 2 seconds

    const updateRings = (timestamp: number) => {
      if (timestamp - lastUpdateTime >= updateInterval) {
        if (globeRef.current && globeData.length) {
          const numbersOfRings = genRandomNumbers(
            0,
            globeData.length,
            Math.floor((globeData.length * 4) / 5)
          );

          globeRef.current.ringsData(
            globeData.filter((_, i) => numbersOfRings.includes(i))
          );
        }
        lastUpdateTime = timestamp;
      }

      animationFrameId = requestAnimationFrame(updateRings);
    };

    animationFrameId = requestAnimationFrame(updateRings);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [globeData]);

  return <threeGlobe ref={globeRef} />;
}

// WebGL renderer configuration component with optimized dependencies
export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size]);

  return null;
}

// Memoize scene creation
export function World({ globeConfig, data }: WorldProps) {
  // Create scene only once using useMemo
  const scene = useMemo(() => {
    const newScene = new Scene();
    newScene.fog = new Fog(0xffffff, 400, 2000);
    return newScene;
  }, []);

  // Create camera once
  const camera = useMemo(
    () => new PerspectiveCamera(50, aspect, 180, 1800),
    []
  );

  return (
    <Canvas scene={scene} camera={camera}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe globeConfig={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

// Export utility functions
export { hexToRgb, genRandomNumbers };
