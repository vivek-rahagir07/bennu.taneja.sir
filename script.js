/* Enhanced Global Interactions */
document.addEventListener('DOMContentLoaded', () => {
    // Navigation Scroll Effect & Shimmer wrapper
    const navbar = document.getElementById('navbar');
    
    if (navbar && !navbar.querySelector('.nav-shimmer')) {
        const shimmer = document.createElement('div');
        shimmer.className = 'nav-shimmer';
        navbar.appendChild(shimmer);
    }

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Magnetic Buttons & Interactions
    const setupInteractions = () => {
        const triggers = document.querySelectorAll('.btn, .premium-image-container');
        triggers.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const factor = el.classList.contains('btn') ? 0.2 : 0.08;
                el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                el.style.transition = 'transform 0.1s ease-out';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0px, 0px)';
            });
        });
    };

    setupInteractions();

    // Staggered Reveal Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -100px 0px' });

    const reveals = document.querySelectorAll('.card:not(.about-portrait-card), .flip-card, .section-title, .hero-content, .timeline-item, .programme-grid, .programme-card, .vision-pillar, .impact-card, .future-vision-panel, .carousel-container, .stagger-reveal, .reveal, .milestone');
    reveals.forEach((el, index) => {
        el.classList.add('reveal');
        // Add staggering based on index within parent containers
        const parent = el.parentElement;
        const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal') || c.tagName === el.tagName);
        const relativeIndex = siblings.indexOf(el);
        el.style.setProperty('--delay', relativeIndex);
        el.classList.add('stagger');
        observer.observe(el);
    });

    // Social Media Carousel
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        const startAutoRotate = () => {
            slideInterval = setInterval(nextSlide, 2000);
        };

        const stopAutoRotate = () => {
            clearInterval(slideInterval);
        };

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoRotate();
            startAutoRotate();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoRotate();
            startAutoRotate();
        });

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                stopAutoRotate();
                startAutoRotate();
            });
        });

        startAutoRotate();
    }

    // Fast Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = ["Entrepreneur", "Motivational Speaker", "Corporate Trainer"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 50;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 60;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 1000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 200;
            }
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- Gallery Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtnL = lightbox ? lightbox.querySelector('.lightbox-btn.prev') : null;
    const nextBtnL = lightbox ? lightbox.querySelector('.lightbox-btn.next') : null;
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const updateLightbox = (index) => {
            const item = galleryItems[index];
            const img = item.querySelector('img');
            const h3 = item.querySelector('h3');
            const p = item.querySelector('p');

            if (lightboxImg && img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            }
            if (lightboxTitle) lightboxTitle.textContent = h3 ? h3.textContent : "";
            if (lightboxDesc) lightboxDesc.textContent = p ? p.textContent : "";
            currentIndex = index;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                updateLightbox(index);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });

            // Magnetic effect for gallery items
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const img = item.querySelector('img');
                if (img) img.style.transform = `scale(1.05) translate(${x * 0.02}px, ${y * 0.02}px)`;
            });

            item.addEventListener('mouseleave', () => {
                const img = item.querySelector('img');
                if (img) img.style.transform = `scale(1) translate(0, 0)`;
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
        }

        if (prevBtnL) prevBtnL.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightbox(currentIndex);
        });

        if (nextBtnL) nextBtnL.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightbox(currentIndex);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && prevBtnL) prevBtnL.click();
            if (e.key === 'ArrowRight' && nextBtnL) nextBtnL.click();
        });
    }

    // --- Mobile Navigation ---
    const setupMobileNav = () => {
        const nav = document.getElementById('navbar');
        if (!nav) return;

        const mobileBtn = document.createElement('div');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        nav.appendChild(mobileBtn);

        const navLinks = document.querySelector('.nav-links');

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.innerHTML = navLinks.classList.contains('active') ?
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    };

    // --- Stat Counter Animation ---
    const animateCounters = () => {
        const stats = document.querySelectorAll('.stat-number');
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endValue = parseInt(target.textContent.replace(/,/g, ''));
                    if (isNaN(endValue)) return;

                    let startValue = 0;
                    const duration = 2000;
                    const startTime = performance.now();

                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out quad
                        const easeProgress = progress * (2 - progress);

                        const currentCount = Math.floor(easeProgress * endValue);
                        target.textContent = currentCount.toLocaleString() + (target.textContent.includes('+') ? '+' : '');

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        }
                    };

                    requestAnimationFrame(updateCount);
                    countObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => countObserver.observe(stat));
    };

    animateCounters();

    setupMobileNav();

});

