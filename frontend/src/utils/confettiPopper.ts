import React from 'react';

/**
 * Triggers a 360-degree Party Popper / Confetti Burst starting from the click event origin
 */
export function triggerConfettiPopper(event?: React.MouseEvent) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  // Origin point: click position or center of screen
  let originX = width / 2;
  let originY = height / 2;

  if (event && event.clientX && event.clientY) {
    originX = event.clientX;
    originY = event.clientY;
  }

  const colors = [
    '#FF4D6D', '#FF758F', '#FFB3C1', '#D4AF37', '#F3E5AB', 
    '#2C523C', '#40826D', '#E2F1E7', '#FFD700', '#FF69B4', '#FF85A1'
  ];

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    shape: 'rect' | 'circle' | 'heart' | 'ribbon';
    opacity: number;
    gravity: number;
    drag: number;
  }

  const particles: Particle[] = [];
  const particleCount = 75;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = Math.random() * 14 + 6;
    const shapes: Array<'rect' | 'circle' | 'heart' | 'ribbon'> = ['rect', 'circle', 'heart', 'ribbon'];

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (Math.random() * 5 + 3), // upward popper thrust
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      opacity: 1,
      gravity: 0.22,
      drag: 0.95
    });
  }

  let animationFrameId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    let activeParticles = 0;

    particles.forEach(p => {
      if (p.opacity <= 0) return;
      activeParticles++;

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy = (p.vy * p.drag) + p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.016;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'ribbon') {
        ctx.fillRect(-p.size / 4, -p.size, p.size / 3, p.size * 2.2);
      } else if (p.shape === 'heart') {
        ctx.beginPath();
        const topCurveHeight = p.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, p.size, 0, p.size);
        ctx.bezierCurveTo(0, p.size, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight);
        ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
      }

      ctx.restore();
    });

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  render();
}
