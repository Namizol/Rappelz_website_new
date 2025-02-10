import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { AdminNews } from './AdminNews';
import { AdminTickets } from './AdminTickets';
import { AdminDownloads } from './AdminDownloads';
import { NewspaperIcon, TicketIcon, Download, Lock } from 'lucide-react';

interface AdminTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function AdminTab({ active, onClick, icon, label, count }: AdminTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        active 
          ? 'bg-yellow-500 text-black' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-black/20' : 'bg-yellow-500/20 text-yellow-500'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

type AdminTab = 'news' | 'tickets' | 'downloads';

export function AdminPanel({ language }: { language: string }) {
  const { t } = useTranslation(language);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('news');

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400">
            You don't have permission to access the admin panel. Please contact an administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="bg-black/50 rounded-2xl p-8 backdrop-blur-sm border border-yellow-500/10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">{user.email}</span>
              <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-500">
                Admin
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            <AdminTab
              active={activeTab === 'news'}
              onClick={() => setActiveTab('news')}
              icon={<NewspaperIcon className="w-5 h-5" />}
              label="News"
            />
            <AdminTab
              active={activeTab === 'tickets'}
              onClick={() => setActiveTab('tickets')}
              icon={<TicketIcon className="w-5 h-5" />}
              label="Support Tickets"
            />
            <AdminTab
              active={activeTab === 'downloads'}
              onClick={() => setActiveTab('downloads')}
              icon={<Download className="w-5 h-5" />}
              label="Downloads"
            />
          </div>

          {/* Content Area */}
          <div className="bg-black/30 rounded-xl border border-yellow-500/10 p-6">
            {activeTab === 'news' && <AdminNews language={language} />}
            {activeTab === 'tickets' && <AdminTickets language={language} />}
            {activeTab === 'downloads' && <AdminDownloads language={language} />}
          </div>
        </div>
      </div>
    </div>
  );
}