// --- Global Engagements Sidebar ---
const globalServices = [
    { id: 'keynote', title: 'Keynote Speaking', category: 'SPEAKING', code: 'BK-SC-01', description: 'Setting the standard for global summits with thought-provoking addresses that blend cinematic storytelling with actionable strategic wisdom. These sessions are designed to challenge existing paradigms and inspire institutional transformation at the highest levels of leadership.' },
    { id: 'leadership', title: 'Leadership Talks', category: 'EXECUTIVE', code: 'BK-LT-02', description: 'Curating elite leadership frameworks for global boardrooms. We dissect the nuances of power dynamics, resilient organizational culture, and the architectural principles of sustainable success in volatile markets.' },
    { id: 'motivational', title: 'Motivational Talks', category: 'POTENTIAL', code: 'BK-MT-03', description: 'Igniting the untapped potential within your workforce. These sessions combine behavioral science with high-impact storytelling to catalyze a shift from passive participation to passionate, ownership-driven execution.' },
    { id: 'tedx', title: 'TEDx Speaker', category: 'IMPACT', code: 'BK-TX-04', description: 'Distilling complex human insights into globally resonant narratives. As a TEDx veteran, I deliver high-signal ideas that challenge conventional wisdom and inspire collective action on the world stage.' },
    { id: 'storytelling', title: 'Story Telling', category: 'NARRATIVE', code: 'BK-ST-05', description: 'Harnessing the power of narrative to build compelling brand identities and emotional connections. We teach leaders how to craft stories that not only resonate but drive decisive action from target audiences.' },
    { id: 'consulting', title: 'Business Consulting', category: 'STRATEGY', code: 'BK-BC-06', description: 'Providing high-value bespoke advisory for C-suite leaders. We partner with you to solve systemic challenges, optimize decision-making workflows, and build a legacy of operational excellence.' },
    { id: 'org', title: 'Org. Development', category: 'STRUCTURE', code: 'BK-OD-07', description: 'Strengthening the structural integrity of your organization through robust development models. We provide the scaffolding necessary for transparent, high-integrity corporate stewardship.' },
    { id: 'process', title: 'Process & Streamlining', category: 'OPERATIONS', code: 'BK-PS-08', description: 'Navigating the intricate landscape of operational workflows. We specialize in reducing friction during transitions, ensuring that processes are maximized for competitive advantage.' },
    { id: 'education', title: 'Educational Thinking', category: 'PEDAGOGY', code: 'BK-ET-09', description: 'Revolutionizing educational approaches with strategic thinking frameworks. We empower institutions to cultivate environments of relentless curiosity and profound intellectual growth.' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Generate Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'global-sidebar-toggle';
    toggleBtn.className = 'right-sidebar-toggle global-sidebar-btn';
    toggleBtn.innerHTML = `<span class="btn-vertical-text">Engagements</span> <i class="fas fa-chevron-left" id="global-sidebar-icon"></i>`;
    document.body.appendChild(toggleBtn);

    // Generate Sidebar
    const sidebar = document.createElement('aside');
    sidebar.id = 'global-right-sidebar';
    sidebar.className = 'right-sidebar';
    sidebar.innerHTML = `
        <div class="right-sidebar-header">
            <h3>Engagements</h3>
        </div>
        <ul class="engagements-list" id="global-right-navigator-list"></ul>
    `;
    document.body.appendChild(sidebar);

    const listUl = document.getElementById('global-right-navigator-list');

    globalServices.forEach((s, i) => {
        const li = document.createElement('li');
        const num = (i + 1).toString().padStart(2, '0');
        li.classList.add(`engagement-item-${s.id}`);
        li.innerHTML = `<span class="enum">${num}</span> <span class="ename">${s.title}</span>`;
        
        li.addEventListener('click', () => {
            if (window.location.pathname.includes('engagements.html')) {
                if (typeof window.activateEngagement === 'function') {
                    window.activateEngagement(s.id);
                }
                sidebar.classList.remove('active');
                toggleBtn.querySelector('i').classList.replace('fa-chevron-right', 'fa-chevron-left');
            } else {
                window.location.href = `engagements.html?engagement=${s.id}`;
            }
        });
        
        listUl.appendChild(li);
    });

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        const icon = toggleBtn.querySelector('i');
        if (sidebar.classList.contains('active')) {
            icon.classList.replace('fa-chevron-left', 'fa-chevron-right');
        } else {
            icon.classList.replace('fa-chevron-right', 'fa-chevron-left');
        }
    });

    // Handle initial loading if on engagements page with a URL parameter
    if (window.location.pathname.includes('engagements.html')) {
        const params = new URLSearchParams(window.location.search);
        const engagementId = params.get('engagement');
        if (engagementId && typeof window.activateEngagement === 'function') {
            // Need a slight delay to ensure local script.js services are initialized
            setTimeout(() => {
                window.activateEngagement(engagementId);
            }, 100);
        }
    }
});

