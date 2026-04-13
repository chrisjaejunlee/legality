import Link from 'next/link'
import { Scale, Search, Users, Shield, Clock, CheckCircle, ArrowRight, Star, Phone, Gavel, BookOpen, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Legality</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                Testimonials
              </Link>
              <Link
                href="/query/new"
                className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Start Now
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 py-24 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <Shield className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-white/90">Trusted by 50,000+ users worldwide</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Instant Legal Guidance,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-accent-300">
                When You Need It Most
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Describe your legal situation and get instant analysis from similar cases, 
              AI-powered recommendations, and connect with qualified attorneys.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/query/new"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-lg font-semibold rounded-2xl hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center gap-2"
              >
                <Gavel className="w-5 h-5" />
                Get Legal Analysis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/query/new"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Emergency Mode
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-400" />
                <span className="text-slate-300">100% Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-400" />
                <span className="text-slate-300">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-400" />
                <span className="text-slate-300">Instant Results</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 -mt-20 relative">
              {[
                { icon: Search, title: 'Case Matching', desc: 'Find similar real-world cases instantly. Understand how situations like yours were resolved.', color: 'from-blue-500 to-blue-600' },
                { icon: BookOpen, title: 'AI Insights', desc: 'Get clear, actionable recommendations based on patterns across hundreds of cases.', color: 'from-accent-500 to-accent-600' },
                { icon: Users, title: 'Lawyer Connection', desc: 'Connect with qualified attorneys filtered by specialty, location, and experience.', color: 'from-secondary-500 to-secondary-600' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all hover:-translate-y-1">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Why Legality</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
                Everything You Need to Understand Your Legal Situation
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                From incident to resolution, we provide the tools and guidance to help you make informed decisions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Search, title: 'Smart Case Matching', description: 'Our AI searches through thousands of real cases to find the most relevant ones to your situation.' },
                { icon: TrendingUp, title: 'Outcome Analysis', description: 'See patterns in how similar cases were resolved and understand potential outcomes.' },
                { icon: Shield, title: 'Risk Assessment', description: 'Get an informed assessment of potential risks and consequences.' },
                { icon: Clock, title: '24/7 Availability', description: 'Legal situations do not follow business hours. Get guidance whenever you need it.' },
                { icon: BookOpen, title: 'Step-by-Step Guidance', description: 'Receive clear recommended next steps based on precedent.' },
                { icon: Users, title: 'Attorney Matching', description: 'Connect with qualified lawyers who specialize in your type of case.' },
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary-200 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Simple Process</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Get from confusion to clarity in three simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -translate-y-1/2 z-0" />
              
              {[
                { step: '01', icon: BookOpen, title: 'Describe Your Situation', description: 'Tell us what happened using natural language. Our AI understands context and nuance.' },
                { step: '02', icon: Search, title: 'Get AI Analysis', description: 'Receive insights based on similar cases, recommended actions, and risk assessment.' },
                { step: '03', icon: Users, title: 'Connect with Lawyers', description: 'Browse qualified attorneys who specialize in your type of case.' },
              ].map((item, index) => (
                <div key={index} className="relative z-10">
                  <div className="bg-white rounded-2xl p-8 text-center border-2 border-slate-100 hover:border-primary-200 hover:shadow-xl transition-all">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-primary via-primary-800 to-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Understand Your Legal Situation?
            </h2>
            <p className="text-xl text-primary-100 mb-10">
              Join thousands of people who have gained clarity on their legal matters with Legality.
            </p>
            <Link
              href="/query/new"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-white/20 transition-all"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Legality</span>
            </div>
            <p className="text-sm text-slate-400 text-center md:text-right">
              This service provides educational information only, not legal advice.
              <br />
              Always consult a licensed attorney for legal matters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}