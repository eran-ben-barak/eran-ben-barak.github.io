import React, { forwardRef, useImperativeHandle, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import MobiusRibbonMesh from './MobiusRibbonMesh';
import { RibbonState } from '../../app/toolbox/twister/MobiusRibbonClient';
import { useVideoExport, ExportData } from '../../utils/useVideoExport';

export interface MobiusRibbonCanvasRef {
  exportVideo: (onProgress?: (p: number) => void) => Promise<ExportData>;
}

interface Props {
  state: RibbonState;
  isRecording: boolean;
}

const MobiusRibbonCanvas = forwardRef<MobiusRibbonCanvasRef, Props>(({ state, isRecording }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { startRecording } = useVideoExport();

  useImperativeHandle(ref, () => ({
    exportVideo: async (onProgress?: (p: number) => void) => {
      if (canvasRef.current) {
        // Perfect loop: 2π / speed = exactly one full 360° rotation
        const rotationDuration = state.speed > 0 ? ((2 * Math.PI) / state.speed) * 1000 : 5000;
        return await startRecording(canvasRef.current, rotationDuration, onProgress);
      }
      throw new Error("Canvas is not ready");
    }
  }));

  return (
    <Canvas
      dpr={[1, 2]} // Limit pixel ratio for performance
      // R3F's internal gl.domElement is the actual <canvas>
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(state.bgColor), 1);
        if (canvasRef) {
          (canvasRef as any).current = gl.domElement;
        }

        // Handle WebGL context loss to allow recovery or at least log it
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          console.warn('Twister: WebGL Context Lost');
        }, false);
      }}
      gl={{ 
        preserveDrawingBuffer: true, 
        alpha: false, 
        antialias: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      }}
      camera={{ position: [0, 5, 20], fov: 45 }}
    >
      <color attach="background" args={[state.bgColor as any]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-10, 10, 5]} intensity={0.5} />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <MobiusRibbonMesh state={state} isRecording={isRecording} />
      <OrbitControls makeDefault enableZoom={true} enablePan={false} />
    </Canvas>
  );
});

MobiusRibbonCanvas.displayName = "MobiusRibbonCanvas";
export default MobiusRibbonCanvas;
