import { Link } from "react-router-dom";

const GoalPage = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-white to-purple-100 animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <img
          src="/assets/goals.png"
          alt="Goals Illustration"
          className="w-36 h-36 mb-6 object-contain transition-transform duration-700 ease-in-out hover:scale-110"
        />
        <h2 className="text-5xl font-extrabold text-purple-900 mb-4 tracking-tight animate-fade-up">Our Goal</h2>
        <p className="text-gray-800 text-2xl font-light leading-snug max-w-2xl mb-12 animate-fade-up delay-100">
          Helping store owners and managers build better layouts for optimized shopping experiences.
        </p>

        <div className="text-left max-w-3xl w-full space-y-10">
          <div className="animate-fade-up delay-150">
            <h3 className="text-2xl font-bold text-purple-800 mb-2">Why We Built This</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Store layouts can make or break the customer journey. A well-organized store saves time, boosts satisfaction,
              and increases sales. Our mission is to empower managers with cloud-driven tools that simplify store design,
              improve traffic flow, and adapt to changing customer behaviors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up delay-200">
            <div>
              <h4 className="text-xl font-semibold text-purple-700 mb-2">Efficiency</h4>
              <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                <li>Design faster and smarter layouts</li>
                <li>Reduce customer backtracking</li>
                <li>Highlight high-demand products</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-purple-700 mb-2">Adaptability</h4>
              <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                <li>Update floor plans in real time</li>
                <li>React to seasonal changes and promotions</li>
                <li>Improve based on shopper insights</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 animate-fade-up delay-300">
            <p className="text-lg text-gray-800 font-medium">
              <span className="font-bold text-purple-800">Our Vision:</span> Intelligent, responsive supermarket planning for a better shopping experience.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link to="/docs" className="text-purple-700 underline hover:text-purple-900 font-medium">
              Explore Store Map →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalPage;
