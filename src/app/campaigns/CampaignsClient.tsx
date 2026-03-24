'use client';

import { useState } from 'react';

import { Radio, Play, Pause, MoreHorizontal, Activity, Target, Zap, Plus, ArrowRight, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { toggleCampaignStatus } from '../actions/campaigns';

export default function CampaignsClient({ initialCampaigns }: { initialCampaigns: any[] }) {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<any[]>(initialCampaigns);

  const handleToggle = async (id: string, currentStatus: string) => {
    const res = await toggleCampaignStatus(id, currentStatus);
    if (res.success) {
      setCampaigns((prev) => prev.map((c: any) => 
        c.id === id ? { ...c, status: currentStatus === 'Running' ? 'Paused' : 'Running' } : c
      ));
    }
  };

  const getCampaignColor = (status: string) => {
    return status === 'Running' ? '#4F46E5' : '#94A3B8';
  };

  return (
    <div style={{ padding: '3rem 2.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 className="display-md" style={{ letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{t('camp.title')}</h1>
          <p className="body-md" style={{ color: 'rgba(0,0,0,0.5)', maxWidth: '500px' }}>
            {t('camp.subtitle')}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <Link href="/campaigns/new" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          background: 'var(--on-surface)', color: 'var(--surface)',
          padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 500
        }} className="body-md">
          <PlusCircle size={18} /> {t('camp.new_campaign')}
        </Link>
      </div>

      {/* Campaign List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {campaigns.map((camp: any) => (
          <div key={camp.id} className="card-lowest" style={{ 
            padding: '1.5rem 2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderLeft: `4px solid ${camp.status === 'Running' ? getCampaignColor(camp.status) : 'var(--surface-container-highest)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
              {/* Play/Pause Toggle */}
              <button 
                onClick={() => handleToggle(camp.id, camp.status)}
                style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                border: 'none', 
                background: camp.status === 'Running' ? 'rgba(79, 70, 229, 0.1)' : 'var(--surface-container-high)',
                color: camp.status === 'Running' ? '#4F46E5' : 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                {camp.status === 'Running' ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>

              {/* Identity */}
              <div style={{ width: '250px' }}>
                <h3 className="body-md" style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{camp.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="badge" style={{ 
                    background: camp.status === 'Running' ? '#EFF6FF' : '#F1F5F9',
                    color: camp.status === 'Running' ? '#3B82F6' : '#64748B'
                  }}>
                    {camp.status === 'Running' ? t('dash.running') : t('dash.paused')}
                  </span>
                </div>
                
                <div style={{ marginTop: '0.5rem', opacity: 0.7 }} className="body-md">
                  {t('camp.objective')} <span style={{ fontWeight: 600 }}>{camp.objective}</span> • {camp.frequency}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="label-sm" style={{ opacity: 0.4 }}>{t('camp.progress')}</span>
                  <span className="label-sm">{camp.progress}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: `${camp.progress}%`, background: camp.status === 'Running' ? getCampaignColor(camp.status) : 'var(--surface-container-highest)' }}></div>
                </div>
              </div>

              <div style={{ minWidth: '100px', textAlign: 'right' }}>
                <span className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.25rem' }}>{t('camp.reach')}</span>
                <span className="title-sm">{camp.reach > 0 ? camp.reach.toLocaleString() : '-'}</span>
              </div>

              {/* Actions */}
              <button style={{ background: 'none', border: 'none', opacity: 0.3, cursor: 'pointer' }}>
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
