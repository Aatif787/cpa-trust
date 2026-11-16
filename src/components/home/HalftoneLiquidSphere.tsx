"use client";

import { useEffect, useRef } from "react";

interface RGB {
  r: number;
  g: number;
  b: number;
}

const PALETTE = {
  deepNavy: { r: 37, g: 59, b: 112 },      // #253B70
  electricBlue: { r: 54, g: 123, b: 250 }, // #367BFA
  skyBlue: { r: 101, g: 201, b: 255 },     // #65C9FF
  cyan: { r: 66, g: 229, b: 213 },         // #42E5D5
  lavender: { r: 185, g: 165, b: 210 },    // #B9A5D2
  violet: { r: 136, g: 102, b: 216 },      // #8866D8
  limeGreen: { r: 168, g: 207, b: 120 },   // #A8CF78
  warmOrange: { r: 241, g: 154, b: 85 },   // #F19A55
  pearlWhite: { r: 255, g: 255, b: 255 },  // #FFFFFF
} as const satisfies Record<string, RGB>;

interface PulseWave {
  nx: number;
  ny: number;
  radius: number;
  strength: number;
}

const IS_DEV = process.env.NODE_ENV !== "production";

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mixChannel(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Interactive 3D Multicolour Halftone Liquid Sphere background canvas.
 * Renders a Fibonacci-lattice 3D sphere of circular dots with smooth spatial
 * blue/cyan/lavender/violet + subtle lime/orange/white halftone shading,
 * neighbor-coupled elastic liquid membrane physics, and global pointer tracking.
 */
export function HalftoneLiquidSphere({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = reducedMotionQuery.matches;

    let width = Math.max(canvas.clientWidth || canvas.parentElement?.clientWidth || 320, 320);
    let height = Math.max(canvas.clientHeight || canvas.parentElement?.clientHeight || 360, 360);
    let isMobile = width < 768;

    const createSphere = (count: number) => {
      const bx = new Float32Array(count);
      const by = new Float32Array(count);
      const bz = new Float32Array(count);

      // Rotated 3D coordinates reused each frame (zero allocation)
      const rotXArr = new Float32Array(count);
      const rotYArr = new Float32Array(count);
      const rotZArr = new Float32Array(count);

      // Elastic liquid surface displacement & velocity (in unit-sphere units)
      const dx = new Float32Array(count);
      const dy = new Float32Array(count);
      const dz = new Float32Array(count);

      const vx = new Float32Array(count);
      const vy = new Float32Array(count);
      const vz = new Float32Array(count);

      // Local excitation & wave energy [0..1]
      const energy = new Float32Array(count);

      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (2 * i) / (count - 1);
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = goldenAngle * i;
        bx[i] = Math.cos(theta) * r;
        by[i] = y;
        bz[i] = Math.sin(theta) * r;
      }

      // Precompute 4 nearest neighbors on the unit sphere so surface tension waves propagate
      const neighbors = new Int16Array(count * 4);
      for (let i = 0; i < count; i++) {
        const ax = bx[i];
        const ay = by[i];
        const az = bz[i];

        let b0 = 0;
        let b1 = 0;
        let b2 = 0;
        let b3 = 0;
        let d0 = 9;
        let d1 = 9;
        let d2 = 9;
        let d3 = 9;

        for (let j = 0; j < count; j++) {
          if (i === j) continue;
          const distSq =
            (bx[j] - ax) * (bx[j] - ax) +
            (by[j] - ay) * (by[j] - ay) +
            (bz[j] - az) * (bz[j] - az);
          if (distSq < d0) {
            d3 = d2; b3 = b2;
            d2 = d1; b2 = b1;
            d1 = d0; b1 = b0;
            d0 = distSq; b0 = j;
          } else if (distSq < d1) {
            d3 = d2; b3 = b2;
            d2 = d1; b2 = b1;
            d1 = distSq; b1 = j;
          } else if (distSq < d2) {
            d3 = d2; b3 = b2;
            d2 = distSq; b2 = j;
          } else if (distSq < d3) {
            d3 = distSq; b3 = j;
          }
        }

        const base = i * 4;
        neighbors[base] = b0;
        neighbors[base + 1] = b1;
        neighbors[base + 2] = b2;
        neighbors[base + 3] = b3;
      }

      return {
        count,
        bx,
        by,
        bz,
        rotXArr,
        rotYArr,
        rotZArr,
        dx,
        dy,
        dz,
        vx,
        vy,
        vz,
        energy,
        neighbors,
      };
    };

    let sphere = createSphere(isMobile ? 580 : 1320);

    const metrics = () => {
      const mobile = width < 768;
      const cx = mobile ? width * 0.52 : width * 0.5;
      const cy = mobile ? height * 0.35 : height * 0.5;
      const radius = mobile
        ? Math.min(width * 0.44, height * 0.3, 210)
        : Math.min(width * 0.26, height * 0.43, 360);
      return { cx, cy, radius, mobile };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width || canvas.parentElement?.clientWidth || 320, 320);
      height = Math.max(rect.height || canvas.parentElement?.clientHeight || 360, 360);
      const nextMobile = width < 768;
      if (nextMobile !== isMobile) {
        isMobile = nextMobile;
        sphere = createSphere(isMobile ? 580 : 1320);
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Pointer tracking state in canvas-local CSS pixels (zero React re-renders)
    let rawPx = width * 0.5;
    let rawPy = height * 0.5;
    let smoothPx = rawPx;
    let smoothPy = rawPy;
    let pvx = 0;
    let pvy = 0;
    let pointerActive = false;
    let pointerDecay = 0;
    let hasMovedOnce = false;
    const waves: PulseWave[] = [];
    let wakeLoop = () => {};

    const updatePointerFromClient = (clientX: number, clientY: number, isImpulse = false) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Exact CSS scale mapping relative to canvas box
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const nextX = (clientX - rect.left) * scaleX;
      const nextY = (clientY - rect.top) * scaleY;

      const insideCanvasBand =
        nextX >= -90 &&
        nextX <= width + 90 &&
        nextY >= -90 &&
        nextY <= height + 90;

      if (!insideCanvasBand) {
        pointerActive = false;
        return;
      }

      if (!hasMovedOnce) {
        smoothPx = nextX;
        smoothPy = nextY;
        hasMovedOnce = true;
      }

      rawPx = nextX;
      rawPy = nextY;
      pointerActive = true;
      pointerDecay = 1;

      if (isImpulse) {
        const { cx, cy, radius } = metrics();
        waves.push({
          nx: (nextX - cx) / Math.max(radius, 1),
          ny: (nextY - cy) / Math.max(radius, 1),
          radius: 0.03,
          strength: 1,
        });
        if (waves.length > 4) waves.shift();
      }

      wakeLoop();
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointerFromClient(e.clientX, e.clientY, false);
    };

    const onPointerDown = (e: PointerEvent) => {
      updatePointerFromClient(e.clientX, e.clientY, true);
    };

    const onMouseMoveFallback = (e: MouseEvent) => {
      updatePointerFromClient(e.clientX, e.clientY, false);
    };

    const onPointerLeave = () => {
      pointerActive = false;
      wakeLoop();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      updatePointerFromClient(t.clientX, t.clientY, false);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      updatePointerFromClient(t.clientX, t.clientY, true);
    };

    const onTouchEnd = () => {
      pointerActive = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousemove", onMouseMoveFallback, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    let visible = true;
    let tabHidden = document.hidden;

    const ro = new ResizeObserver(() => {
      resize();
      if (prefersReduced) {
        drawFrame(0, 0);
      }
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      tabHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Pre-allocated sort order indices
    let order = new Int16Array(sphere.count);
    for (let i = 0; i < sphere.count; i++) order[i] = i;

    // Reusable velocity-diffusion scratch buffers to propagate liquid waves cleanly
    let tmpVx = new Float32Array(sphere.count);
    let tmpVy = new Float32Array(sphere.count);
    let tmpVz = new Float32Array(sphere.count);

    let lastDebugUpdate = 0;

    const drawFrame = (timeSec: number, dt: number) => {
      if (order.length !== sphere.count) {
        order = new Int16Array(sphere.count);
        for (let i = 0; i < sphere.count; i++) order[i] = i;
        tmpVx = new Float32Array(sphere.count);
        tmpVy = new Float32Array(sphere.count);
        tmpVz = new Float32Array(sphere.count);
      }

      const { cx, cy, radius } = metrics();
      const {
        count,
        bx,
        by,
        bz,
        rotXArr,
        rotYArr,
        rotZArr,
        dx,
        dy,
        dz,
        vx,
        vy,
        vz,
        energy,
        neighbors,
      } = sphere;

      // Smoothly interpolate tracked cursor position & measure sweep velocity
      const prevPx = smoothPx;
      const prevPy = smoothPy;
      const lerp = dt > 0 ? Math.min(1, dt * 18) : 1;
      smoothPx += (rawPx - smoothPx) * lerp;
      smoothPy += (rawPy - smoothPy) * lerp;

      const curPvx = (smoothPx - prevPx) / Math.max(radius * dt, 1);
      const curPvy = (smoothPy - prevPy) / Math.max(radius * dt, 1);
      pvx += (clamp(curPvx, -4, 4) - pvx) * 0.25;
      pvy += (clamp(curPvy, -4, 4) - pvy) * 0.25;

      if (!pointerActive) {
        pointerDecay = Math.max(0, pointerDecay - dt * 2.2);
      }

      for (let w = waves.length - 1; w >= 0; w--) {
        waves[w].radius += dt * 1.35;
        waves[w].strength *= Math.pow(0.24, dt);
        if (waves[w].strength < 0.03 || waves[w].radius > 2.2) {
          waves.splice(w, 1);
        }
      }

      // Slow organic rotation & breathing (suppressed when reduced motion is enabled)
      const rotY = prefersReduced ? 0 : timeSec * 0.09;
      const rotX = prefersReduced ? 0 : Math.sin(timeSec * 0.22) * 0.1;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // 110–160 CSS pixel liquid influence radius tuned by sphere scale
      const interactRadius = isMobile
        ? clamp(radius * 0.62, 100, 132)
        : clamp(radius * 0.45, 130, 160);

      const springK = 14.0;
      const damping = Math.pow(0.035, dt);

      let affectedDots = 0;
      let maxDispNorm = 0;

      // Step 1: Rotate dots, store rotated positions, and apply liquid cursor & ripple targets
      for (let i = 0; i < count; i++) {
        const rx = bx[i] * cosY + bz[i] * sinY;
        const rz0 = -bx[i] * sinY + bz[i] * cosY;
        const ry = by[i] * cosX - rz0 * sinX;
        const rz = by[i] * sinX + rz0 * cosX;

        const idleSwell = prefersReduced
          ? 0
          : 0.018 * Math.sin(rx * 3.1 + timeSec * 1.1) * Math.cos(ry * 2.8 - timeSec * 0.85) +
            0.012 * Math.cos(rz * 3.6 + timeSec * 0.7);

        const baseX = rx * (1 + idleSwell);
        const baseY = ry * (1 + idleSwell);
        const baseZ = rz * (1 + idleSwell);

        rotXArr[i] = baseX;
        rotYArr[i] = baseY;
        rotZArr[i] = baseZ;

        let targetX = 0;
        let targetY = 0;
        let targetZ = 0;

        if (dt > 0) {
          if (pointerDecay > 0.01 && baseZ > -0.25) {
            const restSx = cx + baseX * radius;
            const restSy = cy + baseY * radius;
            const pdx = restSx - smoothPx;
            const pdy = restSy - smoothPy;
            const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

            if (pDist < interactRadius) {
              affectedDots++;
              const normDist = pDist / interactRadius;
              const invDist = pDist > 0.5 ? 1 / pDist : 0;
              const ux = pdx * invDist;
              const uy = pdy * invDist;

              // Strong inner repulsion parting + subtle outer meniscus attraction + travelling wave
              const corePush = smoothstep(0.88, 0.04, normDist);
              const outerRim = Math.sin(clamp01((normDist - 0.58) / 0.42) * Math.PI) * -0.045;
              const ripple = Math.sin(normDist * 11 - timeSec * 7.2) * 0.032 * (1 - normDist);

              // ~45–68 CSS pixel peak displacement on desktop sphere while held or gliding
              const pushMag = (corePush * 0.22 + outerRim + ripple) * pointerDecay;

              targetX = ux * pushMag + pvx * corePush * 0.045 * pointerDecay;
              targetY = uy * pushMag + pvy * corePush * 0.045 * pointerDecay;
              targetZ = (-corePush * 0.24 + ripple * 1.6) * pointerDecay;

              energy[i] = Math.min(
                1,
                Math.max(energy[i], (corePush * 0.92 + Math.abs(ripple) * 3.5) * pointerDecay)
              );
            }
          }

          // Propagating click/tap ripples across sphere surface
          for (let w = 0; w < waves.length; w++) {
            const wave = waves[w];
            const dnx = baseX - wave.nx;
            const dny = baseY - wave.ny;
            const dWave = Math.sqrt(dnx * dnx + dny * dny);
            const band = Math.abs(dWave - wave.radius);
            if (band < 0.24 && baseZ > -0.15) {
              const wFalloff = Math.sin((1 - band / 0.24) * (Math.PI * 0.5)) * wave.strength;
              const invD = dWave > 0.001 ? 1 / dWave : 0;
              vx[i] += dnx * invD * wFalloff * dt * 4.8;
              vy[i] += dny * invD * wFalloff * dt * 4.8;
              vz[i] += wFalloff * dt * 3.2;
              energy[i] = Math.min(1, Math.max(energy[i], wFalloff));
            }
          }

          // Elastic spring toward liquid contour (or back to 0 when pointer is away)
          const ax = (targetX - dx[i]) * springK;
          const ay = (targetY - dy[i]) * springK;
          const az = (targetZ - dz[i]) * springK;

          vx[i] = (vx[i] + ax * dt) * damping;
          vy[i] = (vy[i] + ay * dt) * damping;
          vz[i] = (vz[i] + az * dt) * damping;
        }
      }

      // Step 2: Connected neighbor velocity & energy diffusion (spreads movement fluidly to adjacent dots)
      if (dt > 0) {
        tmpVx.set(vx);
        tmpVy.set(vy);
        tmpVz.set(vz);

        const waveCouple = clamp(dt * 11, 0, 0.35);

        for (let i = 0; i < count; i++) {
          const nBase = i * 4;
          const n0 = neighbors[nBase];
          const n1 = neighbors[nBase + 1];
          const n2 = neighbors[nBase + 2];
          const n3 = neighbors[nBase + 3];

          const avgVx = 0.25 * (tmpVx[n0] + tmpVx[n1] + tmpVx[n2] + tmpVx[n3]);
          const avgVy = 0.25 * (tmpVy[n0] + tmpVy[n1] + tmpVy[n2] + tmpVy[n3]);
          const avgVz = 0.25 * (tmpVz[n0] + tmpVz[n1] + tmpVz[n2] + tmpVz[n3]);

          vx[i] += (avgVx - vx[i]) * waveCouple;
          vy[i] += (avgVy - vy[i]) * waveCouple;
          vz[i] += (avgVz - vz[i]) * waveCouple;

          dx[i] += vx[i] * dt;
          dy[i] += vy[i] * dt;
          dz[i] += vz[i] * dt;

          // Propagate color/luminous energy gently across neighbors and decay smoothly
          const avgE = 0.25 * (energy[n0] + energy[n1] + energy[n2] + energy[n3]);
          const dispMag = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i] + dz[i] * dz[i]);
          if (dispMag > maxDispNorm) maxDispNorm = dispMag;

          energy[i] = clamp01(
            Math.max(energy[i] * Math.pow(0.2, dt), avgE * 0.78) +
              Math.min(0.8, dispMag * 3.5) * dt * 2.2
          );
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric glow behind sphere
      const bgGlow = ctx.createRadialGradient(
        cx - radius * 0.22,
        cy - radius * 0.22,
        radius * 0.08,
        cx,
        cy,
        radius * 1.15
      );
      bgGlow.addColorStop(0, "rgba(101, 201, 255, 0.22)");
      bgGlow.addColorStop(0.55, "rgba(54, 123, 250, 0.11)");
      bgGlow.addColorStop(1, "rgba(37, 59, 112, 0)");
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Soft luminous wave glow centered at pointer when interacting with sphere
      if (pointerDecay > 0.02) {
        const dPtrCenter = Math.hypot(smoothPx - cx, smoothPy - cy);
        if (dPtrCenter < radius * 1.25) {
          const ptrRing = ctx.createRadialGradient(
            smoothPx,
            smoothPy,
            2,
            smoothPx,
            smoothPy,
            interactRadius
          );
          ptrRing.addColorStop(0, `rgba(255, 255, 255, ${(0.24 * pointerDecay).toFixed(3)})`);
          ptrRing.addColorStop(0.45, `rgba(66, 229, 213, ${(0.18 * pointerDecay).toFixed(3)})`);
          ptrRing.addColorStop(1, "rgba(54, 123, 250, 0)");
          ctx.fillStyle = ptrRing;
          ctx.beginPath();
          ctx.arc(smoothPx, smoothPy, interactRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Key light from upper-left front
      const lx = -0.56;
      const ly = -0.54;
      const lz = 0.63;
      const baseDotMax = Math.max(2.1, radius * (isMobile ? 0.022 : 0.0145));

      // Sort accurately by final *rotated + displaced* Z depth (back to front)
      order.sort((a, b) => (rotZArr[a] + dz[a]) - (rotZArr[b] + dz[b]));

      for (let k = 0; k < count; k++) {
        const i = order[k];
        const nx = rotXArr[i] + dx[i];
        const ny = rotYArr[i] + dy[i];
        const nz = rotZArr[i] + dz[i];

        if (nz < -0.18) continue;

        const facing = smoothstep(-0.18, 0.35, nz);
        const pxPos = cx + nx * radius;
        const pyPos = cy + ny * radius;

        const normLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        const snx = nx / normLen;
        const sny = ny / normLen;
        const snz = nz / normLen;

        const lambert = Math.max(0, snx * lx + sny * ly + snz * lz);
        const halfZ = (lz + 1) * 0.5;
        const specDot = Math.max(0, snx * (lx * 0.5) + sny * (ly * 0.5) + snz * halfZ);
        const spec = Math.pow(specDot, 16);

        const eVal = energy[i];
        const flowPhase = timeSec * 0.32 + eVal * 2.1;
        const cyanBand = smoothstep(-0.35, 0.72, Math.sin(snx * 2.2 - sny * 1.5 + snz * 1.1 + flowPhase));
        const lavenderBand = smoothstep(0.18, 0.92, Math.cos(sny * 2.3 + snx * 1.6 - flowPhase * 0.9));
        const violetPocket = smoothstep(0.3, 0.92, Math.sin(snx * 2.6 + sny * 2.1 + snz * 1.5 - flowPhase * 0.8));
        const limeCaustic = smoothstep(0.56, 0.95, Math.sin(snx * 2.8 - sny * 2.4 + snz * 0.8 + timeSec * 0.48 + dx[i] * 5));
        const orangeCaustic = smoothstep(0.62, 0.97, Math.cos(sny * 2.7 - snx * 2.2 - timeSec * 0.42 + dy[i] * 5));

        let r = mixChannel(PALETTE.electricBlue.r, PALETTE.cyan.r, cyanBand * 0.82);
        let g = mixChannel(PALETTE.electricBlue.g, PALETTE.cyan.g, cyanBand * 0.82);
        let b = mixChannel(PALETTE.electricBlue.b, PALETTE.cyan.b, cyanBand * 0.82);

        const skyT = smoothstep(0.28, 0.96, lambert) * 0.65;
        r = mixChannel(r, PALETTE.skyBlue.r, skyT);
        g = mixChannel(g, PALETTE.skyBlue.g, skyT);
        b = mixChannel(b, PALETTE.skyBlue.b, skyT);

        // Violet & Lavender react subtly to deformation wave
        const violetT = clamp01(violetPocket * 0.72 + eVal * 0.24);
        r = mixChannel(r, PALETTE.violet.r, violetT);
        g = mixChannel(g, PALETTE.violet.g, violetT);
        b = mixChannel(b, PALETTE.violet.b, violetT);

        const lavT = clamp01(lavenderBand * 0.62 + eVal * 0.22);
        r = mixChannel(r, PALETTE.lavender.r, lavT);
        g = mixChannel(g, PALETTE.lavender.g, lavT);
        b = mixChannel(b, PALETTE.lavender.b, lavT);

        const limeT = limeCaustic * 0.56;
        r = mixChannel(r, PALETTE.limeGreen.r, limeT);
        g = mixChannel(g, PALETTE.limeGreen.g, limeT);
        b = mixChannel(b, PALETTE.limeGreen.b, limeT);

        const orangeT = orangeCaustic * 0.52;
        r = mixChannel(r, PALETTE.warmOrange.r, orangeT);
        g = mixChannel(g, PALETTE.warmOrange.g, orangeT);
        b = mixChannel(b, PALETTE.warmOrange.b, orangeT);

        const shadowMix = clamp01((1 - facing) * 0.82 + (1 - lambert) * 0.36);
        r = mixChannel(r, PALETTE.deepNavy.r, shadowMix);
        g = mixChannel(g, PALETTE.deepNavy.g, shadowMix);
        b = mixChannel(b, PALETTE.deepNavy.b, shadowMix);

        // Active liquid ripple shifts excited dots visibly toward Cyan & Pearl White
        if (eVal > 0.01) {
          r = mixChannel(r, PALETTE.cyan.r, eVal * 0.58);
          g = mixChannel(g, PALETTE.cyan.g, eVal * 0.58);
          b = mixChannel(b, PALETTE.cyan.b, eVal * 0.58);
        }

        const whiteSpec = clamp01(spec * 0.85 + eVal * 0.6);
        r = mixChannel(r, PALETTE.pearlWhite.r, whiteSpec);
        g = mixChannel(g, PALETTE.pearlWhite.g, whiteSpec);
        b = mixChannel(b, PALETTE.pearlWhite.b, whiteSpec);

        if (pointerDecay > 0.02) {
          const dPtrX = pxPos - smoothPx;
          const dPtrY = pyPos - smoothPy;
          const dPtr = Math.sqrt(dPtrX * dPtrX + dPtrY * dPtrY);
          const ptrGlow = smoothstep(interactRadius * 0.95, 0, dPtr) * pointerDecay * 0.58;
          if (ptrGlow > 0) {
            r = mixChannel(r, PALETTE.pearlWhite.r, ptrGlow);
            g = mixChannel(g, PALETTE.pearlWhite.g, ptrGlow);
            b = mixChannel(b, PALETTE.pearlWhite.b, ptrGlow);
          }
        }

        const depthSize = Math.pow(Math.max(0.08, facing), 0.56);
        const lightSize = 0.42 + 0.58 * lambert + 0.24 * spec + 0.36 * eVal;
        const dotRadius = Math.max(0.68, baseDotMax * depthSize * lightSize);

        const alpha = clamp01((0.26 + 0.7 * depthSize) * (0.72 + 0.28 * lambert + eVal * 0.28));

        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pxPos, pyPos, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Development-only telemetry readout (zero React state updates)
      if (IS_DEV && debugRef.current && timeSec - lastDebugUpdate > 0.06) {
        lastDebugUpdate = timeSec;
        const strengthPx = (maxDispNorm * radius).toFixed(1);
        debugRef.current.textContent = `Sphere Debug · ${pointerActive ? "ACTIVE" : "IDLE"} · ptr=(${Math.round(smoothPx)}, ${Math.round(smoothPy)}) · affected=${affectedDots} · disp=${strengthPx}px`;
      }

      return pointerActive || pointerDecay > 0.004 || waves.length > 0 || maxDispNorm > 0.0006;
    };

    // Initial static frame for instant paint and reduced motion
    drawFrame(0, 0);

    let rafId = 0;
    let lastTs = performance.now();

    const loop = (now: number) => {
      rafId = 0;
      if (!visible || tabHidden) {
        lastTs = now;
        if (!prefersReduced || pointerActive || pointerDecay > 0.004 || waves.length > 0) {
          rafId = window.requestAnimationFrame(loop);
        }
        return;
      }
      const dt = Math.min(0.032, Math.max(0.004, (now - lastTs) / 1000));
      lastTs = now;
      const stillActive = drawFrame(now * 0.001, dt);
      if (!prefersReduced || stillActive) {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    wakeLoop = () => {
      if (!rafId) {
        lastTs = performance.now();
        rafId = window.requestAnimationFrame(loop);
      }
    };

    if (!prefersReduced) {
      wakeLoop();
    }

    const onReducedChange = () => {
      prefersReduced = reducedMotionQuery.matches;
      if (!prefersReduced) {
        wakeLoop();
      }
    };
    reducedMotionQuery.addEventListener("change", onReducedChange);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousemove", onMouseMoveFallback);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onReducedChange);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        data-halftone-sphere="true"
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[2] h-full w-full ${className}`}
      />
      {IS_DEV ? (
        <div
          ref={debugRef}
          aria-hidden="true"
          className="pointer-events-none fixed bottom-3 left-14 z-50 rounded-full bg-[#0d2140]/85 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-sm"
        >
          Sphere Debug · IDLE
        </div>
      ) : null}
    </>
  );
}
