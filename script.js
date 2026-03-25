const SANITY_PROJECT_ID = 'xuas1g49';
const SANITY_DATASET = 'production';
window.getSanityImageUrl = function(source) {
    if (!source || !source.asset || !source.asset._ref) return '';
    const parts = source.asset._ref.split('-');
    if (parts.length < 4) return '';
    return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${parts[1]}-${parts[2]}.${parts[3]}`;
};
window.globalServices = [];
window.sanityGalleryImages = [];
window.sanityFeaturedArticles = [];
window.sanityAbout = null;
window.sanityExperience = [];
window.sanityInitiatives = [];
async function initSanity() {
    try {
        const query = encodeURIComponent(`{
            "engagements": *[_type == "engagement"] | order(order asc),
            "gallery": *[_type == "galleryImage"] | order(order asc),
            "articles": *[_type == "featuredArticle"] | order(_createdAt desc),
            "about": *[_type == "aboutPage"][0],
            "experience": *[_type == "experienceMilestone"] | order(order asc),
            "initiatives": *[_type == "initiative"] | order(order asc),
            "settings": *[_type == "siteSettings"][0],
            "expertise": *[_type == "expertisePage"][0]
        }`);
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json && json.result) {
            const data = json.result;
            if (data.engagements && data.engagements.length > 0) {
                window.globalServices = data.engagements.map((e, idx) => ({
                    id: e._id || `eng-${idx}`,
                    title: e.title || '',
                    category: e.category || 'ENGAGEMENT',
                    code: e.code || `BK-${idx}`,
                    description: e.description || ''
                }));
            }
            window.sanityGalleryImages = data.gallery || [];
            window.sanityFeaturedArticles = data.articles || [];
            window.sanityAbout = data.about || null;
            window.sanityExperience = data.experience || [];
            window.sanityInitiatives = data.initiatives || [];
            window.sanitySettings = data.settings || null;
            window.sanityExpertise = data.expertise || null;
        }
    } catch (e) {
        console.error("Sanity fetch failed:", e);
    }
    if (window.globalServices.length === 0) {
        window.globalServices = [
            { id: 'keynote', title: 'Keynote Speaking', category: 'SPEAKING', code: 'BK-SC-01', description: 'Setting the standard...' },
            { id: 'leadership', title: 'Leadership Talks', category: 'EXECUTIVE', code: 'BK-LT-02', description: 'Curating elite leadership frameworks for global boardrooms.' }
        ];
    }
    document.dispatchEvent(new Event('SanityLoaded'));
}
initSanity();
document.addEventListener('SanityLoaded', () => {
    if (window.sanitySettings) {
        document.querySelectorAll('.footer-cta-text h3').forEach(e => e.textContent = window.sanitySettings.ctaHeading);
        document.querySelectorAll('.footer-cta-text p').forEach(e => e.textContent = window.sanitySettings.ctaSubtext);
        document.querySelectorAll('.footer-brand p').forEach(e => e.textContent = window.sanitySettings.footerText);
        document.querySelectorAll('.footer-contact').forEach(fc => {
            const ps = fc.querySelectorAll('p');
            if (ps[0] && window.sanitySettings.email) ps[0].innerHTML = `<i class="fas fa-envelope"></i> ${window.sanitySettings.email}`;
            if (ps[1] && window.sanitySettings.location) ps[1].innerHTML = `<i class="fas fa-location-dot"></i> ${window.sanitySettings.location}`;
        });
        const socials = window.sanitySettings.socialLinks;
        if (socials) {
            document.querySelectorAll('a[aria-label="Instagram"], .branch-item.instagram').forEach(a => a.href = socials.instagram || '#');
            document.querySelectorAll('a[aria-label="Facebook"], .branch-item.facebook').forEach(a => a.href = socials.facebook || '#');
            document.querySelectorAll('a[aria-label="Twitter"], a[aria-label="X"], .branch-item.x-social').forEach(a => a.href = socials.twitter || '#');
            document.querySelectorAll('a[aria-label="LinkedIn"], .branch-item.linkedin').forEach(a => a.href = socials.linkedin || '#');
            document.querySelectorAll('a[aria-label="IMDB"], a[aria-label="IMDb"], .branch-item.imdb').forEach(a => a.href = socials.imdb || '#');
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
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
        const parent = el.parentElement;
        const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal') || c.tagName === el.tagName);
        const relativeIndex = siblings.indexOf(el);
        el.style.setProperty('--delay', relativeIndex);
        el.classList.add('stagger');
        observer.observe(el);
    });
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
    window.initLightbox = function() {
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
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                newItem.addEventListener('click', () => {
                    updateLightbox(index);
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; 
                });
                newItem.addEventListener('mousemove', (e) => {
                    const rect = newItem.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    const img = newItem.querySelector('img');
                    if (img) img.style.transform = `scale(1.05) translate(${x * 0.02}px, ${y * 0.02}px)`;
                });
                newItem.addEventListener('mouseleave', () => {
                    const img = newItem.querySelector('img');
                    if (img) img.style.transform = `scale(1) translate(0, 0)`;
                });
            });
            const newGalleryItems = document.querySelectorAll('.gallery-item');
            const closeLightbox = () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            };
            if (closeBtn) closeBtn.onclick = closeLightbox;
            if (lightbox) {
                lightbox.onclick = (e) => {
                    if (e.target === lightbox) closeLightbox();
                };
            }
            if (prevBtnL) prevBtnL.onclick = (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + newGalleryItems.length) % newGalleryItems.length;
                updateLightbox(currentIndex);
            };
            if (nextBtnL) nextBtnL.onclick = (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % newGalleryItems.length;
                updateLightbox(currentIndex);
            };
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('active')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft' && prevBtnL) prevBtnL.click();
                if (e.key === 'ArrowRight' && nextBtnL) nextBtnL.click();
            });
        }
    };
    window.initLightbox();
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
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    };
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
document.addEventListener('SanityLoaded', () => {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'global-sidebar-toggle';
    toggleBtn.className = 'right-sidebar-toggle global-sidebar-btn';
    toggleBtn.innerHTML = `<span class="btn-vertical-text">Engagements</span> <i class="fas fa-chevron-left" id="global-sidebar-icon"></i>`;
    document.body.appendChild(toggleBtn);
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
    window.globalServices.forEach((s, i) => {
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
    if (window.location.pathname.includes('engagements.html')) {
        const params = new URLSearchParams(window.location.search);
        const engagementId = params.get('engagement');
        if (engagementId && typeof window.activateEngagement === 'function') {
            setTimeout(() => {
                window.activateEngagement(engagementId);
            }, 100);
        }
    }
});
document.addEventListener('SanityLoaded', () => {
    const featuredCards = document.querySelectorAll('.featured-card');
    if (featuredCards.length === 0) return;
    let pressReleases = [
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
        }
    ];
    if (window.sanityFeaturedArticles && window.sanityFeaturedArticles.length >= 3) {
        pressReleases = window.sanityFeaturedArticles.map(a => ({
            title: a.title,
            img: window.getSanityImageUrl(a.image),
            alt: a.alt,
            link: a.link
        }));
    }
    let currentlyDisplayedIndexes = [0, 1, 2];
    setInterval(() => {
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