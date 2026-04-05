import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { RibbonState } from '../../app/toolbox/twister/MobiusRibbonClient';

interface Props {
  state: RibbonState;
  isRecording: boolean;
}

// Global set to track fonts we've already registered with the browser
const registeredFonts = new Map<string, Promise<void>>();

export default function MobiusRibbonMesh({ state, isRecording }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  // Generate the Canvas Texture with FontFace API
  useEffect(() => {
    let active = true;
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');

    async function loadFontAndDraw() {
      try {
        const url = state.fontUrl;
        const fontId = `TF_${url.split('/').pop()?.split('.')[0]}`;
        
        // Ensure the font is loaded and registered only ONCE per URL
        if (!registeredFonts.has(url)) {
          const loadPromise = (async () => {
             try {
              console.log(`[Twister] Registration: ${fontId}`);
              const font = new FontFace(fontId, `url('${url}')`);
              document.fonts.add(font);
              await font.load();
              console.log(`[Twister] Ready: ${fontId}`);
            } catch (fontErr) {
              console.warn(`[Twister] Load failed: ${url}`, fontErr);
            }
          })();
          registeredFonts.set(url, loadPromise);
        }

        // Wait for the specific font to be ready
        await registeredFonts.get(url);
        // Also wait for browser to be generally ready (handles some hydration quirks)
        await document.fonts.ready;

        if (!active || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Measure required width to encapsulate text
        ctx.font = `180px "${fontId}"`;
        const metrics = ctx.measureText(state.text + ' ');
        
        const textWidth = Math.min(Math.max(metrics.width, 100), 4096); 
        canvas.width = Math.ceil(textWidth);
        canvas.height = 256;
        
        const ctx2 = canvas.getContext('2d');
        if (!ctx2) return;
        ctx2.fillStyle = 'rgba(0,0,0,0)';
        ctx2.clearRect(0, 0, canvas.width, canvas.height);

        // Draw carefully centered text
        ctx2.textAlign = 'center';
        ctx2.textBaseline = 'middle';
        ctx2.font = `180px "${fontId}"`;
        ctx2.fillStyle = state.textColor || '#000000';
        
        if (metrics.width > 4096) {
          ctx2.fillText(state.text + ' ', canvas.width / 2, canvas.height / 2, 4096);
        } else {
          ctx2.fillText(state.text + ' ', canvas.width / 2, canvas.height / 2);
        }

        const physicalRatio = 31.4 / 2.5; 
        const texRatio = canvas.width / canvas.height;

        // Create a FRESH texture object to force R3F to replace the GPU handle
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 4;
        tex.repeat.set(physicalRatio / texRatio, 1);

        if (active) {
          // DISPOSE old texture ONLY if we are about to set a new one
          if (textureRef.current) {
            textureRef.current.dispose();
          }
          textureRef.current = tex;
          setTexture(tex);
        } else {
          tex.dispose();
        }
      } catch (err) {
        console.error("[Twister] Critical error in loadFontAndDraw:", err);
      }
    }

    loadFontAndDraw();

    return () => { 
      active = false; 
    };
  }, [state.text, state.fontUrl, state.textColor]);

  // Generate Mobius Geometry Parametrically
  const geometry = useMemo(() => {
    const twists = state.intensity;
    const mobiusPoint = (u: number, t: number, target: THREE.Vector3) => {
      const width = (t - 0.5) * 2.5;
      const v = u * Math.PI * 2;
      const radius = 5; 
      const x = Math.cos(v) * (radius + width * Math.cos((v * twists) / 2));
      const z = Math.sin(v) * (radius + width * Math.cos((v * twists) / 2));
      const y = width * Math.sin((v * twists) / 2);
      target.set(x, y, z);
    };

    const g = new ParametricGeometry(mobiusPoint, 400, 20); 
    return g;
  }, [state.intensity]);

  // Handle Geometry disposal
  useEffect(() => {
    return () => {
      if (geometry) geometry.dispose();
    };
  }, [geometry]);

  // Animation Loop
  useFrame((stateThree, delta) => {
    if (!groupRef.current || !texture) return;
    
    // Rotate the group
    groupRef.current.rotation.y += delta * state.speed;

    // Scroll the texture along the ribbon
    // To ensure a mathematically PERFECT loop, the texture MUST scroll an exact integer 
    // number of wraps per every 1 full rotation (2π) of the group.
    // 2 wraps per rotation = (state.speed / 2π) * 2
    texture.offset.x -= delta * (state.speed / Math.PI);
  });

  if (!texture) return null;

  return (
    <Center>
      <group ref={groupRef}>
        {Array.from({ length: Math.max(1, state.vStack) }).map((_, v) => {
           return Array.from({ length: Math.max(1, state.hStack) }).map((_, h) => {
             // hStack scales outwards radially
             const scaleFac = 1 + (h * state.stackDistance);
             // vStack shifts upwards/downwards along the Y axis
             const vOffset = (v - (state.vStack - 1) / 2) * (state.stackDistance * 8);
             const rotateTwist = h * 0.1;

             return (
               <mesh key={`${v}-${h}`} geometry={geometry} scale={[scaleFac, scaleFac, scaleFac]} position={[0, vOffset, 0]} rotation={[0, rotateTwist, 0]}>
                 <meshStandardMaterial 
                   map={texture} 
                   side={THREE.DoubleSide} 
                   alphaTest={0.1}
                   transparent={true}
                   roughness={0.4}
                   metalness={0.1}
                   color="#ffffff" 
                 />
               </mesh>
             )
           });
        })}
      </group>
    </Center>
  );
}
