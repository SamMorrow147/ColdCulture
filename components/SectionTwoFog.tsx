"use client";

import { useEffect, useRef } from "react";

const SECTION_TWO_IMAGE =
  "/freepik__a-young-ethnic-woman-in-a-purple-shirt-and-winter-__60532.png";

export default function SectionTwoFog() {
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fog = fogRef.current;
    const sectionTwo = document.getElementById("section-two");
    const sectionThree = document.getElementById("section-three");
    if (!fog || !sectionTwo || !sectionThree) return;

    let rafId: number;
    let lastOpacity = 0;

    function tick() {
      const vh = window.innerHeight;
      const s2Top = sectionTwo!.getBoundingClientRect().top;
      const s3Top = sectionThree!.getBoundingClientRect().top;

      // ── Fade-in zone: section-two top from 12% → -15% of viewport ──
      const inStart = vh * 0.12; // s2Top here → opacity 0
      const inEnd = vh * -0.15; // s2Top here → opacity 1

      // ── Fade-out zone: section-three top from 100% → 85% of viewport ──
      const outStart = vh; // s3Top here → opacity 1
      const outEnd = vh * 0.85; // s3Top here → opacity 0

      let opacity = 0;

      if (s3Top <= outEnd) {
        // Past exit → always 0
        opacity = 0;
      } else if (s3Top < outStart) {
        // Fading out
        opacity = (s3Top - outEnd) / (outStart - outEnd);
      } else if (s2Top <= inEnd) {
        // Fully in, not yet exiting
        opacity = 1;
      } else if (s2Top < inStart) {
        // Fading in
        opacity = 1 - (s2Top - inEnd) / (inStart - inEnd);
      }

      opacity = Math.max(0, Math.min(1, opacity));

      // Only touch the DOM when the value actually changes
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
      className="section-two-fog fixed left-0 right-0 bottom-0 xl:bottom-[6vh] w-full h-[24vh] lg:h-[28vh] xl:h-[30vh] pointer-events-none"
      style={{
        zIndex: 2,
        opacity: 0,
      }}
    >
      {/* Blurred background layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${SECTION_TWO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          filter: "blur(50px)",
          WebkitFilter: "blur(50px)",
        }}
      />
      {/* Full-width bottom band: fog fades up */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage:
            "linear-gradient(to top, black 0%, black 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.12)",
        }}
      />
    </div>
  );
}
