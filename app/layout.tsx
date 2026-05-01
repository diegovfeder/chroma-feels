import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chroma Feels — How humanity encodes emotion in color',
  description: 'An interactive explorer mapping the relationship between colors and emotions across cultures, languages, psychology research, and fiction.',
  keywords: ['color psychology', 'emotion', 'culture', 'language', 'cross-cultural'],
  authors: [{ name: 'Diego Feder' }],
  openGraph: {
    title: 'Chroma Feels',
    description: 'How humanity encodes emotion in color — across cultures, languages, psychology, and fiction.',
    url: 'https://chromafeels.com',
    siteName: 'Chroma Feels',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Chroma Feels — Color × Emotion × Culture × Language',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
