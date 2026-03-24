'use client';

import { Database, Search, FileText, Link as LinkIcon, Plus, Sparkles, BrainCircuit, File, Trash, Edit3, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useTransition as useReactTransition } from 'react';
import { addKnowledgeAsset, deleteKnowledgeAsset } from '../actions/cortex';

export default function CortexClient({ initialAssets }: { initialAssets: any[] }) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useReactTransition();
  const [assets, setAssets] = useState<any[]>(initialAssets || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState({ title: '', type: 'link', source: '' });

  const getAssetMeta = (type: string) => {
    switch (type.toLowerCase()) {
      case 'link': return { icon: LinkIcon, color: '#3B82F6' };
      case 'doc': return { icon: FileText, color: '#10B981' };
      case 'note': return { icon: FileText, color: '#F59E0B' };
      default: return { icon: FileText, color: '#F59E0B' };
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('dash.confirm_delete') || 'Are you sure?')) return;
    const res = await deleteKnowledgeAsset(id);
    if (res.success) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addKnowledgeAsset(newAsset);
      if (res.success && res.asset) {
        setAssets([res.asset, ...assets]);
        setShowAddForm(false);
        setNewAsset({ title: '', type: 'link', source: '' });
      }
    });
  };

  const filteredAssets = assets.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.content && a.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.url && a.url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '3rem 2.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 className="display-md" style={{ letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{t('cortex.title')}</h1>
          <p className="body-md" style={{ color: 'rgba(0,0,0,0.5)', maxWidth: '500px' }}>
            {t('cortex.subtitle')}
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            background: 'var(--on-surface)', color: 'var(--surface)',
            padding: '0.75rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500
          }} className="body-md">
          <Plus size={18} /> {t('cortex.feed_brain')}
        </button>
      </div>

      {showAddForm && (
        <div className="card-lowest" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>TITLE</label>
              <input 
                type="text" 
                required
                value={newAsset.title}
                onChange={e => setNewAsset({ ...newAsset, title: e.target.value })}
                className="body-md ghost-border" 
                style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none' }}
              />
            </div>
            <div>
              <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>TYPE</label>
              <select 
                value={newAsset.type}
                onChange={e => setNewAsset({ ...newAsset, type: e.target.value })}
                className="body-md ghost-border"
                style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none' }}
              >
                <option value="link">Link</option>
                <option value="note">Note</option>
                <option value="doc">Document</option>
              </select>
            </div>
            <div>
              <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{newAsset.type === 'link' ? 'URL' : 'CONTENT'}</label>
              <input 
                type="text" 
                required
                value={newAsset.source}
                onChange={e => setNewAsset({ ...newAsset, source: e.target.value })}
                className="body-md ghost-border" 
                style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--surface-container-low)', border: 'none' }}
              />
            </div>
            <button 
              type="submit"
              disabled={isPending}
              style={{ background: 'var(--primary)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              className="body-md"
            >
              {isPending ? '...' : 'Add'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Left: Main Content List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Drop Zone */}
          <div style={{ 
            border: '2px dashed var(--outline-variant)', 
            borderRadius: '12px', 
            padding: '4rem 2rem', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            background: 'var(--surface-container-low)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <Database size={32} color="var(--primary)" opacity={0.6} />
            <div>
              <h3 className="title-sm" style={{ marginBottom: '0.5rem' }}>{t('cortex.drop_zone')}</h3>
              <p className="body-md" style={{ opacity: 0.5, maxWidth: '300px' }}>
                {t('cortex.drop_desc')}
              </p>
            </div>
          </div>

          {/* Asset List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="title-sm">{t('cortex.ingested_assets')}</h3>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('cortex.search')}
                  className="body-md ghost-border" 
                  style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '20px', background: 'var(--surface-container-low)', border: 'none', width: '250px' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {filteredAssets.map((src) => {
                const meta = getAssetMeta(src.type);
                const Icon = meta.icon;
                return (
                <div key={src.id} className="card-lowest" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge" style={{ background: 'var(--surface-container-low)', opacity: 0.5 }}>{src.type}</span>
                      <button 
                        onClick={() => handleDelete(src.id)}
                        style={{ background: 'none', border: 'none', opacity: 0.2, cursor: 'pointer', padding: 0 }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                  <h4 className="body-md" style={{ fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>{src.title}</h4>
                  <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    {src.type === 'link' && <span className="label-sm" style={{ opacity: 0.4, wordBreak: 'break-all' }}>{src.url}</span>}
                    {src.type === 'note' && <p className="body-md" style={{ opacity: 0.6, fontSize: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{src.content}"</p>}
                    {src.type === 'doc' && <span className="label-sm" style={{ opacity: 0.4 }}>{t('cortex.processed_asset')}</span>}
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>

        {/* Right Column: Processing Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '2rem', 
            borderRadius: '16px', 
            color: 'white' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="title-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{t('cortex.synthesis_engine')}</h3>
              <Sparkles size={16} fill="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="label-sm" style={{ opacity: 0.8 }}>{t('cortex.core_db_vectorization')}</span>
                  <span className="label-sm">100%</span>
                </div>
                <div className="progress-container" style={{ height: '4px', background: 'rgba(255,255,255,0.2)' }}>
                  <div className="progress-fill" style={{ width: '100%', background: 'white' }}></div>
                </div>
              </div>
              <p className="body-md" style={{ opacity: 0.8, lineHeight: 1.5, fontSize: '0.75rem' }}>
                {t('cortex.system_desc_dynamic', { count: assets.length })}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
