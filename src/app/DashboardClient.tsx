'use client';

import { 
  Users, 
  Target, 
  Zap, 
  Radio, 
  MoreHorizontal, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DashboardClient({ data }: { data: any }) {
  const { t } = useTranslation();
  const formatReach = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const metrics = [
    { label: t('dash.reach'), value: formatReach(data.totalReach), growth: '12.4%', icon: Users, color: '#4F46E5', bg: '#EEF2FF' },
    { label: t('dash.engagement'), value: formatReach(data.engagement), growth: '8.2%', icon: Target, color: '#10B981', bg: '#ECFDF5' },
    { label: t('dash.efficiency'), value: '94.2%', growth: '2.1%', icon: Zap, color: '#EF4444', bg: '#FEF2F2' },
    { label: t('dash.running'), value: data.runningCampaigns.toString(), status: 'ACTIVE', icon: Radio, color: '#3B82F6', bg: '#EFF6FF' },
  ];



  return (
    <div style={{ padding: '3rem 2.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{t('dash.subtitle')}</p>
          <h1 className="display-md">{t('dash.title')}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="ghost-border" style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '36px' }}>
            <button className="body-md" style={{ padding: '0 1rem', background: 'white', border: 'none', borderRight: '1px solid var(--outline-variant)', fontWeight: 600 }}>{t('dash.last_30')}</button>
            <button className="body-md" style={{ padding: '0 1rem', background: 'var(--surface-container-low)', border: 'none', color: 'rgba(0,0,0,0.4)' }}>{t('dash.quarterly')}</button>
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
            <Download size={16} /> {t('dash.export')}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {metrics.map((m) => (
              <div key={m.label} className="card-lowest" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ background: m.bg, color: m.color, padding: '0.5rem', borderRadius: '8px' }}>
                    <m.icon size={20} />
                  </div>
                  {m.growth && (
                    <span className="label-sm" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <TrendingUp size={12} /> {m.growth}
                    </span>
                  )}
                  {m.status && (
                    <span className="badge badge-active">{m.status}</span>
                  )}
                </div>
                <p className="label-sm" style={{ color: 'rgba(0,0,0,0.4)', marginBottom: '0.25rem' }}>{m.label.toUpperCase()}</p>
                <p className="display-md" style={{ fontSize: '1.5rem' }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="card-lowest" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h3 className="title-sm">{t('dash.growth_spectrum')}</h3>
                <span className="badge" style={{ background: '#F1F5F9', color: '#64748B' }}>Mock Data</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                  <span className="label-sm" style={{ opacity: 0.6 }}>{t('dash.organic')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(53, 37, 205, 0.1)' }}></div>
                  <span className="label-sm" style={{ opacity: 0.6 }}>{t('dash.promoted')}</span>
                </div>
              </div>
            </div>
            
            <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '2rem' }}>
              {[60, 40, 80, 50, 90, 70, 45].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div className="chart-bar chart-bar-promoted" style={{ height: `${h * 0.4}%`, width: '100%' }}></div>
                  <div className="chart-bar chart-bar-organic" style={{ height: `${h * 0.6}%`, width: '100%' }}></div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2rem', borderTop: '1px solid var(--outline-variant)' }}>
              <div>
                <p className="label-sm" style={{ opacity: 0.4 }}>{t('dash.peak_reach')}</p>
                <p className="title-sm">142,000 <span style={{ opacity: 0.4, fontWeight: 400 }}>/day</span></p>
              </div>
              <div>
                <p className="label-sm" style={{ opacity: 0.4 }}>{t('dash.avg_duration')}</p>
                <p className="title-sm">2.4m <span style={{ opacity: 0.4, fontWeight: 400 }}>/session</span></p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600 }} className="body-md">
                {t('dash.view_attribution')}
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Digital Twin Confidence */}
          <div style={{ 
            background: 'var(--primary)', 
            padding: '2rem', 
            borderRadius: '16px', 
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="title-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{t('dash.confidence_title')}</h3>
              <Sparkles size={16} fill="white" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="display-md" style={{ fontSize: '2.5rem' }}>92%</span>
              <span className="label-sm" style={{ paddingBottom: '0.5rem', opacity: 0.6 }}>{t('dash.optimal_sync')}</span>
            </div>
            <p className="body-md" style={{ marginBottom: '1.5rem', lineHeight: 1.5, opacity: 0.8 }}>
              {t('dash.confidence_desc')}
            </p>
            <div className="progress-container" style={{ height: '6px', background: 'rgba(255,255,255,0.2)' }}>
              <div className="progress-fill" style={{ width: '92%', background: 'white' }}></div>
            </div>
          </div>

          {/* Next 3 Moves (Micro Preview) */}
          <div className="card-lowest" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="title-sm">{t('dash.next_moves')}</h3>
              <span className="label-sm" style={{ opacity: 0.4 }}>{t('nav.view_all')}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.nextMoves.map((move: any, i: number) => (
                <div key={i} style={{ 
                  padding: '1rem', 
                  borderRadius: '10px', 
                  background: 'var(--surface-container-low)',
                  border: i === 0 ? '1px solid var(--primary)' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="label-sm" style={{ opacity: 0.4 }}>{move.time}</span>
                    <span className="label-sm" style={{ color: 'var(--primary)' }}>{move.platform}</span>
                  </div>
                  <p className="body-md" style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {move.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Autopilot Control (Velocity Slider) */}
          <div className="card-lowest" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="title-sm">{t('dash.velocity_title')}</h3>
              <span className={`badge ${data.autopilotSettings.isEnabled ? 'badge-active' : ''}`} style={{ background: data.autopilotSettings.isEnabled ? '' : '#E2E8F0', color: data.autopilotSettings.isEnabled ? '' : '#64748B' }}>
                {data.autopilotSettings.isEnabled ? t('dash.synced') : t('dash.paused')}
              </span>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="body-md" style={{ opacity: 0.6 }}>{t('dash.frequency')}</span>
                <span className="title-sm" style={{ color: 'var(--primary)' }}>{data.autopilotSettings.postsPerDay} {t('dash.posts_day')}</span>
              </div>
              <div style={{ position: 'relative', height: '4px', background: '#E2E8F0', borderRadius: '2px' }}>
                <div style={{ position: 'absolute', height: '100%', left: 0, width: `${(data.autopilotSettings.postsPerDay / 12) * 100}%`, background: 'var(--primary)', borderRadius: '2px' }}></div>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  disabled
                  value={data.autopilotSettings.postsPerDay}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    width: '100%',
                    opacity: 0,
                    cursor: 'default'
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  left: `calc(${(data.autopilotSettings.postsPerDay / 12) * 100}% - 6px)`, 
                  top: '-4px', 
                  width: '12px', 
                  height: '12px', 
                  background: 'white', 
                  border: '2px solid var(--primary)', 
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span className="label-sm" style={{ opacity: 0.3 }}>{t('auto.relaxed')}</span>
                <span className="label-sm" style={{ opacity: 0.3 }}>{t('auto.aggressive')}</span>
              </div>
            </div>

            <div style={{ 
              padding: '1rem', 
              borderRadius: '8px', 
              background: 'var(--surface-container-low)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <TrendingUp size={16} color="var(--primary)" />
              <p className="label-sm" style={{ opacity: 0.6, lineHeight: 1.4 }}>
                {t('dash.velocity_prediction')}
              </p>
            </div>
          </div>

          {/* Platform Attribution */}
          <div className="card-lowest" style={{ padding: '1.5rem' }}>
            <h3 className="title-sm" style={{ marginBottom: '1.5rem' }}>{t('dash.attribution_title')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Instagram', value: 42, color: '#4F46E5' },
                { name: 'Twitter (X)', value: 28, color: '#059669' },
                { name: 'LinkedIn', value: 30, color: '#E11D48' },
              ].map(p => (
                <div key={p.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="label-sm" style={{ opacity: 0.6 }}>{p.name}</span>
                    <span className="label-sm">{p.value}%</span>
                  </div>
                  <div className="progress-container" style={{ height: '4px' }}>
                    <div className="progress-fill" style={{ width: `${p.value}%`, background: p.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
