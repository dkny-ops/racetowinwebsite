import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">

      <div className="mx-auto max-w-3xl">

        <Link
          href="/"
          className="text-sm font-bold text-cyan-400 hover:text-cyan-300"
        >
          ← BACK TO HOME
        </Link>

        <h1 className="mt-10 text-4xl font-black">
          Privacy Policy
        </h1>

        <p className="mt-4 text-gray-500">
          Last updated: August 13, 2026
        </p>

        <div className="mt-10 space-y-8 leading-relaxed text-gray-300">

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Introduction
            </h2>

            <p>
              Welcome to Race To Win. We respect your privacy and are committed
              to protecting information that may be collected when you use our
              website and game.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Information We Collect
            </h2>

            <p>
              Race To Win may store certain game-related information, such as
              player names, scores, game progress, and preferences. Some
              information may be stored locally in your browser.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Cookies and Advertising
            </h2>

            <p>
              Our website may use cookies or similar technologies to improve
              the experience and to support advertising services. Third-party
              advertising providers may use cookies to show relevant
              advertisements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Third-Party Services
            </h2>

            <p>
              We may use third-party services for analytics, hosting,
              advertising, or other website functionality. These services may
              collect information according to their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Child Privacy
            </h2>

            <p>
              Race To Win is not intended to knowingly collect personal
              information from children. If you believe that a child has
              provided personal information, please contact us so that we can
              take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Changes to This Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-white">
              Contact
            </h2>

            <p>
              If you have questions about this Privacy Policy, please contact
              the Race To Win website owner.
            </p>
          </section>

        </div>

      </div>

    </main>
  );
}