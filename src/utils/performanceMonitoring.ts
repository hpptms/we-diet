// Performance monitoring utilities for SEO optimization

export interface PerformanceMetrics {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
}

export function initPerformanceMonitoring() {
    // Web Vitals monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                // Performance metrics are monitored silently
                // LCP, FID, CLS data is collected but not logged to console
            });
        });

        try {
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        } catch (error) {
            console.warn('Performance observer not supported for some metrics');
        }

        return observer;
    }

    return { disconnect: () => { } };
}

// Critical resource preloading
export function preloadCriticalResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap',
        'https://res.cloudinary.com/drmyhhtjo/image/upload/v1753593907/afa4835f-e2b4-49f9-b342-1c272be930d3_cngflc.webp'
    ];

    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = url.includes('.css') ? 'style' : 'image';
        document.head.appendChild(link);
    });
}

// Lazy loading for images
export function enableImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    img.src = img.dataset.src || '';
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Service Worker registration for caching
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    // Service Worker registered - silent handling
                })
                .catch((registrationError) => {
                    // Service Worker registration failed - silent handling
                });
        });
    }
}
