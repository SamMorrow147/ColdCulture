"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ZoomFigure({
  imagePath = "/CenterFigure.png",
}: {
  imagePath?: string;
}) {
  const figureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    // Calculate positions
    const startX = window.innerWidth * 0.8; // Right side
    const startY = window.innerHeight * 1.1; // Below viewport
    const endX = window.innerWidth * 0.6; // Right of center
    const endY = window.innerHeight * 1.15; // Lower - extends below viewport

    // Start state
    gsap.set(figure, {
      position: "fixed",
      left: 0,
      top: 0,
      width: "600px",
      height: "800px",
      x: startX,
      y: startY,
      xPercent: -50,
      yPercent: -100,
      scale: 3,
      transformOrigin: "top left",
      zIndex: 20,
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: figure.parentElement ?? document.body,
        start: "top top-=200",
        end: "+=500",
        scrub: true,
      },
    });

    tl.to(figure, { opacity: 1, duration: 0.1 })
      .to(figure, { 
        x: endX, 
        y: endY, 
        scale: 0.9,
        xPercent: -50,
        yPercent: -100,
        duration: 1,
        ease: "none"
      }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={figureRef}
      style={{ opacity: 0 }}
      className="overflow-hidden"
    >
      <Image
        src={imagePath}
        alt="Center Figure"
        width={600}
        height={800}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
}
