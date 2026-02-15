/* Placeholder screens for the carousel viewer */

export interface ScreenData {
  id: string;
  title: string;
  url: string;
  label: string;
}

export const screens: ScreenData[] = [
  {
    id: 'screen-1',
    title: 'Dashboard',
    url: 'app.stackbirds.io/dashboard',
    label: 'Loaded',
  },
  {
    id: 'screen-2',
    title: 'User Profile',
    url: 'app.stackbirds.io/profile',
    label: 'Clicked',
  },
  {
    id: 'screen-3',
    title: 'Settings',
    url: 'app.stackbirds.io/settings',
    label: 'Navigated',
  },
  {
    id: 'screen-4',
    title: 'Notifications',
    url: 'app.stackbirds.io/notifications',
    label: 'Opened',
  },
  {
    id: 'screen-5',
    title: 'Checkout',
    url: 'app.stackbirds.io/checkout',
    label: 'Completed',
  },
];
