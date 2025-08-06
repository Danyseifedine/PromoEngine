// Polyfill for React 19/18 compatibility with rete-react-plugin
import { createRoot, Root } from 'react-dom/client';

// Store roots to properly unmount them later
const rootsMap = new WeakMap<HTMLElement, Root>();

// Create a legacy render function for React 19/18
const legacyRender = (element: React.ReactElement, container: HTMLElement, callback?: () => void) => {
    let root = rootsMap.get(container);
    if (!root) {
        root = createRoot(container);
        rootsMap.set(container, root);
    }
    root.render(element);
    if (callback) {
        // Use setTimeout to ensure callback runs after render
        setTimeout(callback, 0);
    }
};

const legacyUnmount = (container: HTMLElement) => {
    const root = rootsMap.get(container);
    if (root) {
        root.unmount();
        rootsMap.delete(container);
        return true;
    }
    return false;
};

// Global polyfill - this ensures rete-react-plugin can find ReactDOM.render
if (typeof window !== 'undefined') {
    // @ts-ignore
    if (!window.ReactDOM) {
        // @ts-ignore
        window.ReactDOM = {
            render: legacyRender,
            unmountComponentAtNode: legacyUnmount
        };
    } else {
        // @ts-ignore
        if (!window.ReactDOM.render) {
            // @ts-ignore
            window.ReactDOM.render = legacyRender;
        }
        // @ts-ignore
        if (!window.ReactDOM.unmountComponentAtNode) {
            // @ts-ignore
            window.ReactDOM.unmountComponentAtNode = legacyUnmount;
        }
    }
}

// Also patch the module exports for good measure
import * as ReactDOM from 'react-dom';
// @ts-ignore
if (!ReactDOM.render) {
    // @ts-ignore
    ReactDOM.render = legacyRender;
}
// @ts-ignore
if (!ReactDOM.unmountComponentAtNode) {
    // @ts-ignore
    ReactDOM.unmountComponentAtNode = legacyUnmount;
}