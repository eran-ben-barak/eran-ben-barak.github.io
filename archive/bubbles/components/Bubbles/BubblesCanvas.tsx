import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BubblesState } from '../../app/toolbox/bubbles/BubblesClient';
import { useVideoExport, ExportData } from '../../utils/useVideoExport';

export interface BubblesCanvasRef {
  exportVideo: (onProgress?: (p: number) => void) => Promise<ExportData>;
}

interface Props {
  state: BubblesState;
  isRecording: boolean;
}

const MAX_PARTICLES = 250;

// Custom shader for raymarching metaballs
const BubblesShaderMaterial = {
  uniforms: {
    uPositions: { value: Array(MAX_PARTICLES).fill(0).map(() => new THREE.Vector3()) }, 
    uRadii: { value: Array(MAX_PARTICLES).fill(0).map(() => 0) },     
    uCount: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uTime: { value: 0 },
    uMode: { value: 0 }, // 0: BW, 1: Color
    uTheme: { value: 0 }, // 0: Dark, 1: Light
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uPositions[${MAX_PARTICLES}];
    uniform float uRadii[${MAX_PARTICLES}];
    uniform int uCount;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform int uMode;
    uniform int uTheme;
    varying vec2 vUv;

    // High quality smooth min for organic merging
    float smin(float a, float b, float k) {
      float h = max(k - abs(a - b), 0.0) / k;
      return min(a, b) - h * h * h * k * (1.0 / 6.0);
    }

    float sdSphere(vec3 p, float r) {
      return length(p) - r;
    }

    float map(vec3 p) {
      float d = 1000.0;
      float k = 1.0; 
      for (int i = 0; i < ${MAX_PARTICLES}; i++) {
        if (i >= uCount) break;
        float dSphere = sdSphere(p - uPositions[i], uRadii[i]);
        d = smin(d, dSphere, k);
      }
      return d;
    }

    vec3 calcNormal(vec3 p) {
      vec2 e = vec2(0.001, 0.0);
      return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
      ));
    }

    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.263, 0.416, 0.557);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
      vec3 ro = vec3(0.0, 0.0, 15.0);
      vec3 rd = normalize(vec3(uv, -1.0));

      float t = 0.0;
      float d = 0.0;
      bool hit = false;
      for (int i = 0; i < 90; i++) {
        d = map(ro + rd * t);
        if (d < 0.002) {
          hit = true;
          break;
        }
        t += d;
        if (t > 40.0) break;
      }

      if (hit) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 viewDir = normalize(ro - p);
        
        // High specular glossiness
        vec3 light1 = normalize(vec3(10.0, 10.0, 10.0));
        vec3 light2 = normalize(vec3(-10.0, -5.0, 5.0));
        
        float diff = max(dot(n, light1), 0.0) * 0.4 + max(dot(n, light2), 0.0) * 0.2;
        
        vec3 refl1 = reflect(-light1, n);
        vec3 refl2 = reflect(-light2, n);
        float spec = pow(max(dot(viewDir, refl1), 0.0), 128.0) * 2.0;
        spec += pow(max(dot(viewDir, refl2), 0.0), 64.0) * 0.8;
        
        float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.5);
        
        if (uMode == 1) { // Color mode
          vec3 irid = palette(fresnel * 0.3 + uTime * 0.08);
          // Oily reflective look
          vec3 col = mix(vec3(0.05), irid, fresnel * 0.85);
          col += spec;
          if (uTheme == 1) col = mix(col, vec3(1.0), 0.15);
          gl_FragColor = vec4(col, 1.0);
        } else { // BW Mode
          vec3 col;
          float shine = spec + fresnel * 1.0;
          if (uTheme == 0) { // Dark: White bubbles on black theme
             // Brighter base to look like white/silver bubbles
             col = vec3(0.25) + diff * 0.3 + shine;
          } else { // Light: High contrast dark forms
             col = vec3(0.01) + diff * 0.05 + shine * 0.6;
             col = mix(col, vec3(0.05), 0.3);
          }
          gl_FragColor = vec4(col, 1.0);
        }
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }
  `
};

const BubblesInternal = ({ state, isRecording }: { state: BubblesState, isRecording: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();
  
  const particleCount = 200; 
  const pData = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 2),
      vel: new THREE.Vector3(),
      target: new THREE.Vector3(),
      baseRadius: 0.5,
      radiusWeight: 1.0, 
      offset: Math.random() * 100
    }));
  }, []);

  const [targets, setTargets] = useState<{ pos: THREE.Vector3, weight: number }[]>([]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1024;
    const h = 512;
    canvas.width = w;
    canvas.height = h;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    
    const fontName = state.fontFamily || 'Monoklass';
    ctx.font = `bold ${w / (state.text.length * 0.9 + 1)}px "${fontName}", sans-serif`;
    ctx.fillText(state.text, w/2, h/2);

    const imageData = ctx.getImageData(0, 0, w, h).data;
    const points: { x: number, y: number }[] = [];
    const step = 8;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (imageData[(y * w + x) * 4 + 3] > 128) {
          points.push({ x, y });
        }
      }
    }

    // Rough distance transform to find "center" vs "edge"
    // For each point, find distance to nearest transparent pixel
    const processedPoints = points.map(p => {
      let minDist = 1000;
      // Sampling nearby for edge distance (simplified transform)
      const radius = 24; 
      for (let dy = -radius; dy <= radius; dy += 4) {
        for (let dx = -radius; dx <= radius; dx += 4) {
          const nx = p.x + dx;
          const ny = p.y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h || imageData[(ny * w + nx) * 4 + 3] <= 128) {
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < minDist) minDist = d;
          }
        }
      }
      
      const px = ((p.x / w) - 0.5) * 32; 
      const py = (0.5 - (p.y / h)) * 16;
      const weight = Math.min(minDist / radius, 1.0); // 0 at edge, 1 deep inside
      return { pos: new THREE.Vector3(px, py, 0), weight };
    });

    setTargets(processedPoints);
  }, [state.text, state.fontFamily]);

  useFrame((stateObj) => {
    if (!meshRef.current) return;
    const time = stateObj.clock.getElapsedTime();
    const material = meshRef.current.material as THREE.ShaderMaterial;
    
    const posArr: THREE.Vector3[] = material.uniforms.uPositions.value;
    const radArr: number[] = material.uniforms.uRadii.value;

    pData.forEach((p, i) => {
      if (targets.length > 0) {
        const tIdx = Math.floor((i / pData.length) * targets.length);
        p.target.copy(targets[tIdx].pos);
        p.radiusWeight = targets[tIdx].weight; 
      } else {
        p.target.set(0,0,0);
        p.radiusWeight = 0.5;
      }

      // Physics
      const attr = p.target.clone().sub(p.pos);
      p.vel.add(attr.multiplyScalar(0.12 * state.stickiness));
      
      // Randomness
      const n = state.noise;
      p.vel.x += Math.sin(time * state.speed + p.offset) * 0.25 * n;
      p.vel.y += Math.cos(time * state.speed * 1.4 + p.offset) * 0.25 * n;

      p.vel.multiplyScalar(0.82);
      p.pos.add(p.vel.clone().multiplyScalar(state.speed));

      posArr[i].copy(p.pos);
      
      // Dynamic logic: Large in middle (weight=1), small at edges (weight=0)
      const edgeScale = 0.3; // Minimum size at edge relative to max
      const currentWeight = edgeScale + (1.0 - edgeScale) * p.radiusWeight;
      
      // Also apply min/max size from state
      const tRadius = state.minSize + (state.maxSize - state.minSize) * currentWeight;
      
      // Add a tiny organic breathing effect
      radArr[i] = tRadius * (0.95 + Math.sin(time * 0.5 + p.offset) * 0.05);
    });

    material.uniforms.uCount.value = pData.length;
    material.uniforms.uTime.value = time;
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uMode.value = state.mode === 'bw' ? 0 : 1;
    material.uniforms.uTheme.value = state.theme === 'dark' ? 0 : 1;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial 
        args={[BubblesShaderMaterial]} 
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
};

const BubblesCanvas = forwardRef<BubblesCanvasRef, Props>(({ state, isRecording }, ref) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const { startRecording } = useVideoExport();

  useImperativeHandle(ref, () => ({
    exportVideo: async (onProgress?: (p: number) => void) => {
      if (canvasElementRef.current) {
        return await startRecording(canvasElementRef.current, 4000, onProgress);
      }
      throw new Error("Canvas is not ready");
    }
  }));

  return (
    <Canvas
      dpr={[1, isRecording ? 3 : 2]} 
      onCreated={({ gl }) => {
        if (canvasElementRef) {
          (canvasElementRef as any).current = gl.domElement;
        }
      }}
      gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
      camera={{ position: [0, 0, 15], fov: 45 }}
    >
      <BubblesInternal state={state} isRecording={isRecording} />
    </Canvas>
  );
});

BubblesCanvas.displayName = "BubblesCanvas";
export default BubblesCanvas;
