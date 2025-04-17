// File: src/pages/AboutPage.jsx
const AboutPage = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-white to-purple-50 animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <img
          src="/assets/about.png"
          alt="About Illustration"
          className="w-40 h-40 mb-6 object-contain transition-transform duration-700 ease-in-out hover:scale-110"
        />
        <h2 className="text-5xl font-extrabold text-purple-900 mb-4 tracking-tight animate-fade-up">About Our Tool</h2>
        <p className="text-gray-800 text-2xl font-light leading-snug max-w-xl mb-12 animate-fade-up delay-100">
          We help supermarket managers streamline the design and optimization of their store layouts.
        </p>

        <div className="text-left max-w-3xl w-full space-y-10">
          <div className="animate-fade-up delay-150">
            <h3 className="text-2xl font-bold text-purple-800 mb-2">Optimizing the Shopping Experience with Cloud Technology</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              In a world where time is one of our most valuable resources, grocery shopping often remains an inefficient and time-consuming task. Our solution, the Supermarket Path Planner, is here to change that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up delay-200">
            <div>
              <h4 className="text-xl font-semibold text-purple-700 mb-2">Customer Perspective</h4>
              <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                <li>Struggle to locate items in supermarkets</li>
                <li>Frequent backtracking and inefficient routes</li>
                <li>Unclear or outdated store layouts</li>
                <li>Managing recurring grocery lists manually</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-purple-700 mb-2">Store Owner Perspective</h4>
              <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                <li>Difficulty communicating layout changes</li>
                <li>Missed opportunities to optimize product placement</li>
                <li>Lack of visibility into customer shopping behavior</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 animate-fade-up delay-300">
            <p className="text-lg text-gray-800 font-medium">
              <span className="font-bold text-purple-800">Key Point:</span> Both customers and store owners need a real-time, efficient navigation solution.
            </p>
          </div>

          <div className="mt-10 text-sm text-gray-500 animate-fade-up delay-500">
            <p><span className="font-semibold text-gray-700">Team Members:</span> Guy Sofer, Ben Hanover, Alicia Belhassen</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
