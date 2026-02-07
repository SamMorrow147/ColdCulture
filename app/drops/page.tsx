"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const ITEMS = [
  { img: "/T-T-CC copy.png", title: "MN Knux T", price: "$ 40.00" },
  { img: "/P-T-CC.png", title: "MN Knux T", price: "$ 40.00" },
  { img: "/KnuxKeychain.png", title: "Knux Keychain", price: "$ 40.00" },
  { img: "/KnuckNecklace.png", title: "Knux Necklace", price: "$ 40.00" },
  { img: "/Knuxearings.png", title: "Knux Earrings", price: "$ 40.00" },
  { img: "/HOTC-Sticker-min.png", title: "Heart of the City Sticker V1", price: "$ 40.00" },
];

const BGS = [
  "/HOTC-Sticker-min.png",
  "/freepik__a-product-shot-of-earrings-on-a-beautiful-ethnic-w__60530.png",
  "/freepik__dramatic-close-up-of-her-shirt-in-a-winter-storm-v__35142.png",
];

export default function DropsPage() {
  const panelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const cards = cardsRef.current;
    const bgs = bgRefs.current;
    if (!panel || !cards) return;

    /* ── Background init: only bg3 visible ── */
    if (bgs[0]) gsap.set(bgs[0], { scale: 2, opacity: 0 });
    if (bgs[1]) gsap.set(bgs[1], { scale: 2, opacity: 0 });
    if (bgs[2]) gsap.set(bgs[2], { scale: 1, opacity: 1 });

    /* ── Snap points ── */
    const cardW = cards.scrollWidth;
    const panelW = panel.offsetWidth;
    const maxDrag = Math.min(0, -(cardW - panelW + 40));
    const snapPoints = [0, maxDrag / 2, maxDrag];

    function switchBg(dragX: number) {
      const nearest = snapPoints.reduce(
        (best, _p, i) =>
          Math.abs(dragX - snapPoints[i]) < Math.abs(dragX - snapPoints[best])
            ? i
            : best,
        0
      );
      const bgIdx = [2, 1, 0][nearest];
      gsap.to(bgs, {
        scale: (i: number) => (i === bgIdx ? 1 : 2),
        opacity: (i: number) => (i === bgIdx ? 1 : 0),
        duration: 0.4,
        ease: "power2.out",
      });
    }

    /* ── Activate card ── */
    function activate(index: number) {
      if (activeRef.current !== null) return;
      if (!panel) return;
      const item = itemEls.current[index];
      if (!item) return;

      activeRef.current = index;

      const rect = item.getBoundingClientRect();

      // Spacer keeps the card-list width stable
      const spacer = document.createElement("div");
      spacer.style.cssText = `width:${item.offsetWidth}px;height:${item.offsetHeight}px;flex-shrink:0;display:block;margin:${getComputedStyle(item).margin};`;
      item.parentNode?.insertBefore(spacer, item);
      spacerRef.current = spacer;

      // Move card out of the draggable list so it's not affected by transforms
      panel.appendChild(item);

      const panelRect = panel.getBoundingClientRect();

      // Place card at its old visual position
      gsap.set(item, {
        position: "absolute",
        top: rect.top - panelRect.top,
        left: rect.left - panelRect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 1000,
        overflow: "visible",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      });

      const img = item.querySelector(".item-img") as HTMLElement;
      const desc = item.querySelector(".item-description") as HTMLElement;

      // Animate card to expanded bottom strip
      const expandedHeight = 320;
      const finalTop = panelRect.height - expandedHeight;
      const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });

      tl.to(item, {
        top: finalTop,
        left: 0,
        width: panelRect.width,
        height: expandedHeight,
        overflow: "visible",
        borderRadius: 0,
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.3)",
        onComplete: () => {
          item.classList.add("active");
        },
      }, 0);

      if (img) {
        // Fix image width to its collapsed card size and center it
        // so it doesn't grow when the card expands to full width
        gsap.set(img, {
          width: rect.width,
          left: "50%",
          right: "auto",
          xPercent: -50,
        });
        tl.to(img, {
          bottom: 160,
        }, 0);
      }

      if (desc) {
        tl.to(desc, {
          bottom: 60,
        }, 0);
      }
    }

    /* ── Deactivate card ── */
    function deactivate() {
      const idx = activeRef.current;
      if (idx === null || !panel) return;
      const item = itemEls.current[idx];
      const spacer = spacerRef.current;
      if (!item || !spacer) return;

      item.classList.remove("active");

      const spacerRect = spacer.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      const img = item.querySelector(".item-img") as HTMLElement;
      const desc = item.querySelector(".item-description") as HTMLElement;

      const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.inOut" } });

      tl.to(item, {
        top: spacerRect.top - panelRect.top,
        left: spacerRect.left - panelRect.left,
        width: spacerRect.width,
        height: spacerRect.height,
        overflow: "visible",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        onComplete: () => {
          gsap.set(item, { clearProps: "all" });
          if (img) gsap.set(img, { clearProps: "all" });
          if (desc) gsap.set(desc, { clearProps: "all" });
          spacer.parentNode?.insertBefore(item, spacer);
          spacer.parentNode?.removeChild(spacer);
          spacerRef.current = null;
          activeRef.current = null;
        },
      }, 0);

      if (img) {
        tl.to(img, {
          bottom: 72,
        }, 0);
      }

      if (desc) {
        tl.to(desc, {
          bottom: 0,
        }, 0);
      }
    }

    /* ── GSAP Draggable ── */
    let wasDragging = false;

    const [draggable] = Draggable.create(cards, {
      type: "x",
      trigger: panel,
      edgeResistance: 0.65,
      bounds: { minX: maxDrag, maxX: 0 },
      zIndexBoost: false,
      allowContextMenu: false,
      minimumMovement: 6,
      onDragStart() {
        wasDragging = true;
      },
      onDragEnd() {
        const x = this.x;
        const nearest = snapPoints.reduce((best, pos) =>
          Math.abs(x - pos) < Math.abs(x - best) ? pos : best
        );
        gsap.to(cards, {
          x: nearest,
          duration: 0.4,
          ease: "power2.out",
        });
        switchBg(nearest);
        // Reset drag flag after a tick so the click event that follows is suppressed
        setTimeout(() => { wasDragging = false; }, 80);
      },
    });

    /* ── Native click handlers on each card (more reliable than Draggable onClick) ── */
    function handleCardClick(e: MouseEvent) {
      if (wasDragging) return;
      e.stopPropagation();

      const card = (e.currentTarget as HTMLElement).closest(".drops-item") as HTMLDivElement | null;
      if (!card) return;
      const idx = itemEls.current.indexOf(card);
      if (idx < 0) return;

      if (activeRef.current === idx) {
        deactivate();
      } else if (activeRef.current === null) {
        activate(idx);
      }
    }

    // Attach click listeners to each card
    const items = itemEls.current;
    items.forEach((el) => {
      el?.addEventListener("click", handleCardClick as EventListener);
    });

    /* ── Click anywhere else to close an active card ── */
    function handlePanelClick(e: MouseEvent) {
      if (wasDragging) return;
      if (activeRef.current === null) return;
      const target = e.target as HTMLElement;
      // Only close if the click isn't on a card, button, or link
      if (target.closest(".drops-item") || target.closest("button") || target.closest("a")) return;
      deactivate();
    }
    panel.addEventListener("click", handlePanelClick);

    /* ── Resize handler ── */
    const handleResize = () => {
      const newPanelW = panel.offsetWidth;
      const newCardW = cards.scrollWidth;
      const newMax = Math.min(0, -(newCardW - newPanelW + 40));
      draggable.applyBounds({ minX: newMax, maxX: 0 });
      snapPoints[1] = newMax / 2;
      snapPoints[2] = newMax;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      draggable.kill();
      window.removeEventListener("resize", handleResize);
      items.forEach((el) => {
        el?.removeEventListener("click", handleCardClick as EventListener);
      });
      panel.removeEventListener("click", handlePanelClick);
    };
  }, []);

  return (
    <div className="drops-page drops-page-root">
      {/* ── Full-screen backgrounds: fixed + inset 0 (no height) so mobile viewport is correct ── */}
      <div className="drops-bg-wrap">
        {BGS.map((url, i) => (
          <div
            key={i}
            ref={(el) => { bgRefs.current[i] = el; }}
            className={`drops-bg-layer ${i === 2 ? "drops-bg-layer-third" : ""}`}
          >
            <img
              src={url}
              alt=""
              className={i === 2 ? "drops-bg-img drops-bg-img-third" : "drops-bg-img"}
              draggable={false}
              fetchPriority={i === 2 ? "high" : "low"}
            />
          </div>
        ))}
      </div>

      {/* Black transparent overlay over background */}
      <div className="drops-bg-overlay" aria-hidden />

      {/* ── Main panel ── */}
      <main
        ref={panelRef}
        className="drops-panel relative z-10 w-full h-full overflow-visible cursor-grab active:cursor-grabbing select-none"
      >
        {/* Dark backdrop when a product is open – makes the product pop */}
        <div className="drops-active-backdrop" aria-hidden />
        {/* Header */}
        <header className="relative z-20 flex justify-center items-center px-4 py-3 text-white bg-black/20 backdrop-blur-sm">
          <a href="/" className="flex justify-center items-center" aria-label="Cold Culture home">
            <img
              src="/ColdCulture.svg"
              alt="Cold Culture"
              className="h-8 md:h-9 w-auto brightness-0 invert"
            />
          </a>
        </header>

        {/* Hero */}
        <aside className="relative z-10 px-6 pb-5 mt-8">
          <p className="font-sans uppercase text-white text-sm tracking-wider">
            New SEASON - 025
          </p>
        </aside>

        {/* Card list – GSAP Draggable moves this via transform */}
        <div
          ref={cardsRef}
          className="drops-card-list absolute bottom-8 left-3 flex gap-3 md:gap-5 lg:gap-6 z-10 overflow-visible"
        >
          {ITEMS.map((product, index) => (
            <div
              key={index}
              ref={(el) => { itemEls.current[index] = el; }}
              className="drops-item drops-item-foggy drops-card relative w-[170px] h-[200px] md:w-[260px] md:h-[260px] lg:w-[300px] lg:h-[280px] rounded-xl flex-shrink-0 cursor-pointer shadow-lg overflow-visible"
            >
              <img
                className={`item-img absolute inset-x-0 bottom-[72px] w-full object-contain object-bottom pointer-events-none ${index < 2 ? "scale-[1.65] origin-bottom" : ""}`}
                src={product.img}
                alt={product.title.replace("\n", " ")}
                draggable={false}
              />
              {index >= 5 && (
                <span
                  className="absolute left-1/2 top-[12%] -translate-x-1/2 -translate-y-1/2 -rotate-[25deg] flex flex-col items-center justify-center text-red-600 font-bold pointer-events-none select-none text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight"
                  style={{ fontFamily: "'Abject Failure', sans-serif" }}
                  aria-hidden
                >
                  <span>SOLD</span>
                  <span>OUT</span>
                </span>
              )}
              <div className="item-description absolute bottom-0 inset-x-0 h-[72px] text-center w-full pointer-events-none flex flex-col justify-end">
                <h2 className="uppercase px-3 pt-2 md:pt-3 text-xl md:text-2xl lg:text-3xl font-semibold leading-tight text-white" style={{ fontFamily: "'Abject Failure', sans-serif" }}>
                  {product.title.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h2>
                <p className="item-price mt-1 md:mt-2 px-3 pb-2 md:pb-3 text-gray-300 text-sm font-sans">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
