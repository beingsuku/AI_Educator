import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardPage } from './components/DashboardPage';
import { LearnPage } from './components/LearnPage';
import { LessonPlannerPage } from './components/LessonPlannerPage';
import { AITeacherPage } from './components/AITeacherPage';
import { AssessmentPage } from './components/AssessmentPage';
import { ProgressPage } from './components/ProgressPage';

const PageRenderer: React.FC = () => {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'learn':
      return <LearnPage />;
    case 'planner':
      return <LessonPlannerPage />;
    case 'teacher':
      return <AITeacherPage />;
    case 'assessment':
      return <AssessmentPage />;
    case 'progress':
      return <ProgressPage />;
    default:
      return <LandingPage />;
  }
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-[#0B0F19] text-slate-100 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <PageRenderer />
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
