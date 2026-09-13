import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  FileText,
  LineChart,
  Target,
  Briefcase,
  TrendingUp,
  User,
  Users,
  Building2,
  ArrowRight
} from 'lucide-react';

const Navbar = () => (
  <nav className="fixed w-full z-50 top-0 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SkillSync</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black -z-10" />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 -z-10" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
        Your Career. <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Powered by Intelligence.
        </span>
      </h1>

      <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto mb-10">
        SkillSync helps students understand their skills, improve their resumes, discover opportunities, and make smarter career decisions using AI.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/register"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/50"
        >
          Get Started
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors group">
    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900/30 transition-colors">
      <Icon className="w-6 h-6 text-blue-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    { icon: Brain, title: 'Skill Intelligence', description: 'Analyze your current skill set and identify crucial gaps.' },
    { icon: FileText, title: 'Resume Analysis', description: 'AI-driven parsing and optimization for ATS compatibility.' },
    { icon: LineChart, title: 'AI Career Insights', description: 'Receive personalized recommendations based on market trends.' },
    { icon: Target, title: 'Job Matching', description: 'Get matched with opportunities that fit your unique profile.' },
    { icon: Briefcase, title: 'Application Tracking', description: 'Manage your applications seamlessly in one dashboard.' },
    { icon: TrendingUp, title: 'Placement Analytics', description: 'Colleges and recruiters gain deep insights into placement metrics.' },
  ];

  return (
    <section id="features" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to accelerate your transition from campus to career.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Four simple steps to unlock your career potential.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { step: '1', title: 'Create Your Profile', desc: 'Sign up and build your baseline portfolio.' },
          { step: '2', title: 'Build Your Skills', desc: 'Add your education, projects, and skills.' },
          { step: '3', title: 'Get AI Insights', desc: 'Receive ATS scoring and personalized roadmaps.' },
          { step: '4', title: 'Find Opportunities', desc: 'Connect with recruiters and track applications.' },
        ].map((item, idx) => (
          <div key={idx} className="relative text-center">
            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 relative z-10 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              {item.step}
            </div>
            {idx < 3 && <div className="hidden md:block absolute top-8 left-[50%] w-full h-[2px] bg-gray-800 -z-0"></div>}
            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const UsersSection = () => (
  <section className="py-24 bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">Built for Everyone</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">SkillSync connects the entire placement ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
          <User className="w-10 h-10 text-blue-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Student</h3>
          <p className="text-gray-400">Discover your skill gaps, optimize your resume with AI, and land the perfect role.</p>
        </div>
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
          <Briefcase className="w-10 h-10 text-green-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Recruiter</h3>
          <p className="text-gray-400">Find candidates that perfectly match your requirements without the manual screening overhead.</p>
        </div>
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
          <Building2 className="w-10 h-10 text-purple-400 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">College</h3>
          <p className="text-gray-400">Manage batches, track placement metrics in real-time, and improve student outcomes.</p>
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-blue-900/20" />
    <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
      <h2 className="text-4xl font-bold text-white mb-6">Start Building Your Career Smarter.</h2>
      <p className="text-xl text-gray-300 mb-10">Join thousands of students and recruiters already using SkillSync.</p>
      <Link
        to="/register"
        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-blue-900 bg-white hover:bg-gray-100 transition-all shadow-xl"
      >
        Create Your Account
        <ArrowRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-950 py-12 border-t border-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-blue-500" />
        <span className="text-2xl font-bold text-white tracking-tight">SkillSync</span>
      </div>
      <p className="text-gray-500">AI-Powered Career Intelligence Platform</p>
      <p className="text-gray-600 text-sm mt-8">© {new Date().getFullYear()} SkillSync. All rights reserved.</p>
    </div>
  </footer>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100 selection:bg-blue-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <UsersSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
