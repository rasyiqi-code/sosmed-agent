'use client';

import { useState, useEffect } from 'react';
import { Twitter, Linkedin, Instagram, Plus, X, Check, Loader2, Link2, Unlink } from 'lucide-react';
import { getSocialAccounts, connectMockAccount, disconnectAccount, toggleAccountStatus, saveThreadsConfig, connectThreadsAccount, getThreadsAuthUrlAction } from '../actions/social';
import { useTranslation } from 'react-i18next';

export default function Connections() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setIsLoading(true);
    const data = await getSocialAccounts();
    setAccounts(data);
    setIsLoading(false);
  }

  const platforms = [
    { name: 'Threads', icon: Plus, color: '#000000' }, // Threads uses Plus icon as placeholder
    { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
    { name: 'Instagram', icon: Instagram, color: '#E4405F' },
  ];

  const handleConnect = async (platform: string) => {
    if (platform === 'Threads') {
      try {
        const url = await getThreadsAuthUrlAction();
        window.location.href = url;
      } catch (err: any) {
        console.error(err);
        alert(`Failed to start Threads OAuth: ${err.message}`);
      }
      return;
    }

    setIsConnecting(platform);
    // Simulate OAuth Delay for others
    setTimeout(async () => {
      const handle = `@rasyiqi_${platform.toLowerCase()}`;
      await connectMockAccount(platform, handle);
      await loadAccounts();
      setIsConnecting(null);
    }, 1500);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('conn.confirm_disconnect'))) {
      await disconnectAccount(id);
      await loadAccounts();
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    await toggleAccountStatus(id, !current);
    await loadAccounts();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{t('conn.subtitle')}</p>
        <h1 className="display-md">{t('conn.title')}</h1>
        <p className="body-md" style={{ opacity: 0.6, marginTop: '0.5rem' }}>{t('conn.description')}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {platforms.map(p => {
          const connected = accounts.find(a => a.platform === p.name);
          return (
            <div key={p.name} className="card-lowest" style={{ 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column',
              gap: '1rem',
              opacity: isConnecting && isConnecting !== p.name ? 0.5 : 1,
              transition: 'opacity 0.3s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: `${p.color}15`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: p.color
                }}>
                  <p.icon size={20} />
                </div>
                {connected ? (
                  <div className="badge badge-active" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={10} /> {t('conn.connected')}
                  </div>
                ) : (
                  <div className="badge" style={{ background: '#F1F5F9', color: '#64748B' }}>{t('conn.disconnected')}</div>
                )}
              </div>

              <div>
                <h3 className="title-sm">{p.name}</h3>
                <p className="body-md" style={{ opacity: 0.4 }}>{connected ? connected.handle : t('conn.connect_account')}</p>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                {connected ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleToggle(connected.id, connected.isActive)}
                      className="body-md ghost-border" 
                      style={{ 
                        flex: 1, padding: '0.5rem', borderRadius: '6px', cursor: 'pointer',
                        background: connected.isActive ? 'white' : 'var(--surface-container-highest)',
                        color: connected.isActive ? 'var(--on-surface)' : 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                      }}
                    >
                      {connected.isActive ? t('conn.active') : t('conn.paused')}
                    </button>
                    <button 
                      onClick={() => handleDelete(connected.id)}
                      className="body-md" 
                      style={{ 
                        padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', background: '#FEE2E2', color: '#B91C1C', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Unlink size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleConnect(p.name)}
                    disabled={!!isConnecting}
                    className="btn-primary" 
                    style={{ 
                      width: '100%', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}
                  >
                    {isConnecting === p.name ? <><Loader2 size={16} className="animate-spin" /> {t('conn.authorizing')}</> : <><Link2 size={16} /> {t('conn.connect_account_button')}</>}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-lowest" style={{ marginTop: '3rem', padding: '2rem', background: 'var(--primary)', color: 'white' }}>
        <h3 className="title-sm" style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>{t('conn.engine_title')}</h3>
        <p className="body-md" style={{ opacity: 0.8, lineHeight: 1.5 }}>
          {t('conn.engine_description')}
        </p>
      </div>
    </div>
  );
}
