"use client";
import { useCallback, useRef } from 'react';

export interface ExportData {
  url: string;
  blob: Blob;
  extension: string;
}

export function useVideoExport() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  /**
   * Captures a canvas stream and returns a video blob.
   * Supports an optional onProgress callback (0 to 100).
   */
  const startRecording = useCallback((
    canvas: HTMLCanvasElement, 
    durationMs: number = 5000, 
    onProgress?: (percent: number) => void
  ): Promise<ExportData> => {
    return new Promise((resolve, reject) => {
      if (!canvas) {
        reject(new Error("No canvas provided"));
        return;
      }

      try {
        // Capture at 30fps. 
        // For WebGL, captureStream(30) is generally better than 0 to avoid race conditions.
        const stream = (canvas as any).captureStream(30);
        
        // Define candidates. WebM is often more stable for canvas capture across all platforms.
        // We prioritize it unless MP4 is explicitly better supported.
        const candidates = [
          { mime: 'video/mp4; codecs="avc1.42E01E"', ext: 'mp4' },
          { mime: 'video/mp4',                         ext: 'mp4' },
          { mime: 'video/webm; codecs=vp9',            ext: 'webm' },
          { mime: 'video/webm; codecs=vp8',            ext: 'webm' },
          { mime: 'video/webm',                        ext: 'webm' },
        ];

        const chosen = candidates.find(c => MediaRecorder.isTypeSupported(c.mime));
        const mimeType = chosen?.mime ?? 'video/webm';
        const extension = chosen?.ext ?? 'webm';

        console.log('useVideoExport: Starting', { mimeType, durationMs });

        mediaRecorderRef.current = new MediaRecorder(stream, { 
          mimeType,
          videoBitsPerSecond: 5000000 // 5Mbps is a safe middle-ground for quality/stability
        });
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
            console.debug(`useVideoExport: Data chunk: ${e.data.size} bytes`);
          }
        };

        let timerId: any = null;
        let progressTimer: any = null;

        mediaRecorderRef.current.onstop = () => {
          if (timerId) clearTimeout(timerId);
          if (progressTimer) clearInterval(progressTimer);

          const finalBlob = new Blob(chunksRef.current, { 
            type: extension === 'mp4' ? 'video/mp4' : 'video/webm' 
          });
          
          console.log('useVideoExport: Stopped', { 
            totalSize: finalBlob.size, 
            chunks: chunksRef.current.length 
          });

          if (finalBlob.size === 0) {
            return reject(new Error("Export failed: generated video is 0 bytes. Check if the window was active during recording."));
          }

          const url = URL.createObjectURL(finalBlob);
          resolve({ url, blob: finalBlob, extension });
        };

        mediaRecorderRef.current.onerror = (err) => {
          console.error("MediaRecorder Error:", err);
          reject(err);
        };

        // Progress Tracking
        const startTime = Date.now();
        progressTimer = setInterval(() => {
          if (onProgress) {
            const elapsed = Date.now() - startTime;
            const percent = Math.min(Math.round((elapsed / durationMs) * 100), 99);
            onProgress(percent);
          }
        }, 100);

        mediaRecorderRef.current.start(1000);

        timerId = setTimeout(() => {
          if (onProgress) onProgress(100);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
          }
        }, durationMs);

      } catch (err) {
        console.error("useVideoExport Error:", err);
        reject(err);
      }
    });
  }, []);

  return { startRecording };
}
