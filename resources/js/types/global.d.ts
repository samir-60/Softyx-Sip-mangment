import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { PageProps as AppPageProps } from './index.d';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    interface ZiggyRouter {
        current: (name?: string, params?: Record<string, unknown>) => boolean;
        params: Record<string, unknown>;
    }

    interface ZiggyRouteFn {
        (): ZiggyRouter;
        (name: string, params?: Record<string, unknown> | number | string, absolute?: boolean): string;
    }

    /* eslint-disable no-var */
    var route: ZiggyRouteFn;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
