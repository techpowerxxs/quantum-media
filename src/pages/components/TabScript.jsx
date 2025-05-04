import { useEffect } from 'react';

export default function TabScript() {
  useEffect(() => {
    const showTab = (tabId) => {
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach((content) => {
        content.classList.add('hidden');
      });

      // Reset tab styles
      document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.remove('border-blue-500', 'text-gray-800');
        tab.classList.add('text-gray-600');
      });

      // Show selected tab content
      const content = document.getElementById(tabId);
      const tabButton = document.getElementById(`tab-${tabId}`);
      if (content && tabButton) {
        content.classList.remove('hidden');
        tabButton.classList.add('border-blue-500', 'text-gray-800');
        tabButton.classList.remove('text-gray-600');
      }
    };

    // Add event listeners to tab buttons
    document.querySelectorAll('.tab').forEach((btn) => {
      const id = btn.id.replace('tab-', '');
      btn.addEventListener('click', () => showTab(id));
    });

    // Set default tab
    showTab('home');
  }, []);

  return null; // No visual output
}
