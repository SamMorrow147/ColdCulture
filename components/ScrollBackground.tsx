"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FADE_DURATION = 600; // Scroll distance over which the fade happens

export default function ScrollBackground({
  imagePath = "/Heroimage.png", // Update this with your actual filename
}: {
  imagePath?: string;
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    gsap.set(bg, {
      opacity: 0,
      scale: 1.2,
      transformOrigin: "center center",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bg.parentElement ?? document.body,
        start: "top top",
        end: `+=${FADE_DURATION}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(bg, {
      opacity: 1,
      scale: 1,
      ease: "none",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${imagePath})`,
        zIndex: 1,
        opacity: 0,
        willChange: "transform, opacity",
        WebkitBackfaceVisibility: "hidden",
        WebkitPerspective: 1000,
      }}
      aria-hidden
    />
  );
}
