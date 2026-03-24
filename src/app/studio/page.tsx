'use client';

import { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw, 
  Share2, 
  Check, 
  Loader2, 
  Heart, 
  MessageCircle, 
  Repeat, 
  MessageSquare 
} from 'lucide-react';
import { createContentNode } from '../actions/studio';
import { getActivePersona } from '../actions/persona';
import { generateDraft } from '../actions/ai';
import { useTranslation } from 'react-i18next';

export default function StudioPage() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [steeringText, setSteeringText] = useState('');
  const [isSteering, setIsSteering] = useState(false);
  const [steeringSuccess, setSteeringSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('Threads');
  const [persona, setPersona] = useState<any>(null);

  useEffect(() => {
    getActivePersona()
      .then(data => setPersona(data))
      .catch(err => console.error("Failed to fetch persona:", err));
  }, []);

  const handleSetSteering = () => {
    setIsSteering(true);
    // Simulation logic
    setTimeout(() => {
      setIsSteering(false);
      setSteeringSuccess(true);
      setTimeout(() => setSteeringSuccess(false), 2000);
    }, 1000);
  };

  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: t('studio.welcome') },
  ]);

  const [previewContent, setPreviewContent] = useState({
    title: t('studio.untitled'),
    body: t('studio.empty_body'),
    platform: 'Threads',
    isApproved: false
  });

  const handleSend = async () => {
    if (!message.trim() || isGenerating) return;

    const currentMessage = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: currentMessage }]);
    setIsGenerating(true);

    try {
      const res = await generateDraft(currentMessage, steeringText);
      if (res.success && res.text) {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          text: `${t('studio.draft_received')} ${res.contextUsed?.length ? `(Context: ${res.contextUsed.join(', ')})` : ''}`
        }]);
        setPreviewContent({
          title: currentMessage.slice(0, 30) + '...',
          body: res.text,
          platform: selectedPlatform,
          isApproved: false
        });
      } else {
        throw new Error(res.error || "Generation failed");
      }
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      setChatHistory(prev => [...prev, { role: 'assistant', text: t('studio.error_occurred', { error: error.message }) }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    try {
      const activePersona = await getActivePersona();
      
      const res = await createContentNode({
        personaId: activePersona.id,
        body: previewContent.body,
        platform: selectedPlatform
      });

      if (res && res.id) {
        setPreviewContent(prev => ({ ...prev, isApproved: true }));
      }
    } catch (error) {
      console.error("Failed to approve content:", error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: 'white', overflow: 'hidden' }}>
      {/* Studio Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--outline-variant)' }}>
        
        {/* Sub Header */}
        <header style={{ padding: '1.5rem 2rem', background: 'var(--surface-container-low)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p className="label-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{t('nav.creative')}</p>
              <h1 className="display-md">{t('studio.title')}</h1>
            </div>
            <div style={{ width: '400px' }}>
              <label className="label-sm" style={{ opacity: 0.4, display: 'block', marginBottom: '0.5rem' }}>{t('studio.global_steering')}</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={steeringText}
                  onChange={(e) => setSteeringText(e.target.value)}
                  placeholder={t('studio.steering_placeholder')} 
                  className="body-md ghost-border"
                  style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', background: 'white', transition: 'all 0.3s' }}
                />
                <button 
                  className="btn-primary" 
                  style={{ 
                    padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.75rem', minWidth: '100px',
                    background: steeringSuccess ? '#10B981' : 'var(--primary)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'
                  }}
                  onClick={handleSetSteering}
                  disabled={isSteering}
                >
                  {steeringSuccess ? <><Check size={14} /> {t('studio.synced')}</> : isSteering ? t('studio.syncing') : <><Sparkles size={14} /> {t('studio.set_course')}</>}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Chat / Workspace Pane */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="no-scrollbar">
          {chatHistory.map((chat, i) => (
            <div key={i} style={{ 
              alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              display: 'flex',
              gap: '1rem'
            }}>
              {chat.role === 'assistant' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={16} color="white" />
                </div>
              )}
              <div style={{ 
                background: chat.role === 'user' ? 'var(--primary)' : 'var(--surface-container-low)',
                color: chat.role === 'user' ? 'white' : 'inherit',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                lineHeight: 1.6
              }} className="body-md">
                {chat.text}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={16} color="white" className="animate-spin" />
              </div>
              <p className="label-sm" style={{ opacity: 0.4 }}>{t('studio.architecting')}</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer style={{ padding: '1.5rem 2rem', background: 'var(--surface-container-low)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {[t('studio.suggestion_thread'), t('studio.suggestion_analytics'), t('studio.suggestion_tone')].map(tag => (
              <button key={tag} className="label-sm" style={{ border: 'none', background: 'white', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', opacity: 0.6 }}>{tag}</button>
            ))}
          </div>
          <div 
            className="ghost-border" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 1rem', 
              borderRadius: '12px', 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Sparkles size={18} color="var(--primary)" />
            <input 
              type="text" 
              placeholder={isGenerating ? t('studio.architecting') : t('studio.input_placeholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleSend()}
              style={{ border: 'none', background: 'transparent', flex: 1, padding: '1rem', outline: 'none' }}
              className="body-md"
              disabled={isGenerating}
            />
            <button 
              onClick={handleSend} 
              disabled={isGenerating || !message.trim()}
              style={{ border: 'none', background: 'transparent', cursor: isGenerating ? 'wait' : 'pointer', color: 'var(--primary)', opacity: (isGenerating || !message.trim()) ? 0.3 : 1 }}
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </footer>
      </div>

      {/* Preview Pane */}
      <div style={{ width: '400px', background: 'var(--surface)', padding: '2rem', display: 'flex', flexDirection: 'column' }} suppressHydrationWarning>
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px' }}>
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M72.06 63.34c-2.45-3.04-5.26-6.19-9.15-8.22 13.91-14.71 13.92-33.8 0-48.45 4.35 2.52 7.15 6.06 9.15 9.11 11.21 17.5 11.21 40.06 0 57.56zM50 100c-27.61 0-50-22.39-50-50S22.39 0 50 0s50 22.39 50 50-22.39 50-50 50zm0-89.29c-14.54 0-26.6 11.14-26.6 25.13 0 10.4 6.64 19.34 16.27 23.36-2.5 1.5-4.43 3.65-5.61 6.13-2.12-2.16-4.59-4.32-7.23-6.42-3.1-2.46-5.87-4.49-8.4-6.17-.46-.3-1.42-.9-2.22-1.38-16.7-10.35-16.7-27.7 0-38.05 4.09-2.53 8.36-4.14 12.82-4.9-3.23.46-6.28 1.44-9.12 3.03-12.79 7.15-12.79 18.73 0 25.88l1.43.83c1.9 1.14 3.86 2.37 5.8 3.7.8.55 1.62 1.13 2.44 1.73.19.14.41.28.61.43.2.14.4.29.58.44.18.15.35.31.51.48.16.17.31.35.45.54.14.19.26.39.36.6.1.21.18.44.25.68.07.24.12.49.15.75.03.26.04.53.04.81s-.01.55-.04.81c-.03.26-.08.51-.15.75-.07.24-.15.47-.25.68-.1.21-.22.41-.36.6-.14.19-.29.37-.45.54-.16.17-.33.33-.51.48-.18.15-.38.3-.58.44-.2.15-.42.29-.61.43-.82.6-1.64 1.18-2.44 1.73-1.94 1.33-3.9 2.56-5.8 3.7l-1.43.83c-12.79 7.15-12.79 18.73 0 25.88 2.84 1.59 5.89 2.57 9.12 3.03l-.11-1.01s.11 1.01.11 1.01zm0 78.58c16.7 10.35 16.7 27.7 0 38.05-3.08 1.9-6.38 3.19-9.83 3.9h.03c4.46.76 8.73 2.37 12.82 4.9 16.7 10.35 16.7 27.7 0 38.05-4.46 2.76-9.17 4.51-14.12 5.38 4.95-.87 9.66-2.62 14.12-5.38 16.7-10.35 16.7-27.7 0-38.05-4.09-2.53-8.36-4.14-12.82-4.9h-.03c-.34.02-.68.03-1.02.03-14.54 0-26.6-11.14-26.6-25.13s12.06-25.13 26.6-25.13c14.54 0 26.6 11.14 26.6 25.13s-12.06 25.13-26.6 25.13c-.34 0-.68-.01-1.02-.03h-.03c-4.46-.76-8.73-2.37-12.82-4.9-16.7-10.35-16.7-27.7 0-38.05 4.46-2.76 9.17-4.51 14.12-5.38-4.95.87-9.66 2.62-14.12 5.38-16.7 10.35-16.7 27.7 0 38.05 4.09-2.53 8.36-4.14 12.82-4.9h.03c-.34.02.68.03 1.02.03h.03zm-10.74-32.93c1.18-2.48 3.11-4.63 5.61-6.13-9.63-4.02-16.27-12.96-16.27-23.36 0-13.99 12.06-25.13 26.6-25.13 14.54 0 26.6 11.14 26.6 25.13s-12.06 25.13-26.6 25.13c-.34 0-.68-.01-1.02-.03v.01c-3.1.28-6.19.06-9.15-.65 3.89 2.03 6.7 5.18 9.15 8.22 11.21-17.5 11.21-40.06 0-57.56-2-3.05-4.81-6.59-9.15-9.11-13.92 14.65-13.91 33.74 0 48.45-2.12 2.16-4.59 4.32-7.23 6.42-3.1 2.46-5.87 4.49-8.4 6.17-.46.3-1.42.9-2.22 1.38-16.7 10.35-16.7 27.7 0 38.05 3.45 2.14 6.75 3.43 9.83 3.9v-.01c4.95-.87 9.66-2.62 14.12-5.38 16.7-10.35 16.7-27.7 0-38.05-4.09-2.53-8.36-4.14-12.82-4.9v.01c-.34-.02-.68-.03-1.02-.03-14.54 0-26.6-11.14-26.6-25.13s12.06-25.13 26.6-25.13 26.6 11.14 26.6 25.13-12.06 25.13-26.6 25.13c-.34 0-.68-.01-1.02-.03l-.11-1.01c3.23.46 6.28 1.44 9.12 3.03 12.79 7.15 12.79 18.73 0 25.88z"/>
              </svg>
            </div>
            <h2 className="label-sm" style={{ fontWeight: 700 }}>{t('studio.preview')}</h2>
          </div>
          <select 
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setPreviewContent(prev => ({ ...prev, platform: e.target.value }));
            }}
            className="label-sm"
            style={{ border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer', opacity: 0.6 }}
          >
            <option value="Threads">Threads</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Instagram">Instagram</option>
          </select>
        </div>

        {/* Dynamic Threads Post UI */}
        <div className="card-lowest no-scrollbar" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'white' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--outline-variant)', flexShrink: 0, backgroundImage: persona?.socialAccounts?.[0]?.avatarUrl ? `url(${persona.socialAccounts[0].avatarUrl})` : 'none', backgroundSize: 'cover' }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="body-md" style={{ fontWeight: 700 }}>{persona?.socialAccounts?.[0]?.handle || "rasyiqi"}</span>
                  <div style={{ background: '#1D9BF0', borderRadius: '50%', padding: '2px' }}>
                    <Check size={8} color="white" />
                  </div>
                </div>
                <MoreHorizontal size={16} style={{ opacity: 0.4 }} />
              </div>
              
              <div style={{ marginTop: '0.25rem' }}>
                {previewContent.body.split('\n\n').map((chunk, index) => (
                  <div key={index} style={{ marginBottom: index < previewContent.body.split('\n\n').length - 1 ? '1.5rem' : 0 }}>
                    <p className="body-md" style={{ lineHeight: 1.5 }}>{chunk}</p>
                    
                    {/* Mock Interactivity */}
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', opacity: 0.4 }}>
                      <Heart size={18} />
                      <MessageCircle size={18} />
                      <Repeat size={18} />
                      <Share2 size={18} />
                    </div>

                    {/* Thread Connector Line if it's not the last chunk */}
                    {index < previewContent.body.split('\n\n').length - 1 && (
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <div style={{ width: '36px', display: 'flex', justifyContent: 'center' }}>
                          <div style={{ width: '2px', height: '1.5rem', background: 'var(--outline-variant)' }}></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.4 }}>
                           <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--outline-variant)' }}></div>
                           <span className="label-sm">{t('studio.reply_to', { handle: persona?.socialAccounts?.[0]?.handle || "rasyiqi" })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button 
            onClick={handleApprove}
            disabled={previewContent.isApproved || !previewContent.body}
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {previewContent.isApproved ? (
              <><CheckCircle2 size={18} /> {t('studio.approve')}</>
            ) : (
              <><Sparkles size={18} /> {t('studio.approve')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const MoreHorizontal = ({ size, style }: { size: number, style?: any }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
