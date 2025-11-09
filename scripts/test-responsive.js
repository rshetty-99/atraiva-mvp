/**
 * Responsive Design Testing Script
 * Tests all pages across different viewport sizes
 */

const pages = {
  public: [
    { path: '/', name: 'Homepage' },
    { path: '/home', name: 'Home' },
    { path: '/features', name: 'Features' },
    { path: '/resources', name: 'Resources' },
    { path: '/aboutus', name: 'About Us' },
    { path: '/contact-us', name: 'Contact Us' },
    { path: '/price', name: 'Pricing' },
  ],
  dashboard: [
    { path: '/admin/dashboard', name: 'Admin Dashboard' },
    { path: '/admin/blog', name: 'Admin Blog' },
    { path: '/admin/members', name: 'Admin Members' },
    { path: '/admin/organization', name: 'Admin Organizations' },
    { path: '/org/dashboard', name: 'Org Dashboard' },
    { path: '/org/profile', name: 'Org Profile' },
    { path: '/org/incidents', name: 'Org Incidents' },
  ],
};

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'desktop-large', width: 1920, height: 1080 },
];

module.exports = { pages, viewports };

