import React, { useState, useMemo } from 'react';
import {
  Search,
  HelpCircle,
  BookOpen,
  Key,
  User,
  FileText,
  Briefcase,
  Send,
  Sparkles,
  GraduationCap,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Paperclip,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { id: 'account', label: 'Account & Login', icon: Key },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'applications', label: 'Applications', icon: Send },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  { id: 'college', label: 'College / Student Access', icon: GraduationCap }
];

const FAQ_DATA = [
  // Getting Started
  {
    category: 'getting-started',
    question: 'How do I get started with SkillSync-AI?',
    answer: 'Begin by completing your student profile. Add your education history, key technical skills, and projects. Once your profile is ready, upload your resume to unlock AI Career Intelligence, ATS scoring, and targeted job matches.'
  },
  {
    category: 'getting-started',
    question: 'What formats and file sizes are supported for resume uploads?',
    answer: 'SkillSync supports PDF (.pdf), Microsoft Word 97-2003 (.doc), and Microsoft Word (.docx) formats up to 10MB in size.'
  },
  {
    category: 'getting-started',
    question: 'How does SkillSync help with campus and direct placements?',
    answer: 'SkillSync connects students directly with verified job postings, allows recruiters to view matching candidate profiles, and provides real-time tracking from application to placement.'
  },

  // Account & Login
  {
    category: 'account',
    question: 'How do I change or reset my password?',
    answer: 'Navigate to Account Settings via the top-right profile dropdown menu in the navbar. In the Settings page, you can submit a password change request.'
  },
  {
    category: 'account',
    question: 'Why does my session expire and require re-login?',
    answer: 'SkillSync implements secure JWT tokens with refresh token rotation. If you remain inactive for an extended period, you may need to re-authenticate to protect your account data.'
  },
  {
    category: 'account',
    question: 'What should I do if I get an "Unauthorized" or "401" error?',
    answer: 'This typically means your session has expired. Sign out via the profile dropdown menu and sign back in to refresh your authentication tokens.'
  },

  // Profile
  {
    category: 'profile',
    question: 'How can I increase my Profile Completion score?',
    answer: 'Add your education history, at least 3 skills, projects with tech stack descriptions, and certifications under My Profile. A complete profile gives you better visibility with recruiters and improves AI analysis.'
  },
  {
    category: 'profile',
    question: 'Can I edit my education and projects after saving them?',
    answer: 'Yes! On your Student Profile page, each education entry and project card contains an "Edit" button that lets you update details anytime.'
  },

  // Resume
  {
    category: 'resume',
    question: 'How do I set my active primary resume?',
    answer: 'Under Profile > Resumes, each uploaded resume displays a "Set as Primary" button. Click it to designate that resume as your primary document for job applications.'
  },
  {
    category: 'resume',
    question: 'What happens during AI Resume Parsing?',
    answer: 'When you upload a resume, SkillSync extracts structured data including technical skills, education records, and experience to generate personalized recommendations and ATS job match scores.'
  },
  {
    category: 'resume',
    question: 'Can I view or download my uploaded resume?',
    answer: 'Yes, click "View File" on any resume card in your resume list to securely view and download your uploaded document.'
  },

  // Jobs
  {
    category: 'jobs',
    question: 'How do I search and filter available job openings?',
    answer: 'Visit the Jobs page to browse all active vacancies. You can search by role title, filter by job type (Full-time, Internship, Remote), and filter by location.'
  },
  {
    category: 'jobs',
    question: 'What does the Job Match score mean?',
    answer: 'The match score calculates how well your verified skills and resume align with the specific job description requirements, helping you prioritize where to apply.'
  },

  // Applications
  {
    category: 'applications',
    question: 'Where can I track the status of my job applications?',
    answer: 'Navigate to Applications from the sidebar. You can monitor each application through its stages: Submitted, Under Review, Shortlisted, Interview Scheduled, or Accepted.'
  },
  {
    category: 'applications',
    question: 'Can I withdraw an application after submitting?',
    answer: 'You can check your application details on the Applications page. For special requests or accidental submissions, contact the college placement cell or recruiter.'
  },

  // AI Assistant
  {
    category: 'ai',
    question: 'Why does the AI Career Intelligence say "Complete your profile"?',
    answer: 'The AI assistant generates tailored advice based on your verified skills, education, and resume. If your profile is new or empty, add your basic details and upload a resume to generate your Career Blueprint.'
  },
  {
    category: 'ai',
    question: 'How are Skill Gap recommendations generated?',
    answer: 'SkillSync compares your skills profile with prevailing market demands and specific job postings to identify high-value skills and recommended capstone projects.'
  },

  // College / Student Access
  {
    category: 'college',
    question: 'Do students without a college code or tenant ID have full access?',
    answer: 'Yes! SkillSync allows independent students to build profiles, upload resumes, receive AI recommendations, and apply for opportunities without blocking access.'
  },
  {
    category: 'college',
    question: 'How can my college or institution get registered on SkillSync?',
    answer: 'College administrators can request onboarding via the Contact Support form below to manage on-campus placements, batches, and corporate recruitment drives.'
  }
];

