'use client';

import { Clock, Calendar as CalendarIcon, MoreVertical, Edit3, Trash2, CheckCircle2, Circle, ArrowRight, Activity, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useTransition as useReactTransition } from 'react';
import { deleteContentNode, updateContentNodeStatus } from '../actions/chronology';

export default function ChronologyClient({ initialNodes }: { initialNodes: any[] }) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useReactTransition();
  const [nodes, setNodes] = useState<any[]>(initialNodes || []);
  const [filter, setFilter] = useState('All');

  const getEventMeta = (status: string, platform: string) => {
    switch (status) {
      case 'Published': return { icon: CheckCircle2, color: '#10B981' };
      case 'Queued': return { icon: Clock, color: '#6366F1' };
      default: return { icon: Circle, color: '#94A3B8' }; 
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return t('dash.tbd');
    const d = new Date(date);
    return d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return t('dash.someday');
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return t('dash.today');
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('dash.confirm_delete') || 'Are you sure?')) return;
    const res = await deleteContentNode(id);
    if (res.success) {
      setNodes(nodes.filter(n => n.id !== id));
    }
  };

  const filteredNodes = nodes.filter(n => {
    if (filter === 'All') return true;
    return n.status === filter;
  });

  return (
    <div style={{ padding: '3rem 2.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 className="display-md" style={{ letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{t('chronology.title')}</h1>
          <p className="body-md" style={{ color: 'rgba(0,0,0,0.5)', maxWidth: '500px' }}>
            {t('chronology.subtitle')}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            background: 'var(--surface-container-high)', color: 'var(--on-surface)',
            padding: '0.75rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500
          }} className="body-md">
            <CalendarIcon size={18} /> {t('chronology.calendar_view')}
          </button>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            background: 'var(--on-surface)', color: 'var(--surface)',
            padding: '0.75rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500
          }} className="body-md">
            <Plus size={18} /> {t('chronology.draft_node')}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '3rem' }}>
        {/* Left: Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '1rem' }}>
            <h2 className="title-sm">{t('chronology.upcoming_nodes')}</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span 
                onClick={() => setFilter('All')}
                className="label-sm" 
                style={{ opacity: filter === 'All' ? 1 : 0.5, color: filter === 'All' ? 'var(--primary)' : 'inherit', cursor: 'pointer' }}
              >
                {t('chronology.filter_all')}
              </span>
              <span 
                onClick={() => setFilter('Queued')}
                className="label-sm" 
                style={{ opacity: filter === 'Queued' ? 1 : 0.5, color: filter === 'Queued' ? 'var(--primary)' : 'inherit', cursor: 'pointer' }}
              >
                {t('chronology.filter_scheduled')}
              </span>
              <span 
                onClick={() => setFilter('Draft')}
                className="label-sm" 
                style={{ opacity: filter === 'Draft' ? 1 : 0.5, color: filter === 'Draft' ? 'var(--primary)' : 'inherit', cursor: 'pointer' }}
              >
                {t('chronology.filter_drafts')}
              </span>
            </div>
          </div>

          {filteredNodes.map((node) => {
            const statusColor = node.status === 'Published' ? '#00714D' : 'rgba(0,0,0,0.4)';
            const statusBg = node.status === 'Published' ? '#ECFDF5' : 'transparent';
            return (
              <div key={node.id} className="card-lowest">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} opacity={0.4} />
                    <span className="label-sm" style={{ opacity: 0.6 }}>{formatTime(node.scheduledFor)} • {formatDate(node.scheduledFor)}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(node.id)}
                    style={{ background: 'none', border: 'none', opacity: 0.2, cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="body-md" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{node.title || node.body}</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--outline-variant)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge" style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface)' }}>
                      {node.platform}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span className="label-sm" style={{ 
                      color: node.status === 'Published' ? '#00714D' : 'rgba(0,0,0,0.4)',
                      background: node.status === 'Published' ? '#ECFDF5' : 'transparent',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {node.status === 'Published' ? t('dash.published') : node.status === 'Scheduled' ? t('dash.scheduled') : t('dash.draft')}
                    </span>
                    <button style={{ background: 'none', border: 'none', opacity: 0.2 }}>
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          <button style={{ padding: '1rem', background: 'var(--surface-container-lowest)', border: '1px dashed var(--outline-variant)', borderRadius: '8px', cursor: 'pointer', opacity: 0.6 }} className="body-md">
            {t('chronology.load_more')}
          </button>
        </div>

        {/* Right: Engine Activity */}
        <div>
          <div className="card-lowest" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Activity size={18} color="var(--primary)" />
              <h3 className="label-sm" style={{ opacity: 0.5 }}>{t('chronology.autopilot_activity')}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                  <div style={{ position: 'absolute', top: '12px', bottom: '-20px', left: '3px', width: '2px', background: 'var(--outline-variant)' }}></div>
                </div>
                <div>
                  <p className="body-md" style={{ fontSize: '0.875rem' }}>{t('chronology.activity_generated', { campaign: 'SaaS Launch Seq.', count: 3 })}</p>
                  <p className="label-sm" style={{ opacity: 0.4, marginTop: '0.25rem' }}>2 mins ago</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
