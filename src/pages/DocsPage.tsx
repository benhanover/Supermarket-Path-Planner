import { NavBar } from "../components/Navbar";

const DocsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen font-sans bg-gradient-to-br from-white to-purple-50 overflow-hidden">
      <img
        src="/bg-blue.svg"
        alt="background blob"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 -z-10"
      />


      <NavBar />

      <main className="py-20 px-6 animate-fade-in text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <img
            src="public/assets/docsimage.png"
            alt="Docs Illustration"
            className="w-48 h-48 mb-8 object-contain drop-shadow-xl transition-transform duration-700 ease-in-out hover:scale-105"
          />
          <h2 className="text-5xl font-extrabold text-cyan-800 mb-4 tracking-tight">Documentation</h2>
          <p className="text-gray-700 text-2xl font-light leading-relaxed mb-10 ">
            Explore in-depth technical guides, integration workflows, and developer APIs to seamlessly implement and scale your supermarket path planning platform.
          </p>

          <section className="bg-white bg-opacity-60 backdrop-blur-md rounded-xl p-10 shadow-xl w-full max-w-5xl text-left">
            <div className="space-y-10">
              <div className="">
                <h3 className="text-2xl font-bold text-cyan-800 mb-2">Get Started with Supermarket Path Planner</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Our documentation is here to support store managers, developers, and operational teams to quickly onboard, deploy,
                  and integrate our platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-cyan-700 mb-2">Key Sections</h4>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    <li>Interactive layout editor</li>
                    <li>Grocery list integration & optimization</li>
                    <li>Live store analytics setup</li>
                    <li>Import/export floor plans and inventory</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-cyan-700 mb-2">Developer Tools</h4>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    <li>API endpoints and usage</li>
                    <li>Authentication with AWS Cognito</li>
                    <li>Real-time sync with cloud database</li>
                    <li>Webhooks for layout changes</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 ">
                <p className="text-lg text-gray-800 font-medium">
                  <span className="font-bold text-cyan-800">Need Help?</span> Our team is here to guide you. Reach out through the help center or explore step-by-step tutorials in our portal.
                </p>
              </div>

              <div className="mt-12 flex flex-col items-center gap-4 ">
                <a
                  href="https://github.com/benhanover/Supermarket-Path-Planner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 underline hover:text-cyan-900 font-medium"
                >
                  View Project on GitHub ↗
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocsPage;
