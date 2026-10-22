import React, { useRef, useEffect, useState } from 'react';
import { useJarvisTheme } from '../theme/ThemeContext';
import { JarvisActivityStatus } from '../types/jarvis';

interface JarvisAvatarProps {
  status: JarvisActivityStatus;
  audioLevel?: number; // 0 to 1
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const JarvisAvatar: React.FC<JarvisAvatarProps> = ({
  status,
  audioLevel = 0,
  onClick,
  size = 'md',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { colors } = useJarvisTheme();

  // Mouse coordinates state (normalized -1 to 1)
  const targetLook = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentLook = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const blinkState = useRef<{ isBlinking: boolean; blinkProgress: number }>({ isBlinking: false, blinkProgress: 0 });
  const nextBlinkTime = useRef<number>(Date.now() + 3000);
  const wakeAnimation = useRef<number>(1.0); // 1 = fully awake

  // Dimensions based on size
  const canvasDimensions = size === 'sm' ? 140 : size === 'lg' ? 260 : 190;

  // Track mouse anywhere on window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Convert to normalized coordinates [-1, 1]
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      targetLook.current = { x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main 60 FPS animation loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.03;
      const now = Date.now();

      // 1. Smooth interpolation of look direction (exponential lerp)
      const lerpSpeed = colors.highPerformanceMode ? 0.12 : 0.08;
      currentLook.current.x += (targetLook.current.x - currentLook.current.x) * lerpSpeed;
      currentLook.current.y += (targetLook.current.y - currentLook.current.y) * lerpSpeed;

      // 2. Natural blinking scheduler
      if (now > nextBlinkTime.current && !blinkState.current.isBlinking) {
        blinkState.current.isBlinking = true;
        blinkState.current.blinkProgress = 0;
      }

      if (blinkState.current.isBlinking) {
        blinkState.current.blinkProgress += 0.18;
        if (blinkState.current.blinkProgress >= 1) {
          blinkState.current.isBlinking = false;
          blinkState.current.blinkProgress = 0;
          nextBlinkTime.current = now + 2500 + Math.random() * 4000;
        }
      }

      const blinkClosure = blinkState.current.isBlinking
        ? Math.sin(blinkState.current.blinkProgress * Math.PI)
        : 0;

      // 3. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Head offset based on gaze (slight 3D parallax tilt)
      const headYaw = currentLook.current.x * 14;
      const headPitch = currentLook.current.y * 10;
      const breathing = Math.sin(time * 1.5) * 2.5;

      const headX = centerX + headYaw;
      const headY = centerY + headPitch + breathing;

      // 4. Ambient Holographic Halo / Glow
      if (!colors.highPerformanceMode) {
        const glowRadius = canvasDimensions * 0.45;
        const radialGrad = ctx.createRadialGradient(headX, headY, 10, headX, headY, glowRadius);
        const glowOpacity = status === 'listening' ? 0.35 : status === 'speaking' ? 0.3 : 0.16;
        radialGrad.addColorStop(0, `${colors.glow}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}`);
        radialGrad.addColorStop(0.7, `${colors.primary}10`);
        radialGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(headX, headY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Outer Synaptic Data Rings (Thinking / Active state)
      if (status === 'thinking' || status === 'listening') {
        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(time * 0.8);
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 12]);
        ctx.beginPath();
        ctx.arc(0, 0, canvasDimensions * 0.44, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 6. Draw Sophisticated Adult Humanoid Facial Structure
      ctx.save();
      ctx.translate(headX, headY);

      // Skull / Jawline polygonal holographic contour
      ctx.strokeStyle = `${colors.avatarFace}90`;
      ctx.lineWidth = 1.4;
      ctx.fillStyle = `${colors.background}cc`;

      // Head contour path
      ctx.beginPath();
      // Forehead
      ctx.moveTo(-42, -50);
      ctx.quadraticCurveTo(0, -68, 42, -50);
      // Temples & Cheekbones
      ctx.lineTo(46, -18);
      ctx.lineTo(38, 22);
      // Chiseled adult jawline
      ctx.lineTo(18, 54);
      ctx.lineTo(0, 60); // Chin center
      ctx.lineTo(-18, 54);
      ctx.lineTo(-38, 22);
      ctx.lineTo(-46, -18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sophisticated facial facet lines (Geodesic / holographic wireframe)
      ctx.strokeStyle = `${colors.avatarFace}35`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 3]);

      // Cheekbone structure lines
      ctx.beginPath();
      ctx.moveTo(-42, -18);
      ctx.lineTo(-18, 12);
      ctx.lineTo(0, 24);
      ctx.lineTo(18, 12);
      ctx.lineTo(42, -18);
      ctx.stroke();

      // Forehead neural facet
      ctx.beginPath();
      ctx.moveTo(-28, -48);
      ctx.lineTo(0, -32);
      ctx.lineTo(28, -48);
      ctx.stroke();

      // Jaw facet lines to chin
      ctx.beginPath();
      ctx.moveTo(-18, 12);
      ctx.lineTo(-8, 52);
      ctx.moveTo(18, 12);
      ctx.lineTo(8, 52);
      ctx.stroke();
      ctx.setLineDash([]); // reset dash

      // 7. Nose Bridge (Chiseled, elegant)
      ctx.strokeStyle = `${colors.avatarFace}70`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(currentLook.current.x * 2.5, 12);
      ctx.lineTo(currentLook.current.x * 3.5, 16);
      ctx.stroke();

      // 8. Eyebrows (Focused, intelligent posture)
      const browOffset = status === 'listening' ? -3 : status === 'thinking' ? 1 : 0;
      ctx.strokeStyle = `${colors.avatarFace}95`;
      ctx.lineWidth = 1.8;

      // Left eyebrow
      ctx.beginPath();
      ctx.moveTo(-32, -24 + browOffset);
      ctx.quadraticCurveTo(-20, -28 + browOffset, -8, -23 + browOffset);
      ctx.stroke();

      // Right eyebrow
      ctx.beginPath();
      ctx.moveTo(8, -23 + browOffset);
      ctx.quadraticCurveTo(20, -28 + browOffset, 32, -24 + browOffset);
      ctx.stroke();

      // 9. Interactive Eye Assemblies (Track cursor coordinates x, y)
      const eyeSpacing = 20;
      const eyeY = -12;
      const eyeWidth = 14;
      const eyeHeight = Math.max(1, 9 * (1 - blinkClosure));

      // Eye parallax look offset (clamped to stay inside eye socket)
      const pupilLookX = currentLook.current.x * 4.5;
      const pupilLookY = currentLook.current.y * 3.2;

      // Helper to render one eye
      const drawEye = (xCenter: number) => {
        ctx.save();
        ctx.translate(xCenter, eyeY);

        // Eye socket outer rim
        ctx.strokeStyle = `${colors.avatarFace}80`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, eyeWidth, eyeHeight, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Eye sclera background
        ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
        ctx.fill();

        // Only draw pupil/iris if eye is open
        if (eyeHeight > 2.5) {
          // Iris glow
          const irisRadius = 4.2;
          ctx.beginPath();
          ctx.arc(pupilLookX, pupilLookY, irisRadius, 0, Math.PI * 2);
          ctx.fillStyle = colors.avatarEyes;
          ctx.shadowColor = colors.avatarEyes;
          ctx.shadowBlur = colors.highPerformanceMode ? 0 : 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner high-intensity pupil
          ctx.beginPath();
          ctx.arc(pupilLookX, pupilLookY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Glint reflection
          ctx.beginPath();
          ctx.arc(pupilLookX - 1.2, pupilLookY - 1.2, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
        }

        ctx.restore();
      };

      // Draw Left and Right Eyes
      drawEye(-eyeSpacing);
      drawEye(eyeSpacing);

      // 10. Mouth & Speech Audio Reactive Modulation
      const mouthY = 36;
      ctx.strokeStyle = `${colors.avatarFace}aa`;
      ctx.lineWidth = 1.5;

      if (status === 'speaking') {
        // Natural speech modulation responsive to audioLevel
        const openAmount = Math.max(2, (audioLevel || Math.abs(Math.sin(time * 8))) * 7);
        ctx.beginPath();
        ctx.ellipse(0, mouthY, 10, openAmount, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
        ctx.fill();
        ctx.stroke();
      } else {
        // Calm, composed neutral mouth line
        ctx.beginPath();
        ctx.moveTo(-11, mouthY);
        ctx.quadraticCurveTo(0, mouthY + 1.5, 11, mouthY);
        ctx.stroke();
      }

      // 11. Subtle holographic scanline beam over face
      if (!colors.highPerformanceMode) {
        const scanY = ((time * 30) % 120) - 60;
        ctx.strokeStyle = `${colors.glow}20`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-36, scanY);
        ctx.lineTo(36, scanY);
        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, status, audioLevel, canvasDimensions]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      {/* Interactive Avatar Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasDimensions}
        height={canvasDimensions}
        onClick={onClick}
        title="Avatar Humanoide do JARVIS — Olhos e cabeça rastreiam o cursor em tempo real"
        className="cursor-pointer transition-transform duration-300 group-hover:scale-102 focus:outline-none"
        style={{
          filter: `drop-shadow(0 0 ${colors.highPerformanceMode ? '4px' : '14px'} ${colors.glow}40)`,
        }}
      />

      {/* State label readout */}
      <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono-tech tracking-wider uppercase">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: status === 'speaking' ? '#10b981' : status === 'listening' ? '#f59e0b' : colors.primary,
            boxShadow: `0 0 6px ${colors.primary}`,
          }}
        />
        <span style={{ color: colors.primary }} className="font-bold">
          {status === 'listening'
            ? 'ESCUTANDO VOZ'
            : status === 'thinking'
            ? 'RACIOCINANDO'
            : status === 'speaking'
            ? 'FALANDO'
            : status === 'alert'
            ? 'ALERTA GLOBAL'
            : 'JARVIS ONLINE'}
        </span>
      </div>
    </div>
  );
};
