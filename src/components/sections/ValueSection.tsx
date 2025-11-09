import { 
  Users, 
  Shield, 
  Heart
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Evidence-based care quality",
    description: "Our mental health professionals deliver evidence-based care, avoiding unnecessary and ineffective treatments that delay recovery and drive up benefit costs.",
    features: [
      "Accredited and vetted care",
      "Regular clinical audits",
      "Improved health outcomes"
    ]
  },
  {
    icon: Users,
    title: "Personalized experience",
    description: "Our in-house primary care, mental health, and EAP practitioners work together to deliver a seamless experience, tailored to each member's unique needs.",
    features: [
      "Speed up return to function",
      "Guide the member throughout their care journey",
      "Promote proactive, ongoing well-being"
    ]
  },
  {
    icon: Heart,
    title: "Integrated Health Platform",
    description: "Tear down the walls between benefits. Improve team well-being with our integrated platform that centralizes care programs in a single application.",
    features: [
      "24/7/365 access to services",
      "Coordinated care approach",
      "Seamless provider collaboration"
    ]
  }
];

export default function ValueSection() {
  return (
    <section className="relative py-24 bg-linear-to-b from-accent to-accent overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#8b7355] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4a574] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Staggered Grid Layout - Stairs Pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {/* First Column - Starts at top with card */}
          <div className="lg:mt-0">
            <ValueCard value={values[0]} index={0} />
          </div>

          {/* Second and Third Columns with Header Text on top */}
          <div className="lg:col-span-2">
            {/* Section Header - aligned to start */}
            <div className="text-left mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#2c2416] mb-4">
                Tear down the walls between benefits.
              </h2>
              <p className="text-xl md:text-2xl text-[#2c2416] font-semibold mb-6">
                Improve team well-being with Dialogue.
              </p>
              <p className="text-base md:text-lg text-gray-700 font-normal leading-relaxed pb-27">
                Overspending on benefits programs with a web of providers?
                Struggling to boost team productivity and measure ROI? You've
                come to the right place. Our{" "}
                <span className="font-semibold">
                  Integrated Health Platform™
                </span>{" "}
                is a one-stop care hub that centralizes our programs in a single
                application, providing access to services 24/7/365.
              </p>
            </div>

            {/* Nested grid for second and third columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Second Column */}
              <div>
                <ValueCard value={values[1]} index={1} />
              </div>

              {/* Third Column - Starts at half height */}
              <div className="lg:mt-64">
                <ValueCard value={values[2]} index={2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  value,
  index,
}: {
  value: (typeof values)[0];
  index: number;
}) {
  const Icon = value.icon;

  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-gray-900 rounded-2xl shrink-0">
          <Icon className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-medium text-gray-900 leading-tight">
          {value.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-xl text-gray-600 mb-10 leading-relaxed text-justify">
        {value.description}
      </p>

      {/* Features List - Simple bullets */}
      <ul className="space-y-6">
        {value.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-lg text-gray-700">
            <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
