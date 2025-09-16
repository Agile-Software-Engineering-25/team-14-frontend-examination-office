import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { cssLifecycleFactory } from 'vite-plugin-single-spa/ex';
import App from './App';
import { setGlobalUser } from './hooks/useUser';

const lifecycle = singleSpaReact({
  React,
  ReactDOMClient,
  errorBoundary(err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return <div>Error: {message}</div>;
  },
  rootComponent: (props: any) => {
    // Extract user from props and set it globally
    const { user, ...appProps } = props;

    // Set user data globally for the hook
    setGlobalUser(user);

    // Pass only non-user props to App
    return <App {...appProps} />;
  },
});
// IMPORTANT:  Because the file is named spa.tsx, the string 'spa'
// must be passed to the call to cssLifecycleFactory.
// IMPORTANT:  Because the file is named singleSpa.tsx, the string 'singleSpa'
// must be passed to the call to cssLifecycleFactory.
const cssLc = cssLifecycleFactory('singleSpa' /* optional factory options */);
export const bootstrap = [cssLc.bootstrap, lifecycle.bootstrap];
export const mount = [cssLc.mount, lifecycle.mount];
export const unmount = [cssLc.unmount, lifecycle.unmount];
