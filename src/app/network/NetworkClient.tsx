'use client';

import { Radar, ArrowUpRight, CheckCircle2, Bot, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { generateNurtureReply } from '../actions/nurture';
import { updateLeadStatus } from '../actions/network';

export default function NetworkClient({ initialIntel }: { initialIntel: any[] }) {
  const { t } = useTranslation();
  const [intel, setIntel] = useState<any[]>(initialIntel || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeReply, setActiveReply] = useState<{ name: string, reply: string } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nurturing': return { color: '#10B981', bg: '#ECFDF5' };
      case 'High Value': return { color: '#4F46E5', bg: '#EEF2FF' };
      default: return { color: 'rgba(0,0,0,0.6)', bg: 'var(--surface-container-low)' };
    }
  };

  const handleNurture = async (userId: string, userName: string) => {
    setLoadingId(userId);
    const res = await generateNurtureReply(userId);
    setLoadingId(null);
    if (res.success && res.reply) {
      setActiveReply({ name: userName, reply: res.reply });
      // Update local state to reflect nurture action
      setIntel(intel.map(u => u.id === userId ? { ...u, status: 'Nurturing', lastAction: 'AI Generated Reply', lastActionAt: new Date() } : u));
      await updateLeadStatus(userId, 'Nurturing');
    } else {
      alert(res.error || "Failed to generate nurture reply");
    }
  };

  return (
    <div style={{ padding: '3rem 2.5rem', height: '100%', overflowY: 'auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{t('network.audience_intel')}</p>
          <h1 className="display-md">{t('network.title')}</h1>
        </div>
        <button className="body-md ghost-border" style={{ 
            height: '36px',
            padding: '0 1rem', 
            borderRadius: '8px', 
            background: 'white', 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Radar size={16} /> {t('network.scan_network')}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Intro */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', background: 'var(--surface-container-low)', borderRadius: '12px' }}>
          <div>
            <h3 className="title-sm" style={{ marginBottom: '0.25rem' }}>{t('network.ai_social_networking')}</h3>
            <p className="body-md" style={{ opacity: 0.6 }}>{t('network.ai_social_networking_description')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p className="display-md" style={{ fontSize: '1.5rem', color: '#10B981' }}>{intel.length}</p>
              <p className="label-sm" style={{ opacity: 0.4 }}>{t('network.new_connections')}</p>
            </div>
          </div>
        </div>

        {activeReply && (
          <div className="card-lowest" style={{ padding: '2rem', border: '1px solid var(--primary-container)', background: '#F0F7FF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="title-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={18} color="var(--primary)" /> {t('network.nurture_strategy_for', { name: activeReply.name })}
              </h3>
              <button 
                onClick={() => setActiveReply(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}
              >
                ✕
              </button>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}>
              <p className="body-md" style={{ fontStyle: 'italic', color: 'var(--on-surface)' }}>"{activeReply.reply}"</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className="body-md" style={{ background: 'var(--primary)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                {t('network.send_reply')}
              </button>
              <button 
                onClick={() => setActiveReply(null)}
                className="body-md" style={{ background: 'transparent', color: 'var(--primary)', padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                {t('network.refine')}
              </button>
            </div>
          </div>
        )}

        {/* CRM List */}
        <div className="card-lowest" style={{ padding: '0' }}>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="label-sm" style={{ paddingLeft: '2rem' }}>{t('network.profile')}</th>
                <th className="label-sm">{t('network.relationship_score')}</th>
                <th className="label-sm">{t('network.autopilot_action')}</th>
                <th className="label-sm" style={{ paddingRight: '2rem', textAlign: 'right' }}>{t('network.status')}</th>
              </tr>
            </thead>
            <tbody>
              {intel.map((user) => {
                const statusMeta = getStatusColor(user.status);
                const isNurturing = loadingId === user.id;
                return (
                <tr key={user.id}>
                  <td style={{ paddingLeft: '2rem', padding: '1.5rem 2rem 1.5rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          backgroundImage: `url(${user.avatarUrl || 'https://i.pravatar.cc/150?u=' + user.id})`, 
                          backgroundSize: 'cover' 
                      }}></div>
                      <div>
                        <p className="body-md" style={{ fontWeight: 600 }}>{user.name}</p>
                        <p className="label-sm" style={{ opacity: 0.4, marginTop: '2px' }}>{user.title}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '150px' }}>
                      <span className="body-md" style={{ fontWeight: 600 }}>{user.relationshipScore}</span>
                      <div className="progress-container">
                        <div className="progress-fill" style={{ width: `${user.relationshipScore}%`, background: user.relationshipScore > 90 ? '#10B981' : 'var(--primary)' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F6F9FF', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        <Bot size={14} color="var(--primary)" />
                        <span className="body-md" style={{ fontSize: '0.75rem', opacity: 0.8 }}>{user.lastAction || t('network.watching')} <span style={{ opacity: 0.5, marginLeft: '0.5rem' }}>{user.lastActionAt ? new Date(user.lastActionAt).toLocaleDateString() : ''}</span></span>
                      </div>
                      <button 
                        onClick={() => handleNurture(user.id, user.name)}
                        disabled={!!loadingId}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', padding: 0 }}
                      >
                        {isNurturing ? <Loader2 size={16} className="spin" /> : <MessageSquare size={16} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ paddingRight: '2rem', textAlign: 'right' }}>
                    <span className="label-sm" style={{ 
                      opacity: 0.8, 
                      color: statusMeta.color,
                      background: statusMeta.bg,
                      padding: '4px 10px',
                      borderRadius: '4px'
                    }}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
