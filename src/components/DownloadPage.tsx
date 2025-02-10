import React, { useEffect, useState } from 'react';
import { Download, AppWindow as Windows, HardDrive, Cpu, MemoryStick as Memory, Wifi, Shield, Globe, Loader2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'react-hot-toast';

interface DownloadFile {
  id: string;
  platform: string;
  version: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  is_active: boolean;
  download_url: string;
}

export function DownloadPage() {
  const { t } = useTranslation('en');
  const [files, setFiles] = useState<Record<string, DownloadFile>>({});
  const [loading, setLoading] = useState(true);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();
      const response = await fetch(`/downloads/metadata.json?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch metadata');
      
      const metadata = await response.json();
      const latestFiles: Record<string, DownloadFile> = {};
      
      // Group files by platform and get the latest version
      metadata.forEach((file: DownloadFile) => {
        // Skip inactive files
        if (!file.is_active) return;
        
        if (!latestFiles[file.platform] || 
            new Date(file.uploaded_at) > new Date(latestFiles[file.platform].uploaded_at)) {
          latestFiles[file.platform] = file;
        }
      });

      setFiles(latestFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles({}); // Clear files on error
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: DownloadFile) => {
    if (downloadingFiles.has(file.id)) return;

    try {
      setDownloadingFiles(prev => new Set(prev).add(file.id));
      
      // Open download URL in new tab
      window.open(file.download_url, '_blank');
      toast.success('Download started');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start download';
      console.error('Download error:', message);
      toast.error(message);
    } finally {
      setTimeout(() => {
        setDownloadingFiles(prev => {
          const next = new Set(prev);
          next.delete(file.id);
          return next;
        });
      }, 1000);
    }
  };

  const getPlatformDisplayName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'client':
        return t('gameClient');
      case 'launcher':
        return t('gameLauncher');
      case 'luminacore':
        return t('luminaCore');
      default:
        return platform;
    }
  };

  const fileEntries = Object.entries(files);
  const hasDownloads = fileEntries.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4">{t('downloadTitle')}</h1>
          <p className="text-xl text-gray-300">{t('downloadDescription')}</p>
        </div>

        {/* Download Options */}
        {loading ? (
          <div className="flex justify-center mb-16">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : hasDownloads ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {fileEntries.map(([platform, file]) => (
              <DownloadCard
                key={platform}
                icon={<Windows className="w-8 h-8" />}
                title={getPlatformDisplayName(platform)}
                size={`${(file.file_size / (1024 * 1024)).toFixed(1)} MB`}
                version={file.version}
                isDownloading={downloadingFiles.has(file.id)}
                onDownload={() => handleDownload(file)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mb-16 p-8 bg-black/30 rounded-lg border border-yellow-500/10">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">{t('noDownloadsAvailable')}</h2>
            <p className="text-gray-400">
              {t('checkBackLater')}
            </p>
          </div>
        )}

        {/* System Requirements */}
        <div className="bg-black/50 rounded-2xl p-8 backdrop-blur-sm border border-yellow-500/10 mb-16">
          <h2 className="text-2xl font-bold mb-8">{t('systemRequirements')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-4">{t('minimumRequirements')}</h3>
              <Requirements
                cpu={t('minCpu')}
                ram={t('minRam')}
                gpu={t('minGpu')}
                storage={t('minStorage')}
                network={t('minNetwork')}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-500 mb-4">{t('recommendedRequirements')}</h3>
              <Requirements
                cpu={t('recCpu')}
                ram={t('recRam')}
                gpu={t('recGpu')}
                storage={t('recStorage')}
                network={t('recNetwork')}
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-3 gap-8">
          <InfoCard
            icon={<Shield />}
            title={t('secureDownload')}
            description={t('secureDownloadDesc')}
          />
          <InfoCard
            icon={<Globe />}
            title={t('globalServers')}
            description={t('globalServersDesc')}
          />
          <InfoCard
            icon={<HardDrive />}
            title={t('autoUpdates')}
            description={t('autoUpdatesDesc')}
          />
        </div>
      </div>
    </div>
  );
}

function DownloadCard({ icon, title, size, version, isDownloading, onDownload }: {
  icon: React.ReactNode;
  title: string;
  size: string;
  version: string;
  isDownloading: boolean;
  onDownload: () => void;
}) {
  return (
    <div className="bg-black/50 rounded-xl p-6 border border-yellow-500/10 hover:border-yellow-500/30 transition-all">
      <div className="text-yellow-500 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-gray-400 mb-4">
        <p>Version {version}</p>
        <p>Size: {size}</p>
      </div>
      <button
        onClick={onDownload}
        disabled={isDownloading}
        className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors w-full justify-center disabled:opacity-50"
      >
        {isDownloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        Download
      </button>
    </div>
  );
}

function Requirements({ cpu, ram, gpu, storage, network }: {
  cpu: string;
  ram: string;
  gpu: string;
  storage: string;
  network: string;
}) {
  const { t } = useTranslation('en');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Cpu className="w-5 h-5 text-yellow-500" />
        <div>
          <span className="text-sm text-gray-400">{t('cpu')}</span>
          <p className="text-gray-300">{cpu}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Memory className="w-5 h-5 text-yellow-500" />
        <div>
          <span className="text-sm text-gray-400">{t('ram')}</span>
          <p className="text-gray-300">{ram}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <HardDrive className="w-5 h-5 text-yellow-500" />
        <div>
          <span className="text-sm text-gray-400">{t('gpu')}</span>
          <p className="text-gray-300">{gpu}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <HardDrive className="w-5 h-5 text-yellow-500" />
        <div>
          <span className="text-sm text-gray-400">{t('storage')}</span>
          <p className="text-gray-300">{storage}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Wifi className="w-5 h-5 text-yellow-500" />
        <div>
          <span className="text-sm text-gray-400">{t('network')}</span>
          <p className="text-gray-300">{network}</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-black/30 rounded-xl p-6 border border-yellow-500/10">
      <div className="text-yellow-500 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}