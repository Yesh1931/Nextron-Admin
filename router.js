/**
 * Nextron - Client-Side SPA Router
 */

const ROUTE_TO_CONCEPT_MAP = {
    '#/concept/diode': 'pn-junction',
    '#/concept/transistor': 'transistor',
    '#/concept/gates': 'logic-gates',
    '#/concept/flipflops': 'flipflops',
    '#/concept/signals': 'signals',
    '#/concept/networks': 'networks',
    '#/concept/microcontrollers': 'microcontrollers',
    '#/concept/dsp': 'dsp',
    '#/concept/comms': 'comms',
    '#/concept/vlsi': 'vlsi',
    '#/concept/embedded': 'embedded',
    '#/concept/optical': 'optical'
};

export class Router {
    constructor(routes, rootElementId) {
        this.routes = routes;
        this.rootElement = document.getElementById(rootElementId);
        this.currentRoute = null;
        this.activeView = null;
        
        // Bind event listeners
        window.addEventListener('hashchange', () => this.handleRouting());
        
        // Register global KaTeX click events (copy & zoom)
        this.initGlobalMathEvents();
        
        // Route immediately upon creation (safe since DOM is ready)
        this.handleRouting();
    }

    async handleRouting() {
        const hash = window.location.hash || '#/';
        let routePath = hash;
        
        // 0. Enforce Global Route Authentication Guard
        try {
            const AppState = window.AppState;
            if (AppState) {
                // Guest-authorized routes
                const isGuestRoute = routePath === '#/' || routePath === '#/about' || routePath === '#/login';
                
                if (!AppState.currentUser && !isGuestRoute) {
                    setTimeout(() => {
                        AppState.showToast("Access Restricted: Register or sign in to explore the ECE simulation labs.", "error");
                        window.location.hash = '#/login';
                    }, 50);
                    return;
                }
            }
        } catch (err) {
            console.error("Auth guard error:", err);
        }
        
        // 1. Enforce curriculum progression locks check
        if (ROUTE_TO_CONCEPT_MAP[routePath]) {
            const conceptId = ROUTE_TO_CONCEPT_MAP[routePath];
            try {
                const { isSubjectLocked } = await import('./views/concepts.js');
                const AppState = window.AppState;
                
                if (AppState && isSubjectLocked(conceptId)) {
                    setTimeout(() => {
                        AppState.showToast("Security Alert: Subject sector locked! Master preceding modules with 80% to unlock.", "error");
                        window.location.hash = '#/concepts';
                    }, 50);
                    return;
                }
            } catch (err) {
                console.error("Lock validation error:", err);
            }
        }
        
        // Handle routes with params (e.g. #/concept/diode)
        let params = {};
        let matchedRoute = this.routes.find(route => {
            const routeRegex = new RegExp('^' + route.path.replace(/:[a-zA-Z0-9]+/g, '([a-zA-Z0-9_-]+)') + '$');
            const match = routePath.match(routeRegex);
            if (match) {
                // Extract params
                const paramNames = (route.path.match(/:[a-zA-Z0-9]+/g) || []).map(p => p.slice(1));
                paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                return true;
            }
            return false;
        });

        if (!matchedRoute) {
            // Fallback to Home route
            matchedRoute = this.routes.find(r => r.path === '#/') || this.routes[0];
            routePath = '#/';
        }

        // 1. Lifecycle: Clean up the active view before changing routes
        if (this.activeView && typeof this.activeView.unmount === 'function') {
            try {
                this.activeView.unmount();
            } catch (err) {
                console.error("Error unmounting view:", err);
            }
        }

        // Close mobile nav drawer if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
        }

        // Apply a quick fade transition
        this.rootElement.style.opacity = '0';
        this.rootElement.style.transform = 'translateY(10px)';
        
