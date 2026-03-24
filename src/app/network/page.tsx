'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  MessageSquare, 
  Mail, 
  Star,
  ChevronRight,
  Loader2,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { getAudienceIntel, updateLeadStatus } from '../actions/network';
import { generateNurtureReply } from '../actions/nurture';

export default function Network() {
  const [audience, setAudience] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNurturing, setIsNurturing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAudience();
  }, []);

  async function loadAudience() {
    setIsLoading(true);
    const data = await getAudienceIntel();
    setAudience(data);
    setIsLoading(false);
  }

  const filteredAudience = audience.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (person.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High Value': return '#10B981';
      case 'Nurturing': return 'var(--primary)';
      case 'Watching': return '#6366F1';
      default: return '#64748B';
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  const handleNurture = async (id: string) => {
    setIsNurturing(id);
    const res = await generateNurtureReply(id);
    setIsNurturing(null);
    if (res.success) {
      alert(`AI SUGGESTED REPLY:\n\n"${res.reply}"`);
    } else {
      alert(`Error: ${res.error}`);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '2rem 2.5rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>Social CRM</p>
            <h1 className="headline-sm">Network Intelligence</h1>
            <p className="body-md" style={{ opacity: 0.6 }}>Your Digital Twin is currently monitoring <b>{audience.length} participants</b> across the ecosystem.</p>
          </div>
          <button className="btn-primary" style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: '0.5rem', borderRadius: '8px' }}>
            <UserPlus size={18} /> New Discovery
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="ghost-border" style={{ 
            flex: 1, height: '44px', borderRadius: '8px', background: 'white',
            display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.75rem'
          }}>
            <Search size={18} style={{ opacity: 0.4 }} />
            <input 
              type="text" 
              placeholder="Filter by name, title, or project..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1 }}
              className="body-md"
            />
          </div>
          <button className="ghost-border" style={{ width: '44px', height: '44px', padding: 0, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div style={{ flex: 1, padding: '0 2.5rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
          {filteredAudience.map((person) => (
            <div key={person.id} className="card-lowest" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '12px', 
                    backgroundImage: `url(${person.avatarUrl})`, backgroundSize: 'cover',
                    backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                    backgroundColor: 'var(--surface-container-low)'
                  }}></div>
                  <div>
                    <h3 className="title-sm">{person.name}</h3>
                    <p className="label-sm" style={{ opacity: 0.4 }}>{person.title}</p>
                  </div>
                </div>
                <div className="badge" style={{ background: `${getStatusColor(person.status)}15`, color: getStatusColor(person.status) }}>
                  {person.status}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--surface-container-low)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="label-sm" style={{ opacity: 0.4 }}>RELATIONSHIP SCORE</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: person.relationshipScore > 70 ? '#10B981' : 'inherit' }}>
                    <TrendingUp size={12} />
                    <span className="label-sm" style={{ fontWeight: 600 }}>{person.relationshipScore}/100</span>
                  </div>
                </div>
                <div style={{ height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${person.relationshipScore}%`, background: getStatusColor(person.status), transition: 'width 1s ease-out' }}></div>
                </div>
              </div>

              {person.lastAction && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ color: 'var(--primary)' }}><MessageSquare size={14} /></div>
                  <p className="body-md" style={{ fontSize: '0.8125rem', opacity: 0.6 }}>
                    {person.lastAction} <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>• {new Date(person.lastActionAt).toLocaleDateString()}</span>
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleNurture(person.id)}
                  disabled={!!isNurturing}
                  className="body-md ghost-border" 
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {isNurturing === person.id ? <><Loader2 size={12} className="animate-spin" /> Thinking...</> : 'Nurture'}
                </button>
                <button className="body-md ghost-border" style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', fontSize: '0.8125rem' }}>Details</button>
                <button className="ghost-border" style={{ width: '32px', borderRadius: '6px', padding: 0 }}><Star size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
