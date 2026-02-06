"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedLogo from "./AnimatedLogo";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DURATION = 600;
const FINAL_OFFSET = 24;

export default function LogoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    gsap.set(wrapper, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "min(90vw, 32rem)",
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      zIndex: 30,
      transformOrigin: "0 0",
      opacity: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper.parentElement ?? document.body,
        start: "top top",
        end: `+=${SCROLL_DURATION}`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(wrapper, {
      x: FINAL_OFFSET,
      y: FINAL_OFFSET,
      xPercent: 0,
      yPercent: 0,
      scale: 0.5,
      ease: "none",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={wrapperRef} 
      style={{ 
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        opacity: 0,
      }} 
      aria-hidden
    >
      <AnimatedLogo
        className="text-[#e8e6e3] block w-full"
        duration={2.2}
        delay={0.4}
        direction="left-to-right"
      />
    </div>
  );
}
