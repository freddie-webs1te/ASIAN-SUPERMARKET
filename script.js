document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('[data-landingsite-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-landingsite-mobile-menu]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
});
