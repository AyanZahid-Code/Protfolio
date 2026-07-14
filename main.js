        // Simple typewriter effect for hero section
        document.addEventListener('DOMContentLoaded', () => {
            const el = document.getElementById('typewriter-text');
            if(el) {
                const text = el.innerHTML;
                el.innerHTML = '';
                let i = 0;

                // Add blinking cursor span
                const cursor = document.createElement('span');
                cursor.className = 'blinking-cursor text-primary ml-1';
                cursor.innerHTML = '▊';

                const typeWriter = () => {
                    if (i < text.length) {
                        el.innerHTML = text.substring(0, i+1);
                        el.appendChild(cursor);
                        i++;
                        setTimeout(typeWriter, 15); // Fast typing
                    }
                };

                // Start after a tiny delay
                setTimeout(typeWriter, 500);
            }

            // GSAP scroll-reveal (graceful fallback if CDN fails)
            const reveals = document.querySelectorAll('.reveal');
            if (window.gsap && window.ScrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);
                reveals.forEach((node) => {
                    gsap.fromTo(node,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
                            scrollTrigger: { trigger: node, start: "top 90%" }
                        }
                    );
                });
            } else {
                reveals.forEach((node) => { node.style.opacity = 1; node.style.transform = "none"; });
            }

            // Theme toggle (circular reveal from button, no blank flash)
            const root = document.documentElement;
            const saved = localStorage.getItem('theme');
            if (saved === 'light') root.classList.add('light');
            const themeToggle = document.getElementById('theme-toggle');
            const reveal = document.getElementById('theme-reveal');
            const COLORS = {
                dark:  { bg: '#0F0D0A', scan: '42,36,28',  vig: '15,13,10' },
                light: { bg: '#f4ece0', scan: '217,199,173', vig: '244,236,224' }
            };
            const applyTheme = (isLight) => {
                root.classList.toggle('light', isLight);
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            };
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const current = root.classList.contains('light') ? 'light' : 'dark';
                    const target = current === 'light' ? 'dark' : 'light';
                    const oldC = COLORS[current];
                    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (reveal && !reduce) {
                        // Switch page to new theme underneath, then wipe it in from the button
                        applyTheme(target === 'light');
                        const r = themeToggle.getBoundingClientRect();
                        const cx = r.left + r.width / 2;
                        const cy = r.top + r.height / 2;
                        const maxR = Math.hypot(
                            Math.max(cx, window.innerWidth - cx),
                            Math.max(cy, window.innerHeight - cy)
                        );
                        reveal.style.backgroundColor = oldC.bg;
                        reveal.style.backgroundImage =
                            `linear-gradient(to bottom, rgba(${oldC.scan},0) 50%, rgba(${oldC.scan},0.2) 50%),` +
                            `radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(${oldC.vig},0.8) 100%)`;
                        reveal.style.backgroundSize = '100% 4px, 100% 100%';
                        reveal.style.backgroundRepeat = 'repeat, no-repeat';
                        reveal.style.maskRepeat = 'no-repeat';
                        reveal.style.webkitMaskRepeat = 'no-repeat';
                        reveal.style.display = 'block';
                        void reveal.offsetWidth; // force reflow

                        const dur = 520;
                        const t0 = performance.now();
                        const step = (now) => {
                            const k = Math.min(1, (now - t0) / dur);
                            const ease = 1 - Math.pow(1 - k, 3); // easeOutCubic
                            const R = maxR * ease;
                            const mask = `radial-gradient(circle ${R}px at ${cx}px ${cy}px, transparent ${R}px, #000 ${R + 1}px)`;
                            reveal.style.webkitMaskImage = mask;
                            reveal.style.maskImage = mask;
                            if (k < 1) {
                                requestAnimationFrame(step);
                            } else {
                                reveal.style.display = 'none';
                                reveal.style.maskImage = '';
                                reveal.style.webkitMaskImage = '';
                            }
                        };
                        requestAnimationFrame(step);
                    } else {
                        applyTheme(target === 'light');
                    }
                });
            }

            // Back to top
            const backToTop = document.getElementById('back-to-top');
            if (backToTop) {
                backToTop.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        });