// --- Featured Articles Rotator ---
document.addEventListener('DOMContentLoaded', () => {
    const featuredCards = document.querySelectorAll('.featured-card');
    if (featuredCards.length === 0) return;

    const pressReleases = [
        {
            title: "Beenu Kumar Taneja: A Visionary Leader in Corporate Training and Coaching",
            img: "assets/featured in /INAS WIRE .png",
            alt: "IANS Wire",
            link: "https://www.ians.in/vmpl/beenu-kumar-taneja-a-visionary-leader-in-corporate-training-and-coaching"
        },
        {
            title: "A Dynamic and Shining Star in the Field of Corporate Training and Coaching",
            img: "assets/featured in /danik bhaskar.png",
            alt: "Dainik Bhaskar",
            link: "https://dainikbhaskarup.com/beenu-kumar-taneja-a-dynamic-and-shining-star-in-the-field-of-corporate-training-and-coaching/"
        },
        {
            title: "Emerging Personalities and Brands to Watch in 2026",
            img: "assets/featured in /mid day.png",
            alt: "Mid Day",
            link: "https://www.mid-day.com/brand-stories/business-and-service/article/emerging-personalities-and-brands-to-watch-in-2026-8845"
        },
        {
            title: "Reporter Live Featured Profile",
            img: "assets/featured in /reporter live.png",
            alt: "Reporter Live",
            link: "https://areporterlive.com/beenu-kumar-taneja-corporate-trainer-india/"
        },
        {
            title: "Bharat Media Featured Article",
            img: "assets/featured in /bharat media.png",
            alt: "Bharat Media",
            link: "https://bharatmediatoday.com/beenu-kumar-taneja-corporate-trainer-india/"
        },
        {
            title: "IMDB Profile & Biography",
            img: "assets/featured in /imdb.png",
            alt: "IMDB",
            link: "https://m.imdb.com/name/nm16918036/bio/?ref_=nm_ov_ql_1"
        },
        {
            title: "Knowledge Pedia Featured Interview",
            img: "assets/featured in /knowledge .png",
            alt: "Knowledge Pedia",
            link: "#"
        }
    ];

    let currentlyDisplayedIndexes = [0, 1, 2];

    setInterval(() => {
        // Only run if the section is visible to save resources (optional, but good practice)
        const section = document.querySelector('.featured-card').closest('.light-section');
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const slotToReplace = Math.floor(Math.random() * 3);
        const availableIndexes = pressReleases.map((_, i) => i).filter(i => !currentlyDisplayedIndexes.includes(i));
        const newIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        
        const cardTarget = featuredCards[slotToReplace];
        const newData = pressReleases[newIndex];
        
        cardTarget.classList.add('fading');
        
        setTimeout(() => {
            const imgEl = cardTarget.querySelector('img');
            const titleEl = cardTarget.querySelector('h3');
            const linkEl = cardTarget.querySelector('a.featured-link');
            
            if(imgEl) {
                imgEl.src = newData.img;
                imgEl.alt = newData.alt;
            }
            if(titleEl) titleEl.textContent = newData.title;
            if(linkEl) linkEl.href = newData.link;
            
            currentlyDisplayedIndexes[slotToReplace] = newIndex;
            cardTarget.classList.remove('fading');
        }, 500); 
        
    }, 5000); 
});

