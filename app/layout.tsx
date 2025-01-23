import './globals.css';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeRegistry } from '@/components/ThemeRegistry';
import { WeatherProvider } from '@/context/WeatherContext';

export const metadata: Metadata = {
  title: 'Weather Widget',
  description: 'Weather Widget Demo with Material-UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <WeatherProvider>
              {children}
            </WeatherProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}