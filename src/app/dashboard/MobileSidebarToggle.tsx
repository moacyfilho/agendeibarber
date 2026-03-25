'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function MobileSidebarToggle() {
  const pathname = usePathname();

  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const close = () => {
      sidebar?.classList.remove('open');
      overlay?.classList.remove('active');
      document.body.style.overflow = '';
    };

    const toggle = () => {
      const isOpen = sidebar?.classList.contains('open');
      if (isOpen) {
        close();
      } else {
        sidebar?.classList.add('open');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    // Bind all buttons with id "mobile-menu-btn"
    const btns = document.querySelectorAll('#mobile-menu-btn');
    btns.forEach(btn => btn.addEventListener('click', toggle));
    overlay?.addEventListener('click', close);

    return () => {
      btns.forEach(btn => btn.removeEventListener('click', toggle));
      overlay?.removeEventListener('click', close);
    };
  }, []);

  // Close sidebar on navigation
  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }, [pathname]);

  return (
    <div
      id="sidebar-overlay"
      className="mobile-overlay lg:hidden"
    />
  );
}
