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
      className="section-four-fog fixed left-0 right-0 bottom-0 xl:bottom-[6vh] w-full h-[24vh] lg:h-[28vh] xl:h-[30vh] pointer-events-none"
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage: "linear-gradient(to top, black 0%, black 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.12)",
        }}
      />
    </div>
  );
}