const Support = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  // Support ticket form state
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState('General Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [formPriority, setFormPriority] = useState('Medium');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submittedTickets, setSubmittedTickets] = useState([]);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! Welcome to SkillSync Support Assistant. How can we assist you today?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Filter FAQs by search and category
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (index) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const handleSupportFormSubmit = (e) => {
    e.preventDefault();
    if (!formSubject.trim() || !formMessage.trim()) {
      toast.error('Please enter a subject and message');
      return;
    }

    setIsSubmittingForm(true);
    setTimeout(() => {
      const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
      const newTicket = {
        id: ticketId,
        subject: formSubject,
        category: formCategory,
        priority: formPriority,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Open'
      };

      setSubmittedTickets([newTicket, ...submittedTickets]);
      setIsSubmittingForm(false);
      setFormSubject('');
      setFormMessage('');
      toast.success(`Support ticket ${ticketId} created successfully! Our team will respond shortly.`);
    }, 600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      let botReply = "Thank you for reaching out! Our support specialists are available. If this relates to profile or resume upload, make sure your file is a PDF/DOC/DOCX under 10MB.";

      const lower = userText.toLowerCase();
      if (lower.includes('resume') || lower.includes('upload')) {
        botReply = "For resumes: You can upload PDF, DOC, or DOCX files up to 10MB under your Profile page. Make sure to set your active resume as Primary.";
      } else if (lower.includes('password') || lower.includes('login') || lower.includes('auth')) {
        botReply = "For login and passwords: You can update your credentials in Account Settings via the top-right profile menu.";
      } else if (lower.includes('job') || lower.includes('apply')) {
        botReply = "You can view active openings under the Jobs tab and track current statuses on the Applications page.";
      } else if (lower.includes('ai') || lower.includes('recommend')) {
        botReply = "SkillSync AI uses your profile skills, education, and resume data to deliver personalized career roadmaps and ATS scores.";
      }

      const replyMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, replyMsg]);
      setIsBotTyping(false);
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-2xl p-8 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold backdrop-blur-sm mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> SkillSync Help & Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How can we help you?</h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2">
            Search our knowledge base for answers regarding accounts, resumes, jobs, AI intelligence, and campus access.
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, e.g. resume upload, AI recommendations, jobs..."
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 placeholder-gray-400 rounded-xl text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FAQ_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: FAQs & Live Support Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: FAQ List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-900">
              Frequently Asked Questions ({filteredFaqs.length})
            </h2>
            {searchQuery && (
              <span className="text-xs text-gray-500">Showing results for "{searchQuery}"</span>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 text-base">No matching answers found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try searching with different keywords or submit a support ticket below.
              </p>
              <Button size="sm" variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                Reset Search
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Instant Chat Support Widget */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">SkillSync Support Chat</h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-gray-50/50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs pl-2">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-100">•</span>
                <span className="animate-bounce delay-200">•</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Support Ticket Request Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5 text-blue-600 mb-1">
            <Mail className="w-5 h-5" />
            <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Need further assistance with your account, profile, or application? Submit a support request and our team will get back to you.
          </p>

          <form onSubmit={handleSupportFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Topic Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Account & Login">Account & Login</option>
                  <option value="Resume & Profile">Resume & Profile</option>
                  <option value="Job Applications">Job Applications</option>
                  <option value="AI Assistant">AI Assistant</option>
                  <option value="College Access">College Access</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                placeholder="Brief summary of the issue"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Details</label>
              <textarea
                rows={4}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="Please describe what you experienced and what assistance you need..."
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmittingForm}>
                {isSubmittingForm ? 'Submitting...' : 'Submit Support Request'}
              </Button>
            </div>
          </form>

          {/* Active Tickets List */}
          {submittedTickets.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Your Submitted Requests ({submittedTickets.length})</h3>
              <div className="space-y-2">
                {submittedTickets.map((t) => (
                  <div key={t.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-[11px] text-blue-600 font-semibold">{t.id}</span>
                      <p className="font-semibold text-gray-800 text-xs mt-0.5">{t.subject}</p>
                      <span className="text-[11px] text-gray-400">{t.category} • {t.date}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
