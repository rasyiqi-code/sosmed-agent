'use client';

import { useState } from 'react';
import { 
  Zap, 
  Shield, 
  Target, 
  Sparkles, 
  Settings, 
  Save,
  CheckCircle2,
  AlertCircle,
  Radio
} from 'lucide-react';
import { updateAutopilotSettings } from '../actions/autopilot';
import { useTranslation } from 'react-i18next';

export default function AutopilotClient({ initialData }: { initialData: any }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    isAutopilotEnabled: initialData?.isAutopilotEnabled ?? true,
    postsPerDay: initialData?.postsPerDay ?? 4,
    narrativeFocus: initialData?.narrativeFocus ?? ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('idle');
    try {
      await updateAutopilotSettings(initialData.id, formData);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: '3rem 2.5rem', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{t('auto.subtitle')}</p>
        <h1 className="display-md">{t('auto.title')}</h1>
        <p className="body-md" style={{ opacity: 0.6, marginTop: '0.5rem' }}>
          {t('auto.description')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Master Control */}
          <div className="card-lowest" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--surface-container-low)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="title-sm">{t('auto.master_switch')}</h3>
                  <p className="label-sm" style={{ opacity: 0.4 }}>{t('auto.global_override')}</p>
                </div>
              </div>
              <button 
                onClick={() => setFormData({ ...formData, isAutopilotEnabled: !formData.isAutopilotEnabled })}
                style={{
                  width: '52px',
                  height: '28px',
                  borderRadius: '14px',
                  background: formData.isAutopilotEnabled ? 'var(--primary)' : '#E2E8F0',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: '4px',
                  left: formData.isAutopilotEnabled ? '28px' : '4px',
                  transition: 'left 0.3s'
                }}></div>
              </button>
            </div>
            <p className="body-md" style={{ opacity: 0.6 }}>
              {t('auto.master_desc')}
            </p>
          </div>

          {/* Velocity Control */}
          <div className="card-lowest" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--surface-container-low)', padding: '0.75rem', borderRadius: '12px', color: '#10B981' }}>
                <Target size={24} />
              </div>
              <div>
                <h3 className="title-sm">{t('auto.velocity_title')}</h3>
                <p className="label-sm" style={{ opacity: 0.4 }}>{t('auto.velocity_subtitle')}</p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="body-md" style={{ fontWeight: 600 }}>{t('auto.posts_per_day')}</span>
                <span className="display-md" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{formData.postsPerDay}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={formData.postsPerDay}
                onChange={(e) => setFormData({ ...formData, postsPerDay: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  height: '6px',
                  background: '#E2E8F0',
                  borderRadius: '3px',
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                <span className="label-sm" style={{ opacity: 0.4 }}>{t('auto.relaxed')} (1)</span>
                <span className="label-sm" style={{ opacity: 0.4 }}>{t('auto.aggressive')} (12)</span>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--surface-container-low)', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
              <p className="label-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', marginBottom: '0.25rem' }}>
                <Sparkles size={14} /> {t('auto.ai_recommendation')}
              </p>
              <p className="body-md" style={{ fontSize: '0.8125rem', opacity: 0.7 }}>
                {t('auto.ai_rec_desc')}
              </p>
            </div>
          </div>

          {/* Narrative Steering */}
          <div className="card-lowest" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--surface-container-low)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                <Settings size={24} />
              </div>
              <div>
                <h3 className="title-sm">{t('auto.steering_title')}</h3>
                <p className="label-sm" style={{ opacity: 0.4 }}>{t('auto.steering_subtitle')}</p>
              </div>
            </div>
            
            <label className="label-sm" style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.6 }}>{t('auto.steering_label')}</label>
            <textarea 
              className="body-md ghost-border"
              placeholder={t('auto.steering_placeholder')}
              value={formData.narrativeFocus}
              onChange={(e) => setFormData({ ...formData, narrativeFocus: e.target.value })}
              style={{
                width: '100%',
                height: '100px',
                padding: '1rem',
                borderRadius: '8px',
                background: 'white',
                resize: 'none',
                outline: 'none'
              }}
            />
            <p className="label-sm" style={{ marginTop: '0.75rem', opacity: 0.4 }}>
              {t('auto.steering_desc')}
            </p>
          </div>

        </div>

        {/* Sidebar Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-lowest" style={{ padding: '1.5rem' }}>
            <h3 className="label-sm" style={{ opacity: 0.4, marginBottom: '1.25rem' }}>{t('auto.system_status')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="body-md">{t('auto.engine_status')}</span>
                <span className="badge badge-active">{formData.isAutopilotEnabled ? t('auto.running') : t('auto.paused')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="body-md">{t('auto.sync_latency')}</span>
                <span className="body-md" style={{ fontWeight: 600 }}>{t('auto.latency_optimized')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="body-md">{t('auto.ai_confidence')}</span>
                <span className="body-md" style={{ fontWeight: 600, color: 'var(--primary)' }}>{t('auto.confidence_high')}</span>
              </div>
            </div>
          </div>

          <div className="card-lowest" style={{ padding: '1.5rem' }}>
            <h3 className="label-sm" style={{ opacity: 0.4, marginBottom: '1.25rem' }}>{t('auto.safety_rails')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Shield size={16} color="var(--primary)" style={{ marginTop: '2px' }} />
                <p className="label-sm" style={{ opacity: 0.6 }}>{t('auto.safety_topics')}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Shield size={16} color="var(--primary)" style={{ marginTop: '2px' }} />
                <p className="label-sm" style={{ opacity: 0.6 }}>{t('auto.safety_spend')}</p>
              </div>
            </div>
          </div>

          {/* Manual Trigger for Testing */}
          <button 
            onClick={async () => {
              const res = await fetch('/api/worker/tick', { method: 'POST' });
              const data = await res.json();
              if (data.results?.length > 0) {
                alert(`Engine Tick: ${data.results.map((r: any) => r.type).join(', ')}`);
              } else {
                alert("Engine Tick: No items processed.");
              }
            }}
            className="body-md ghost-border" 
            style={{ 
              width: '100%', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <Radio size={16} /> {t('auto.trigger_tick')}
          </button>

          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={isSaving}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem',
              marginTop: '1rem'
            }}
          >
            {isSaving ? t('auto.saving') : status === 'success' ? <><CheckCircle2 size={18} /> {t('auto.saved')}</> : status === 'error' ? <><AlertCircle size={18} /> {t('auto.error_saving')}</> : <><Save size={18} /> {t('auto.save_settings')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
