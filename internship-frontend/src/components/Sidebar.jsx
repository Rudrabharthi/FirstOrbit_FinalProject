import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = () => {
  const { isAuthenticated, isAdmin, isCompany, isStudent } = useAuth();
  const { isDark } = useTheme();
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobileMenu } = useSidebar();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
    ${isActive(path) 
      ? 'bg-indigo-600 text-white shadow-md' 
      : isDark 
        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}
    ${isCollapsed ? 'justify-center' : ''}
  `;

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/internships', label: 'Internships', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/admin/companies', label: 'Companies', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { path: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  const companyLinks = [
    { path: '/company', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/company/internships', label: 'My Internships', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { path: '/company/internships/new', label: 'Post New', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  ];

  const studentLinks = [
    { path: '/student', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/internships', label: 'Browse Jobs', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { path: '/student/applications', label: 'Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  const links = isAdmin ? adminLinks : isCompany ? companyLinks : studentLinks;
  const roleLabel = isAdmin ? 'Admin' : isCompany ? 'Company' : 'Student';
  const roleColor = isAdmin ? 'bg-red-100 text-red-600' : isCompany ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => useSidebar().toggleMobileMenu?.() || closeMobileMenu()}
        className={`fixed bottom-4 left-4 z-50 lg:hidden p-3 rounded-full shadow-lg transition-colors ${
          isDark ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        style={{ display: isMobileOpen ? 'none' : 'block' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 transition-all duration-300
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r shadow-lg
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between h-16 px-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {!isCollapsed && (
            <Link to="/" className={`text-xl font-bold ${isDark ? 'text-white' : 'text-indigo-600'}`}>
              IMS
            </Link>
          )}
          <button
            onClick={toggleCollapse}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <svg className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Role Badge */}
        <div className={`mx-4 mt-4 mb-2 ${isCollapsed ? 'text-center' : ''}`}>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColor}`}>
            {isCollapsed ? roleLabel.charAt(0) : roleLabel}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMobileMenu}
              className={linkClasses(link.path)}
              title={isCollapsed ? link.label : ''}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
              </svg>
              {!isCollapsed && <span className="font-medium">{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-2 transition-colors ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-indigo-600'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {!isCollapsed && <span className="text-sm">Home</span>}
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
