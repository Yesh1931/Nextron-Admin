/**
 * Nextron - Home Route Entrypoint View
 * Route: #/
 * Dynamically delegates rendering and mounting based on user session state.
 */

import { AppState } from './app.js';

export const render = async () => {
    const user = AppState.currentUser;
    
    if (user) {
        // Dynamic lazy-loading of the premium ECE Academic Progress Dashboard
        const dashboard = await import('./dashboard.js');
        return dashboard.render();
    } else {
        // Dynamic lazy-loading of the visually beautiful guest landing view
        const landing = await import('./index-pre-login.js');
        return landing.render();
    }
};

export const mount = () => {
    const user = AppState.currentUser;
    
    if (user) {
        import('./dashboard.js').then(dashboard => dashboard.mount());
    } else {
        import('./index-pre-login.js').then(landing => landing.mount());
    }
};

export const unmount = () => {
    const user = AppState.currentUser;
    
    if (user) {
        import('./dashboard.js').then(dashboard => dashboard.unmount()).catch(() => {});
    } else {
        import('./index-pre-login.js').then(landing => landing.unmount()).catch(() => {});
    }
};
