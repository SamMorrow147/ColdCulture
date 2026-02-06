"use client";

import { useEffect, useRef } from "react";

export default function FoggyCorner({
  imagePath = "/Heroimage.png",
}: {
  imagePath?: string;
}) {
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fog = fogRef.current;
    if (!fog) return;

    const sectionTwo = document.getElementById("section-two");

    let rafId: number;
    let lastOpacity = 0;

    function tick() {
      const scrollY = window.scrollY;

      // Fade in: scroll 500 → 700px
      const inStart = 500;
      const inEnd = 700;

      // Fade out: section-two top from 40% → 15% of viewport
      const vh = window.innerHeight;
      const s2Top = sectionTwo
        ? sectionTwo.getBoundingClientRect().top
        : Infinity;
      const outStart = vh * 0.4;
      const outEnd = vh * 0.15;

      let opacity = 0;

      if (s2Top <= outEnd) {
        // Past exit → always 0
        opacity = 0;
      } else if (s2Top < outStart) {
        // Fading out
        opacity = (s2Top - outEnd) / (outStart - outEnd);
      } else if (scrollY >= inEnd) {
        // Fully in, not yet exiting
        opacity = 1;
      } else if (scrollY > inStart) {
        // Fading in
        opacity = (scrollY - inStart) / (inEnd - inStart);
      }

      opacity = Math.max(0, Math.min(1, opacity));

      if (Math.abs(opacity - lastOpacity) > 0.001) {
        fog!.style.opacity = String(opacity);
        lastOpacity = opacity;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={fogRef}
      className="foggy-corner fixed bottom-0 left-0 pointer-events-none"
      style={{
        width: "50vw",
        height: "45vh",
        zIndex: 35,
        opacity: 0,
      }}
    >
      {/* Blurred background layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imagePath})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px)",
          WebkitFilter: "blur(50px)",
        }}
      />
      {/* Circular mask - fades smoothly from corner */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage:
            "radial-gradient(ellipse 120% 140% at bottom left, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 120% 140% at bottom left, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.12)",
        }}
      />
      {/* Dark tint for contrast so type on the left is readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage:
            "radial-gradient(ellipse 120% 140% at bottom left, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 120% 140% at bottom left, black 0%, black 15%, rgba(0,0,0,0.7) 35%, transparent 65%)",
          background: "rgba(0,0,0,0.28)",
        }}
      />
    </div>
  );
}
