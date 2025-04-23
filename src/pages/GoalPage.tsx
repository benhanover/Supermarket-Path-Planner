import { NavBar } from "../components/Navbar";

const GoalPage = () => {
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
            src="/assets/goals.png"
            alt="Goals Illustration"
            className="w-40 h-40 mb-8 object-contain drop-shadow-xl transition-transform duration-700 ease-in-out hover:scale-105"
          />
          <h2 className="text-5xl font-extrabold text-purple-900 mb-4 tracking-tight animate-fade-up">Our Goal</h2>
          <p className="text-gray-700 text-2xl font-light leading-relaxed mb-10 animate-fade-up delay-100">
            Our mission is to help shoppers receive the most efficient, fastest route through the supermarket — personalized to their list and location. With this, users save time, reduce frustration, and make sure nothing is forgotten.
            <br /><br />
            At the same time, we're helping store owners and managers build better layouts for optimized shopping experiences. With our platform, managing layouts, highlighting key products, and responding to traffic patterns becomes effortless — resulting in increased satisfaction, retention, and ultimately, sales.
          </p>

          <section className="bg-white bg-opacity-60 backdrop-blur-md rounded-xl p-10 shadow-xl w-full max-w-5xl text-left">
            <div className="space-y-10">
              <div className="animate-fade-up delay-150">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Why We Built This</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  A visit to the supermarket can feel inefficient and chaotic. Shoppers zigzag through aisles, revisit sections, or forget items. Our solution maps their shopping journey — smarter and simpler.
                  <br />
                  For store managers, this same system offers data-driven layout tools and real-time visibility that make adapting and optimizing the store environment easier than ever.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up delay-200">
                <div>
                  <h4 className="text-xl font-semibold text-purple-700 mb-2">User Benefits</h4>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    <li>Personalized, fastest path through the store</li>
                    <li>Reduced frustration, more accurate shopping</li>
                    <li>Less backtracking and better time efficiency</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-purple-700 mb-2">Store Benefits</h4>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    <li>Smarter layout design and item positioning</li>
                    <li>Actionable insights from shopper behavior</li>
                    <li>Adaptation to promotions and foot traffic trends</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 animate-fade-up delay-300">
                <p className="text-lg text-gray-800 font-medium">
                  <span className="font-bold text-purple-800">The Vision:</span> Optimize each step of the shopper’s journey, while empowering store owners with seamless tools.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default GoalPage;
