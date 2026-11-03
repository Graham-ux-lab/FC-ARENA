'use client';
export default function MobileMenuButton() {
  const toggleMenu = () => {
    const nav = document.getElementById('main-nav');
    if (nav) nav.classList.toggle('menu-open');
  };
  return (
    <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}