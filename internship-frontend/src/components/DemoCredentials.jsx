import React from 'react';

const DemoCredentials = () => {
  const credentials = [
    { role: 'Admin', email: 'qq@gmail.com', password: 'Q111111', color: 'bg-red-100 text-red-800' },
    { role: 'Company', email: 'ww@gmail.com', password: 'W111111', color: 'bg-green-100 text-green-800' },
    { role: 'Student', email: 'ee@gmail.com', password: 'E111111', color: 'bg-blue-100 text-blue-800' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Demo Accounts
      </h3>
      <div className="space-y-2">
        {credentials.map((cred) => (
          <div key={cred.role} className="flex items-center justify-between text-xs">
            <span className={`px-2 py-1 rounded-full font-medium ${cred.color}`}>
              {cred.role}
            </span>
            <div className="flex gap-4 text-gray-600 dark:text-gray-400">
              <span className="font-mono">{cred.email}</span>
              <span className="text-gray-400 dark:text-gray-500">/</span>
              <span className="font-mono">{cred.password}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoCredentials;
