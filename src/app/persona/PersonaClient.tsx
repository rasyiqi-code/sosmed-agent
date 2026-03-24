'use client';

import { useState } from 'react';
import { Volume2, Sparkles, User, Heart, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { updatePersona } from '../actions/persona';
import { seedDatabase } from '../actions/seed';
import { useTranslation } from 'react-i18next';

export default function PersonaClient({ initialData }: { initialData: any }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    whoAmI: initialData.whoAmI || '',
    businessProject: initialData.businessProject || '',
    socialMediaGoal: initialData.socialMediaGoal || '',
    coreValues: initialData.coreValues || '',
  });

  const [voiceSettings, setVoiceSettings] = useState({
    professionalism: initialData.professionalism || 80,
    creativity: initialData.creativity || 65,
    enthusiasm: initialData.enthusiasm || 40,
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    
    const payload = { ...formData, ...voiceSettings };
    const res = await updatePersona(initialData.id, payload);
    
    setIsSyncing(false);
    
    if (res.success) {
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    } else {
      alert("Failed to sync to database");
    }
  };

  return (
    <div style={{ padding: '3rem 2.5rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="display-md" style={{ letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{t('persona.title')}</h1>
        <p className="body-md" style={{ color: 'rgba(0,0,0,0.5)', maxWidth: '500px' }}>
          {t('persona.subtitle')}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        {/* Left Column: Identity Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card-lowest" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <User size={20} color="var(--primary)" />
              <h2 className="title-sm">{t('persona.business_project')}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{t('persona.business_project')}</label>
                <input 
                  type="text" 
                  value={formData.businessProject}
                  onChange={(e) => setFormData({ ...formData, businessProject: e.target.value })}
                  className="body-md ghost-border" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none' }}
                  placeholder="Antigravity Studio"
                />
              </div>
              <div>
                <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{t('persona.social_goal')}</label>
                <input 
                  type="text" 
                  value={formData.socialMediaGoal}
                  onChange={(e) => setFormData({ ...formData, socialMediaGoal: e.target.value })}
                  className="body-md ghost-border" 
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none' }}
                  placeholder="Authority Building & Leads"
                />
              </div>
            </div>
          </div>

          <div className="card-lowest" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Heart size={20} color="#E11D48" />
              <h2 className="title-sm">Life Story & Context</h2>
            </div>
            <div>
              <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>CORE VALUES & INTERESTS</label>
              <textarea 
                className="body-md ghost-border" 
                value={formData.coreValues}
                onChange={(e) => setFormData({ ...formData, coreValues: e.target.value })}
                style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none', resize: 'none' }}
                placeholder="Passion for extreme minimalism..."
              />
            </div>
          </div>

        </div>

        {/* Right Column: Voice & Guardrails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card-lowest" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Volume2 size={20} color="var(--primary)" />
              <h2 className="title-sm">Voice Architecture</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {Object.entries(voiceSettings).map(([key, value]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="body-md" style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}</span>
                    <span className="label-sm" style={{ opacity: 0.5 }}>{value as number}%</span>
                  </div>
                  <div style={{ position: 'relative', height: '4px', background: '#E2E8F0', borderRadius: '2px' }}>
                    <div style={{ position: 'absolute', height: '100%', left: 0, width: `${value}%`, background: 'var(--primary)', borderRadius: '2px' }}></div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={value as number} 
                      onChange={(e) => setVoiceSettings({ ...voiceSettings, [key]: parseInt(e.target.value) })}
                      style={{ position: 'absolute', top: '-6px', width: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <div style={{ position: 'absolute', left: `calc(${value}% - 6px)`, top: '-4px', width: '12px', height: '12px', background: 'white', border: '2px solid var(--primary)', borderRadius: '50%', pointerEvents: 'none' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)', 
            padding: '2rem', 
            borderRadius: '16px', 
            color: 'white' 
          }}>
            <Sparkles size={24} style={{ marginBottom: '1rem' }} />
            <h3 className="title-sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Digital Twin Status</h3>
            <p className="body-md" style={{ opacity: 0.9, lineHeight: 1.5, marginBottom: '2rem' }}>
              AI is currently synchronized with your personal and professional profile. Autopilot will mirror this persona across all scheduled narratives.
            </p>
            <button 
                onClick={handleSync}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: synced ? '#10B981' : 'white', 
                  color: synced ? 'white' : 'var(--primary)', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.75rem',
                  cursor: isSyncing ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease'
                }} 
                className="body-md"
                disabled={isSyncing}
            >
                {synced ? <><CheckCircle2 size={18} /> Brain Synchronized</> : isSyncing ? 'Neural Sync in Progress...' : <><Sparkles size={18} /> Sync to Digital Twin</>}
            </button>
          </div>

          <div className="card-lowest" style={{ padding: '2rem', border: '1px solid #FEE2E2', background: '#FFF7F7', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <AlertTriangle size={20} color="#EF4444" />
              <h2 className="title-sm" style={{ color: '#EF4444' }}>Danger Zone</h2>
            </div>
            <p className="body-md" style={{ opacity: 0.6, marginBottom: '1.5rem', lineHeight: 1.4 }}>
              Reset all data to default seed state. This will delete all your current campaigns and content nodes.
            </p>
            <button 
              onClick={async () => {
                if (confirm("Are you sure? This will reset everything.")) {
                   const res = await seedDatabase();
                   alert(res.message);
                   window.location.reload();
                }
              }}
              style={{ 
                width: '100%', padding: '0.75rem', borderRadius: '8px', 
                border: '1px solid #FECACA', background: 'white', color: '#EF4444', 
                fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer'
              }}
              className="body-md"
            >
              <RotateCcw size={16} /> {t('nav.seed')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
