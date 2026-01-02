import {
  MapPin,
  BarChart3,
  CheckCircle,
  Github,
  ExternalLink,
  Users,
  Bell,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Report with Location",
      description:
        "Submit civic issues with photos, GPS location, and detailed descriptions",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Track Progress",
      description:
        "Monitor complaint status in real-time from submission to resolution",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Upvote Issues",
      description:
        "Support existing complaints to help authorities prioritize urgent matters",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Verify Solutions",
      description:
        "Confirm when issues are resolved to ensure quality and accountability",
    },
  ];

  const techStack = ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"];

  const teamMembers = [
    { name: "Daya Joshi", github: "https://github.com/dayaj1222" },
    { name: "Darshan Subedi", github: "https://github.com/darshan6424" },
    { name: "Bimin Koju", github: "https://github.com/biminkoju" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#DC143C] to-[#1E3A8A] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <Shield className="w-4 h-4" />
            Hackathon 2026 Project
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Civic Engagement Platform
          </h1>
          <p className="text-xl text-white/90">
            Connecting citizens with authorities to resolve civic issues
            efficiently
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* About Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            About the Platform
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
            A modern e-governance solution designed to bridge the gap between
            citizens and local authorities. Our platform makes reporting civic
            issues seamless and transparent, enabling communities to work
            together to build better cities. Report problems, track their status
            in real-time, and verify solutions with an intuitive, user-friendly
            interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#DC143C] transition-colors"
            >
              <div className="w-12 h-12 bg-[#DC143C]/10 rounded-lg flex items-center justify-center text-[#DC143C] mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Report",
                desc: "Submit civic issues with photos and location",
              },
              {
                step: "2",
                title: "Track",
                desc: "Monitor real-time progress and updates",
              },
              {
                step: "3",
                title: "Verify",
                desc: "Confirm resolution and provide feedback",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#DC143C] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Types */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 border-l-4 border-l-[#DC143C]">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[#DC143C]" />
              <h3 className="text-2xl font-bold text-gray-900">For Citizens</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Be the voice of change in your community
            </p>
            <ul className="space-y-3">
              {[
                "Quick registration process",
                "Report with photos and GPS",
                "Upvote existing complaints",
                "Real-time status updates",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 border-l-4 border-l-[#1E3A8A]">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-[#1E3A8A]" />
              <h3 className="text-2xl font-bold text-gray-900">
                For Authorities
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Manage and resolve issues efficiently
            </p>
            <ul className="space-y-3">
              {[
                "City-based registration",
                "Centralized dashboard",
                "Status management workflow",
                "Performance analytics",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech Stack & Credits */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Credits & Tech Stack
            </h2>
            <p className="text-gray-600">Built with modern web technologies</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Tech Stack */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-center text-sm uppercase tracking-wider">
                Built With
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-[#DC143C]/10 text-[#DC143C] border border-[#DC143C]/20 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub Repository */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    Open Source
                  </h3>
                  <p className="text-sm text-gray-600">
                    Check out the code on GitHub
                  </p>
                </div>
                <a
                  href="https://github.com/yourusername/egovernance-platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  View Repository
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Team Section */}
            <div className="text-center pt-6 border-t-2 border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Developed by</p>
              <p className="text-gray-900 font-bold text-xl mb-4">
                Glimpse of Starlight
              </p>

              {/* Team Members */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {teamMembers.map((member) => (
                  <a
                    key={member.name}
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#DC143C] transition-colors group"
                  >
                    <Github className="w-5 h-5 text-gray-600 group-hover:text-[#DC143C] transition-colors" />
                    <span className="text-sm text-gray-900 font-medium text-center">
                      {member.name}
                    </span>
                  </a>
                ))}
              </div>

              <p className="text-gray-600 text-sm">
                Made with ❤️ for Hackathon 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
