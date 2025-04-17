// File: src/pages/DocsPage.jsx
import { Link } from "react-router-dom";

const DocsPage = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-white to-purple-100 animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <img
          src="/assets/docs.png"
          alt="Docs Illustration"
          className="w-60 h-60 mb-6 object-contain transition-transform duration-700 ease-in-out hover:scale-110"
        />
        <h2 className="text-5xl font-extrabold text-purple-900 mb-4 tracking-tight animate-fade-up">Documentation</h2>
        <p className="text-gray-800 text-2xl font-light leading-snug max-w-2xl mb-12 animate-fade-up delay-100">
          Learn how to manage your supermarket layout and product mapping using our intuitive tools and cloud-based system.
        </p>

        <div className="text-left max-w-3xl w-full space-y-10">
          <div className="animate-fade-up delay-150">
            <h3 className="text-2xl font-bold text-purple-800 mb-2">Get Started with Supermarket Path Planner</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our documentation is here to support store managers, developers, and operational teams to quickly onboard, deploy,
              and integrate our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up delay-200">
            <div>
              <h4 className="text-xl font-semibold text-purple-700 mb-2">Key Sections</h4>
              <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                <li>Interactive layout editor</li>
                <li>Grocery list integration & optimization</li>
                <li>Live store analytics setup</li>
                <li>Import/export floor plans and inventory</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-purple-700 mb-2">Developer Tools</h4>
              <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                <li>API endpoints and usage</li>
                <li>Authentication with AWS Cognito</li>
                <li>Real-time sync with cloud database</li>
                <li>Webhooks for layout changes</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 animate-fade-up delay-300">
            <p className="text-lg text-gray-800 font-medium">
              <span className="font-bold text-purple-800">Need Help?</span> Our team is here to guide you. Reach out through the help center or explore step-by-step tutorials in our portal.
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 animate-fade-up delay-500">
            <Link to="/" className="text-purple-700 underline hover:text-purple-900 font-medium">
              Back to Home →
            </Link>
            <a
              href="https://github.com/benhanover/Supermarket-Path-Planner"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 underline hover:text-purple-900 font-medium"
            >
              View Project on GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocsPage;
