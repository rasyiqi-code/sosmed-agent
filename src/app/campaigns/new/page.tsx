'use client';

import { ArrowLeft, Brain, Target, CalendarDays, Activity, Globe, Send, Paperclip, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createCampaign } from '../../actions/campaigns';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function NewCampaign() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('Brand Awareness');
  const [frequency, setFrequency] = useState('2 / DAY');

  const handleSubmit = async () => {
    if (!name || !objective) {
      alert(t('camp_new.validation_error'));
      return;
    }
    
    setIsSubmitting(true);
    const res = await createCampaign({
      name,
      objective,
      frequency
    });
    
    if (res.success) {
      router.push('/campaigns');
    } else {
      setIsSubmitting(false);
      alert(res.error || t('camp_new.deploy_error'));
    }
  };
  return (
    <div style={{ padding: '3rem 2.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/campaigns" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }} className="body-md">
          <ArrowLeft size={16} /> {t('camp_new.back_to_engine')}
        </Link>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{t('camp_new.subtitle')}</p>
          <h1 className="display-md">{t('camp_new.title')}</h1>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem' }}>
        {/* Left Column: Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card-lowest" style={{ padding: '2rem' }}>
            <h2 className="title-sm" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--primary)" /> {t('camp_new.campaign_manifest')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{t('camp_new.name_label')}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('camp_new.name_placeholder')}
                  className="body-md ghost-border" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none' }} 
                />
              </div>
              <div>
                <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{t('camp_new.objective_label')}</label>
                <textarea 
                  placeholder={t('camp_new.objective_placeholder')}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="body-md ghost-border" 
                  style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none', resize: 'none' }} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {['Brand Awareness', 'Lead Generation', 'Direct Sales'].map((obj) => (
                  <button 
                    key={obj} 
                    onClick={() => setObjective(obj)}
                    style={{ padding: '0.75rem', borderRadius: '8px', background: objective === obj ? 'var(--primary)' : 'var(--surface-container-low)', color: objective === obj ? 'white' : 'var(--on-surface)', border: 'none', cursor: 'pointer', fontWeight: 600 }} 
                    className="body-md"
                  >
                    {t(`camp_new.objective_options.${obj.toLowerCase().replace(/\s/g, '_')}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card-lowest" style={{ padding: '2rem' }}>
            <h2 className="title-sm" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={18} color="#10B981" /> {t('camp_new.context_injection')}
            </h2>
            <p className="body-md" style={{ opacity: 0.6, marginBottom: '1.5rem' }}>{t('camp_new.context_injection_desc')}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="body-md ghost-border" style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Paperclip size={16} /> {t('camp_new.attach_source')}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#ECFDF5', color: '#10B981', borderRadius: '8px' }}>
                <Target size={14} /> <span className="body-md" style={{ fontWeight: 600 }}>Arch_Design_System.pdf</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Flight Rules & Launch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card-lowest" style={{ padding: '2rem' }}>
            <h2 className="title-sm" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} color="var(--primary)" /> {t('camp_new.flight_rules')}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{t('camp_new.platforms_label')}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['Twitter', 'LinkedIn', 'Instagram'].map(platform => (
                    <button key={platform} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'var(--surface-container-low)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 600 }} className="body-md">
                      {t(`camp_new.platform_options.${platform.toLowerCase()}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{t('camp_new.frequency_label')}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  defaultValue="2" 
                  onChange={(e) => setFrequency(`${e.target.value} / DAY`)}
                  style={{ width: '100%', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span className="label-sm" style={{ opacity: 0.4 }}>{t('camp_new.frequency_relaxed')}</span>
                  <span className="label-sm" style={{ color: 'var(--primary)' }}>{frequency}</span>
                  <span className="label-sm" style={{ opacity: 0.4 }}>{t('camp_new.frequency_aggressive')}</span>
                </div>
              </div>

              <div>
                <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{t('camp_new.duration_label')}</label>
                <button className="body-md ghost-border" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ opacity: 0.8 }}>{t('camp_new.duration_value')}</span>
                  <CalendarDays size={16} style={{ opacity: 0.5 }} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', 
            padding: '2rem', 
            borderRadius: '16px', 
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div>
              <h3 className="title-sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>{t('camp_new.system_ready')}</h3>
              <p className="body-md" style={{ opacity: 0.9, lineHeight: 1.5 }}>
                {t('camp_new.system_desc')}
              </p>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !name || !objective}
              className="body-md" 
              style={{ 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '8px', 
                background: 'white', 
                color: 'var(--primary)', 
                border: 'none', 
                fontWeight: 700,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                cursor: (isSubmitting || !name || !objective) ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.39)',
                opacity: (isSubmitting || !name || !objective) ? 0.7 : 1
              }}
            >
              {isSubmitting ? t('auto.saving') : <><Send size={18} /> {t('camp_new.initiate')}</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
