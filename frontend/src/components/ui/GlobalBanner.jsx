import React, { useEffect, useState } from 'react';
import { settingApi } from '../../api/settingApi';
import { Info, AlertTriangle, AlertCircle, CheckCircle2, Megaphone } from 'lucide-react';

export default function GlobalBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingApi.getSettings();
        if (data && data.bannerEnabled) {
          setBanner(data);
        }
      } catch (error) {
        console.error("Failed to load global banner");
      }
    };
    fetchSettings();
  }, []);

  if (!banner) return null;

  const colorConfig = {
    blue: {
      bg: 'bg-blue-600',
      text: 'text-blue-50',
      icon: <Info className="w-5 h-5 shrink-0" />
    },
    red: {
      bg: 'bg-rose-600',
      text: 'text-rose-50',
      icon: <AlertCircle className="w-5 h-5 shrink-0" />
    },
    yellow: {
      bg: 'bg-amber-500',
      text: 'text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />
    },
    emerald: {
      bg: 'bg-emerald-600',
      text: 'text-emerald-50',
      icon: <CheckCircle2 className="w-5 h-5 shrink-0" />
    },
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-50',
      icon: <Megaphone className="w-5 h-5 shrink-0" />
    }
  };

  const theme = colorConfig[banner.bannerColor] || colorConfig.blue;

  const content = (
    <div className={`${theme.bg} ${theme.text} px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium w-full`}>
      {theme.icon}
      <span>{banner.bannerMessage}</span>
    </div>
  );

  if (banner.bannerLink) {
    return (
      <a href={banner.bannerLink} target="_blank" rel="noreferrer" className="block w-full hover:opacity-90 transition-opacity">
        {content}
      </a>
    );
  }

  return <div className="w-full">{content}</div>;
}
