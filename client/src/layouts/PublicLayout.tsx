import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { mockStore } from '../lib/mockStore';
import {
  Phone,
  Clock,
  Calendar,
  MessageCircle,
  MapPin,
  Globe,
  Menu,
  X,
  ShieldAlert,
  ChevronRight,
  User,
  LogOut,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PublicLayout: React.FC = () => {
  const [, setTick] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const activeUser = mockStore.getActiveUser();
  const activeRole = mockStore.getActiveRole();
  const branding = clinic.branding;
  const settings = clinic.settings;

  const handleLogout = () => {
    mockStore.logout();
    navigate('/');
  };

  const getPortalPath = () => {
    if (activeRole === 'RECEPTIONIST') return '/staff/reception';
    if (activeRole === 'DOCTOR') return '/staff/doctor';
    if (activeRole === 'CLINIC_ADMIN') return '/staff/admin';
    if (activeRole === 'SUPER_ADMIN') return '/super-admin';
    return '/patient/dashboard';
  };

  // If a role is actively logged in, they are redirected to their portal.
  // They must first logout to browse the public website.
  useEffect(() => {
    if (activeUser && activeRole && location.pathname !== '/book') {
      navigate(getPortalPath(), { replace: true });
    }
  }, [activeUser, activeRole, location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'About Us', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  const whatsappUrl = `https://wa.me/${branding.whatsappNumber}?text=${encodeURIComponent(
    branding.whatsappPrefilledMessage
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="h-3.5 w-3.5 text-sky-400" />
              <span>Tel: {branding.phone}</span>
            </span>
            {branding.emergencyPhone && (
              <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                <span>Emergency 24x7: {branding.emergencyPhone}</span>
              </span>
            )}
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>
                Hours: {settings.workingHours.open} - {settings.workingHours.close} (Mon-Sat)
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <select
                aria-label="Select Language"
                className="bg-transparent border-0 text-slate-200 text-xs focus:outline-none cursor-pointer"
                defaultValue={branding.languages[0]}
              >
                {branding.languages.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900 text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {activeUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-700">
                <span className="text-slate-300">
                  Hi, <strong className="text-white">{activeUser.name}</strong> ({activeRole})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              {branding.clinicName.charAt(0)}
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 block leading-tight">
                {branding.clinicName}
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                {branding.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${isActive
                    ? 'text-sky-600 font-semibold'
                    : 'text-slate-600 hover:text-sky-600'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {activeUser ? (
              <>
                <Link to={getPortalPath()}>
                  <Button variant="outline" size="md" className="border-sky-300 text-sky-700 hover:bg-sky-50">
                    Open {activeRole === 'PATIENT' ? 'Patient Portal' : 'Workspace'}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="md">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Book Appointment
                </Button>
              </Link>
              {activeUser ? (
                <>
                  <Link to={getPortalPath()} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Open {activeRole === 'PATIENT' ? 'Patient Portal' : 'Workspace'}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-rose-600"
                  >
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 right-4 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
      >
        <MessageCircle className="h-6 w-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
          Chat with Clinic
        </span>
      </a>

      {/* Public Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: About Clinic */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                  {branding.clinicName.charAt(0)}
                </div>
                <span>{branding.clinicName}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {branding.tagline}. High-quality healthcare, modern diagnostics, and experienced specialists.
              </p>
              <p className="text-slate-500 text-xs">
                Registration No: <span className="text-slate-300 font-mono">{clinic.registrationNo}</span>
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Explore Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {clinic.departments.map((dept) => (
                  <li key={dept.id}>
                    <Link to="/services" className="hover:text-white flex items-center gap-1">
                      <ChevronRight className="h-3 w-3 text-sky-400" />
                      {dept.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Branches */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Hospital Locations
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                {clinic.branches.map((b) => (
                  <li key={b.id} className="space-y-0.5">
                    <p className="text-white font-medium flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      {b.name}
                    </p>
                    <p className="pl-4 text-slate-400">{b.address}</p>
                    <p className="pl-4 text-slate-500 text-[11px]">{b.hours}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact & Appointments */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Book Consultation
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Call front-desk directly or book online with instant token generation.
              </p>
              <p className="text-white font-bold text-base mb-1">{branding.phone}</p>
              <p className="text-sky-400 text-xs mb-4">{branding.email}</p>
              <Link to="/book">
                <Button size="sm" className="w-full">
                  Book Slot Online
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} {branding.clinicName}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/about" className="hover:text-slate-300">Privacy & Consent</Link>
              <Link to="/about" className="hover:text-slate-300">Terms of Care</Link>
              <Link to="/about" className="hover:text-slate-300">DPDP Compliance</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
