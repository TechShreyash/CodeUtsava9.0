import { useCallback, useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import introBg from "../../assets/images/welcome.png";

function CloudGraphic({ gradientId }) {
    return (
        <svg
            viewBox="0 0 600 320"
            className="w-[110%] max-w-none drop-shadow-[0_0_60px_rgba(255,255,255,0.35)]"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.96)" />
                    <stop offset="55%" stopColor="rgba(255,240,215,0.98)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.93)" />
                </linearGradient>
            </defs>
            <rect x="60" y="150" width="480" height="140" rx="80" fill={`url(#${gradientId})`} />
            <circle cx="150" cy="190" r="110" fill={`url(#${gradientId})`} />
            <circle cx="260" cy="140" r="135" fill={`url(#${gradientId})`} />
            <circle cx="380" cy="190" r="125" fill={`url(#${gradientId})`} />
            <circle cx="480" cy="160" r="95" fill={`url(#${gradientId})`} />
            <circle cx="540" cy="210" r="85" fill={`url(#${gradientId})`} />
        </svg>
    );
}

export default function Intro({ onEnterComplete = () => {} }) {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const leftCloudRef = useRef(null);
    const rightCloudRef = useRef(null);
    const contentRef = useRef(null);
    const ctaRef = useRef(null);
    const timelineRef = useRef(null);
    const reduceMotionRef = useRef(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const leftGradientId = useId();
    const rightGradientId = useId();

    useEffect(() => {
        reduceMotionRef.current = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

        const ctx = gsap.context(() => {
            gsap.set(leftCloudRef.current, { xPercent: -125 });
            gsap.set(rightCloudRef.current, { xPercent: 125 });
            gsap.set(overlayRef.current, { opacity: 0.2 });

            if (contentRef.current) {
                gsap.fromTo(
                    contentRef.current.children,
                    { y: 24, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        stagger: 0.12,
                        ease: "power3.out",
                    }
                );
            }

            gsap.to(".intro__floating-badge", {
                y: 6,
                duration: 2.4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        return () => {
            timelineRef.current?.kill();
        };
    }, []);

    const startReveal = useCallback(() => {
        if (isAnimating) return;

        if (reduceMotionRef.current) {
            onEnterComplete();
            return;
        }

        setIsAnimating(true);

        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
                onEnterComplete();
            },
        });

        timelineRef.current = tl;

        tl.to(ctaRef.current, {
            opacity: 0,
            yPercent: -20,
            duration: 0.45,
            ease: "power3.in",
        })
            .to(
                contentRef.current,
                {
                    scale: 0.96,
                    opacity: 0.9,
                    filter: "drop-shadow(0 0 30px rgba(12, 8, 24, 0.75))",
                    duration: 0.8,
                },
                "<"
            )
            .to(
                leftCloudRef.current,
                {
                    xPercent: -5,
                    duration: 1.2,
                    ease: "power3.out",
                },
                "<0.05"
            )
            .to(
                rightCloudRef.current,
                {
                    xPercent: 5,
                    duration: 1.2,
                    ease: "power3.out",
                },
                "<"
            )
            .to(
                overlayRef.current,
                {
                    opacity: 0.92,
                    duration: 1.0,
                    ease: "sine.inOut",
                },
                "<"
            )
            .to(
                containerRef.current,
                {
                    backgroundColor: "rgba(7, 5, 16, 0.95)",
                    duration: 1.0,
                },
                "<"
            )
            .to(
                leftCloudRef.current,
                {
                    xPercent: -160,
                    duration: 1.25,
                    ease: "power2.inOut",
                },
                "+=0.35"
            )
            .to(
                rightCloudRef.current,
                {
                    xPercent: 160,
                    duration: 1.25,
                    ease: "power2.inOut",
                },
                "<"
            )
            .to(
                [overlayRef.current, contentRef.current],
                {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.in",
                },
                "<0.1"
            )
            .to(
                containerRef.current,
                {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.in",
                },
                "<0.15"
            );
    }, [isAnimating, onEnterComplete]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Enter") {
                startReveal();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [startReveal]);

    return (
        <section
            ref={containerRef}
            className="relative flex h-screen w-screen select-none items-center justify-center overflow-hidden bg-[#070316] text-white"
        >
            <div className="absolute inset-0">
                <img
                    src={introBg}
                    alt="CodeUtsava carnival gates"
                    className="h-full w-full object-cover"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#05020c]/40 via-[#12061e]/70 to-[#040209]/90" />
            </div>

            <div
                ref={overlayRef}
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-white/70 to-white/80 mix-blend-screen"
                aria-hidden
            />

            <div className="relative z-20 flex h-full w-full flex-col items-center justify-center px-4 text-center">
                <div
                    ref={contentRef}
                    className="flex max-w-3xl flex-col items-center gap-4 sm:gap-6"
                >
                    <span className="text-xs uppercase tracking-[0.55em] text-white/70 sm:text-sm">
                        National Institute of Technology Raipur Presents
                    </span>

                    <div className="intro__floating-badge rounded-full border border-white/40 bg-white/10 px-5 py-2 backdrop-blur">
                        <span className="font-bebas text-sm uppercase tracking-[0.7em] text-accent-2 sm:text-base">
                            Code Carnival
                        </span>
                    </div>

                    <h1 className="px-2 font-rye text-4xl uppercase tracking-widest text-[#F3A83A] drop-shadow-[0_0_25px_rgba(243,168,58,0.45)] sm:text-5xl md:text-6xl lg:text-7xl">
                        Welcome to CodeUtsava 9.0
                    </h1>

                    <p className="max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
                        Step into Central India&apos;s grandest coding celebration where creativity meets carnival energy.
                        Unleash ideas, collaborate with brilliant minds, and set the stage for breakthroughs.
                    </p>

                    <button
                        ref={ctaRef}
                        onClick={startReveal}
                        className="group relative mt-4 inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-[#F3A83A]/80 bg-[var(--color-primary)] px-8 py-3 font-bebas text-lg uppercase tracking-[0.6em] text-[#FFE5B4] transition-transform duration-300 hover:scale-105 hover:bg-[var(--color-accent)] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F3A83A]/40 sm:px-10 sm:text-xl"
                        type="button"
                    >
                        <span className="text-sm sm:text-base">Enter</span>
                        <span className="hidden text-xs tracking-[0.6em] text-white/70 sm:inline">
                            The Carnival
                        </span>
                        <span className="absolute inset-y-0 left-0 w-full translate-x-[-105%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)] transition-transform duration-700 group-hover:translate-x-[105%]" />
                    </button>
                </div>
            </div>

            <div
                ref={leftCloudRef}
                className="pointer-events-none absolute inset-y-0 left-0 z-30 flex w-[125vw] items-center justify-end"
                style={{ transform: "translateX(-125%)" }}
                aria-hidden
            >
                <CloudGraphic gradientId={leftGradientId} />
            </div>

            <div
                ref={rightCloudRef}
                className="pointer-events-none absolute inset-y-0 right-0 z-30 flex w-[125vw] items-center justify-start"
                style={{ transform: "translateX(125%)" }}
                aria-hidden
            >
                <div style={{ transform: "scaleX(-1)" }}>
                    <CloudGraphic gradientId={rightGradientId} />
                </div>
            </div>
        </section>
    );
}
