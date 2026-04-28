'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Diamond, 
  LayoutGrid, 
  MousePointer2, 
  Calendar, 
  Settings, 
  Plus, 
  HelpCircle,
  Bell,
  BrainCircuit,
  Users,
  Radio,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function Sidebar({ isAutopilotActive = false }: { isAutopilotActive?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = mounted ? i18n.language : 'en';
  
  const mainNav = [
    { name: t('nav.dashboard'), icon: LayoutGrid, href: '/' },
    { name: t('nav.autopilot'), icon: Zap, href: '/autopilot' },
    { name: t('nav.campaigns'), icon: Radio, href: '/campaigns' },
    { name: t('nav.connections'), icon: Users, href: '/connections' },
    { name: t('nav.creative'), icon: MousePointer2, href: '/studio' },

    { name: t('nav.timeline'), icon: Calendar, href: '/chronology' },
    { name: t('nav.network'), icon: Users, href: '/network' },
    { name: t('nav.cortex'), icon: BrainCircuit, href: '/cortex' },
    { name: t('nav.persona'), icon: Settings, href: '/persona' },
  ];

  return (
    <aside style={{ 
      width: '240px', 
      height: '100vh', 
      background: 'transparent',
      display: 'flex', 
      flexDirection: 'column', 
      padding: '1.5rem',
      flexShrink: 0
    }}>
      {/* Brand & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingLeft: '0.5rem' }}>
        <Diamond size={24} color="var(--primary)" />
        <div>
          <h2 className="title-sm" style={{ letterSpacing: '0.02em' }}>socmed-agent</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isAutopilotActive ? '#10B981' : '#94A3B8' }}></div>
            <p className="label-sm" style={{ opacity: 0.6, letterSpacing: 0 }}>
              {isAutopilotActive ? 'AUTOPILOT ACTIVE' : 'AUTOPILOT PAUSED'}
            </p>
          </div>
        </div>
      </div>


      {/* Main Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }} className="no-scrollbar">
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p className="label-sm" style={{ padding: '0 0.75rem', opacity: 0.4, letterSpacing: '0.05em' }}>{t('nav.core_modules')}</p>
        
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                background: isActive ? 'white' : 'transparent',
                color: isActive ? 'var(--primary)' : 'rgba(0,0,0,0.6)',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <item.icon size={18} />
              <span className="body-md" style={{ fontWeight: 'inherit' }}>{item.name}</span>
            </Link>
          );
        })}
        </div>
      </nav>

      {/* User Area */}
      <div style={{ 
        borderTop: '1px solid var(--outline-variant)', 
        paddingTop: '0.75rem', 
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '8px',
          background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', cursor: 'pointer', textAlign: 'left'
        }} className="body-md">
          <HelpCircle size={18} /> {t('nav.support')}
        </button>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '8px',
          background: 'none', border: 'none', color: 'rgba(0,0,0,0.6)', cursor: 'pointer', textAlign: 'left'
        }} className="body-md">
          <Bell size={18} /> {t('nav.notifications')}
        </button>
        

        <div style={{ display: 'flex', padding: '0.25rem', background: 'var(--surface-container-low)', borderRadius: '8px', margin: '0.25rem 0' }}>
          <button 
            onClick={() => i18n.changeLanguage('en')}
            style={{ 
              flex: 1, padding: '4px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700,
              background: currentLang === 'en' ? 'white' : 'transparent',
              boxShadow: currentLang === 'en' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              color: currentLang === 'en' ? 'var(--primary)' : 'rgba(0,0,0,0.4)',
              border: 'none', cursor: 'pointer'
            }}
          >
            EN
          </button>
          <button 
            onClick={() => i18n.changeLanguage('id')}
            style={{ 
              flex: 1, padding: '4px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700,
              background: currentLang === 'id' ? 'white' : 'transparent',
              boxShadow: currentLang === 'id' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              color: currentLang === 'id' ? 'var(--primary)' : 'rgba(0,0,0,0.4)',
              border: 'none', cursor: 'pointer'
            }}
          >
            ID
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', marginTop: '0.25rem' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '8px', 
            backgroundImage: 'url(https://i.pravatar.cc/150?u=rasyiqi)', backgroundSize: 'cover' 
          }}></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="body-md" style={{ fontWeight: 600, fontSize: '0.75rem' }}>Rasyiqi</span>
            <span className="label-sm" style={{ opacity: 0.4 }}>Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
