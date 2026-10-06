import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main application layout
 * Includes Header, content, and Footer
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky header at the top */}
      <Header />

      {/* Main content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Space for floating chatbot (Phase 5) */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Chatbot will go here */}
        {/* <AIChatbot /> */}
      </div>
    </div>
  );
}