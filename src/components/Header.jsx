import { useState, useRef, useEffect } from "react";

// Inline icon components for clarity
const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <circle cx="10" cy="10" r="8.5" stroke="#374151" strokeWidth="1.5" />
    <path d="M2 10h16M10 2c-2.5 3-2.5 5-2.5 8s0 5 2.5 8M10 2c2.5 3 2.5 5 2.5 8s0 5-2.5 8" stroke="#374151" strokeWidth="1.5" />
  </svg>
);

const MenuIcon = ({ open }) => (
  <div className="flex flex-col justify-center" aria-hidden="true">
    <span className="w-6 h-0.5 bg-gray-700 mb-1 rounded" />
    <span className="w-6 h-0.5 bg-gray-700 mb-1 rounded" />
    <span className="w-6 h-0.5 bg-gray-700 rounded" />
  </div>
);

export const Header = ({ currentPage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const toggleMenu = () => setMenuOpen(o => !o);

  const handleNavigation = (page) => {
    onNavigate(page);
    setMenuOpen(false);
    // Return focus to toggle for accessibility
    toggleButtonRef.current?.focus();
  };

  // Close menu when user clicks outside or presses Escape key
  useEffect(() => {
    if (!menuOpen) return;
    
    const handleEscapeKey = (event) => { 
      if (event.key === 'Escape') setMenuOpen(false); 
    };
    
    const handleOutsideClick = (event) => { 
      if (menuRef.current && !menuRef.current.contains(event.target) && !toggleButtonRef.current.contains(event.target)) {
        setMenuOpen(false); 
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('mousedown', handleOutsideClick);
    
    return () => { 
      window.removeEventListener('keydown', handleEscapeKey); 
      window.removeEventListener('mousedown', handleOutsideClick); 
    };
  }, [menuOpen]);

  const handleMenuToggleKeyPress = (event) => {
    // Allow keyboard users to toggle menu with Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  };

  return (
    <>
      <header className="flex w-full h-[60px] items-center justify-end px-6 bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav aria-label="Main" className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Change language"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <GlobeIcon />
            <span className="font-medium">EN</span>
          </button>
          <button
            ref={toggleButtonRef}
            type="button"
            aria-label="Menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={toggleMenu}
            onKeyDown={handleMenuToggleKeyPress}
            className="flex items-center justify-center focus:outline-none p-2 -mr-2"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div id="site-menu" ref={menuRef} role="menu" aria-label="Site navigation" className="absolute right-4 top-16 bg-white rounded-lg shadow-lg z-50 w-48 py-2">
          <button
            role="menuitem"
            onClick={() => handleNavigation('home')}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${currentPage === 'home' ? 'bg-gray-50 font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            role="menuitem"
            onClick={() => handleNavigation('about')}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${currentPage === 'about' ? 'bg-gray-50 font-semibold' : ''}`}
          >
            About
          </button>
          <button
            role="menuitem"
            onClick={() => handleNavigation('contact')}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${currentPage === 'contact' ? 'bg-gray-50 font-semibold' : ''}`}
          >
            Contact
          </button>
        </div>
      )}
    </>
  );
};