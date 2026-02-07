"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_FOUR_IMAGE = "/freepik__an-image-outside-in-a-blizzard-at-a-big-box-of-the__64105.png";

export default function SectionFourFog() {
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fog = fogRef.current;
    const sectionFour = document.getElementById("section-four");
    if (!fog || !sectionFour) return;

    gsap.set(fog, { opacity: 0 });

    // Same style as section 2: fog appears as you scroll into section 4 (near end of section)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionFour,
        start: "top 12%",
        end: "top -15%",
        scrub: 1,
      },
    });

    tl.to(fog, { opacity: 1, ease: "power1.inOut" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={fogRef}
      className="section-four-fog fixed left-0 right-0 bottom-0 w-full h-[28vh] lg:h-[32vh] xl:h-[36vh] pointer-events-none"
      style={{
        zIndex: 2,
        opacity: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${SECTION_FOUR_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          filter: "blur(50px)",
          WebkitFilter: "blur(50px)",
        }}
      />
      {/* Fog gradient overlay — Safari-safe (no backdrop-filter + mask combo) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.05) 70%, transparent 100%)",
        }}
      />
    </div>
  );
}
