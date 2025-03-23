"use client";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  const shader = `
    float animation_speed_factor = ${animationSpeed.toFixed(1)};
    float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
    opacity *= step(intro_offset, u_time * animation_speed_factor);
    opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
  `;

  return (
    <div className={cn("h-full relative bg-white w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize}
          opacities={opacities}
          shader={shader}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  // Memoize uniforms to prevent unnecessary recalculations
  const uniforms = useMemo(() => {
    // Create color array based on input colors
    let colorsArray = [];
    if (colors.length === 1) {
      colorsArray = Array(6).fill(colors[0]);
    } else if (colors.length === 2) {
      colorsArray = [...Array(3).fill(colors[0]), ...Array(3).fill(colors[1])];
    } else if (colors.length === 3) {
      colorsArray = [
        ...Array(2).fill(colors[0]),
        ...Array(2).fill(colors[1]),
        ...Array(2).fill(colors[2]),
      ];
    }

    // Convert colors to normalized values (0-1 instead of 0-255)
    const normalizedColors = colorsArray.map((color) => [
      color[0] / 255,
      color[1] / 255,
      color[2] / 255,
    ]);

    return {
      u_colors: {
        value: normalizedColors,
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
    };
  }, [colors, opacities, totalSize, dotSize]);

  // Prepare shader source with center logic
  const shaderSource = useMemo(() => {
    return `
      precision mediump float;
      in vec2 fragCoord;

      uniform float u_time;
      uniform float u_opacities[10];
      uniform vec3 u_colors[6];
      uniform float u_total_size;
      uniform float u_dot_size;
      uniform vec2 u_resolution;
      out vec4 fragColor;
      float PHI = 1.61803398874989484820459;
      float random(vec2 xy) {
          return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
      }
      float map(float value, float min1, float max1, float min2, float max2) {
          return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
      }
      void main() {
          vec2 st = fragCoord.xy;
          ${
            center.includes("x")
              ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
              : ""
          }
          ${
            center.includes("y")
              ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
              : ""
          }
    float opacity = step(0.0, st.x);
    opacity *= step(0.0, st.y);

    vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

    float frequency = 5.0;
    float show_offset = random(st2);
    float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
    opacity *= u_opacities[int(rand * 10.0)];
    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

    vec3 color = u_colors[int(show_offset * 6.0)];

    ${shader}

    fragColor = vec4(color, opacity);
    fragColor.rgb *= fragColor.a;
      }`;
  }, [center, shader]);

  return <Shader source={shaderSource} uniforms={uniforms} maxFps={60} />;
};

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Memoize vertex shader to prevent recreating on each render
  const vertexShader = useMemo(
    () => `
    precision mediump float;
    in vec2 coordinates;
    uniform vec2 u_resolution;
    out vec2 fragCoord;
    void main(){
      float x = position.x;
      float y = position.y;
      gl_Position = vec4(x, y, 0.0, 1.0);
      fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
      fragCoord.y = u_resolution.y - fragCoord.y;
    }
  `,
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const timestamp = clock.getElapsedTime();
    // Skip frame if we haven't reached the next frame time based on maxFps
    if (timestamp - lastFrameTimeRef.current < 1 / maxFps) {
      return;
    }

    lastFrameTimeRef.current = timestamp;

    const material: any = ref.current.material;
    if (material && material.uniforms && material.uniforms.u_time) {
      material.uniforms.u_time.value = timestamp;
    }
  });

  // Create the material once and reuse it
  const material = useMemo(() => {
    const preparedUniforms: any = {};

    // Process uniforms once
    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value as number[]),
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: (uniform.value as number[][]).map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value as number[]),
          };
          break;
      }
    }

    // Add required uniforms
    preparedUniforms["u_time"] = { value: 0 };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: source,
      uniforms: preparedUniforms,
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });
  }, [source, uniforms, size.width, size.height, vertexShader]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

interface ShaderProps {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};
