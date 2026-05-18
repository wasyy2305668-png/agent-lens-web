'use client';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#fbfbfa] text-neutral-800 p-8 sm:p-16 max-w-2xl mx-auto font-sans leading-relaxed">
      <h1 className="text-3xl font-extrabold text-neutral-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-neutral-500 mb-8">Last updated: May 18, 2026</p>
      
      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">1. Information We Collect</h2>
          <p>Recipe & Fluff Purifier PRO processes recipe URLs submitted by the user. Our Chrome Extension extracts content locally from the active browser tab to ensure maximum privacy.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">2. How We Use Data</h2>
          <p>Any data processed through our web tool or browser extension is used strictly for stripping advertisements, trackers, and non-recipe content. We do not store, save, or harvest your personal browsing history.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">3. Data Sharing & Third Parties</h2>
          <p>We do not sell, trade, or transfer your data to outside parties. Custom web searches are processed securely through our dedicated API endpoint and are never stored permanently.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Local Storage</h2>
          <p>Our website utilizes local storage (localStorage) strictly to manage your daily free usage limits and premium PRO activation status locally on your device.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">5. Contact Us</h2>
          <p>If you have any questions regarding this privacy policy, you may contact us through our official support channels on our Ko-fi page.</p>
        </section>
      </div>
    </main>
  );
}