        setTimeout(async () => {
            try {
                // 2. Load View Module
                const viewModule = await matchedRoute.loadView();
                this.activeView = viewModule;
                
                // 3. Render View HTML
                this.rootElement.innerHTML = await this.activeView.render(params);
                
                // 4. Update Navigation Links State
                this.updateActiveNav(matchedRoute.name);
                
                // Restore Opacity / Animate Entrance
                this.rootElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                this.rootElement.style.opacity = '1';
                this.rootElement.style.transform = 'translateY(0)';
                
                // 5. Lifecycle: Mount/Initialize simulation controls and visual elements
                if (typeof this.activeView.mount === 'function') {
                    this.activeView.mount(params);
                }
                
                // Re-trigger Lucide icon creation for dynamic DOM insertions
                if (window.lucide) {
                    window.lucide.createIcons();
                }
                
                // Render KaTeX math equations across the newly loaded view
                if (window.renderMathInElement) {
                    window.renderMathInElement(this.rootElement, {
                        delimiters: [
                            {left: '$$', right: '$$', display: true},
                            {left: '$', right: '$', display: false},
                            {left: '\\(', right: '\\)', display: false},
                            {left: '\\[', right: '\\]', display: true}
                        ],
                        throwOnError: false
                    });
                }
                
            } catch (error) {
                console.error(`Router error loading view for path ${routePath}:`, error);
                this.rootElement.innerHTML = `
                    <div class="glass-card flex-center" style="flex-direction: column; padding: 48px; text-align: center;">
                        <h2 style="color: var(--error); margin-bottom: 12px;">Component Connection Failure</h2>
                        <p>We encountered a resistance spike while loading this sector. Please try refreshing.</p>
                        <button onclick="window.location.reload()" class="btn btn-primary" style="margin-top: 16px;">
                            <i data-lucide="refresh-cw"></i> Reconnect Circuit
                        </button>
                    </div>
                `;
                if (window.lucide) window.lucide.createIcons();
                this.rootElement.style.opacity = '1';
                this.rootElement.style.transform = 'translateY(0)';
            }
        }, 150);
    }

    updateActiveNav(routeName) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            const isDashboardActive = linkRoute === 'dashboard' && (routeName === 'dashboard' || (routeName === 'home' && window.AppState && window.AppState.currentUser));
            if (linkRoute === routeName || isDashboardActive) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    initGlobalMathEvents() {
        // Global Copy Formula Listener
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.copy-formula-btn');
            if (btn) {
                e.stopPropagation();
                const formula = btn.getAttribute('data-formula');
                if (formula) {
                    navigator.clipboard.writeText(formula)
                        .then(() => {
                            const AppState = window.AppState;
                            if (AppState && typeof AppState.showToast === 'function') {
                                AppState.showToast("LaTeX formula copied to clipboard!", "success");
                            }
                        })
                        .catch(err => console.error("Failed to copy formula: ", err));
                }
            }
        });

        // Global Formula Zoom Listener
        document.addEventListener('click', (e) => {
            const container = e.target.closest('.formula-display-container');
            if (container) {
                e.stopPropagation();
                const formula = container.getAttribute('data-formula-zoom');
                if (formula) {
                    this.openFormulaZoomModal(formula);
                }
            }
        });
    }

    openFormulaZoomModal(formulaText) {
        let modal = document.getElementById('formula-zoom-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'formula-zoom-modal';
            modal.className = 'formula-zoom-modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="formula-zoom-content glass-card">
                <button class="formula-zoom-close" id="btn-close-zoom-modal">✕</button>
                <div class="formula-zoom-rendered">
                    $$\${formulaText}$$
                </div>
                <div class="formula-zoom-footer">
                    <button class="btn btn-secondary copy-zoom-btn" data-formula="\${formulaText}">
                        <i data-lucide="copy" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Copy LaTeX
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        
        if (window.renderMathInElement) {
            window.renderMathInElement(modal, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
        
        if (window.lucide) window.lucide.createIcons();
        
        const closeModal = () => {
            modal.classList.remove('open');
            document.body.style.overflow = ''; // Unlock scrolling
        };
        
        modal.querySelector('#btn-close-zoom-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        modal.querySelector('.copy-zoom-btn').addEventListener('click', (e) => {
            navigator.clipboard.writeText(formulaText)
                .then(() => {
                    const AppState = window.AppState;
                    if (AppState && typeof AppState.showToast === 'function') {
                        AppState.showToast("LaTeX formula copied to clipboard!", "success");
                    }
                });
        });
    }
}
