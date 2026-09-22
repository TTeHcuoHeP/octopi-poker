import { useEffect, useRef, useState } from 'react';

const welcome = 'Hello, I’m George, AI assistant in the poker world. Ask me anything related to poker, and I’ll try to be helpful in your path to poker mastery!';
function replyTo(message: string) {
  if (/odds|call|шанс/i.test(message)) return 'Pot odds compare the cost of a call with the pot you can win. Divide your call by the total pot after you call. For example, calling 20 into a pot of 80 gives 20 ÷ 100 = 20%. That is the break-even equity before considering future betting or tournament ICM.';
  if (/train|practice|трен/i.test(message)) return 'Try the Trainer in Inside the Platform. Choose a tournament situation, make a decision and review the feedback before your next hand.';
  if (/course|begin|learn|start|уч|нач/i.test(message)) return 'My First Solver is a starting point for getting comfortable with study tools. You can also explore Guided Study for sessions with Matt Hunt.';
  return 'This is a demo conversation with prepared answers. Try asking “How do I calculate pot odds?”, “Where can I practice?” or “How do I start learning?”';
}
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([{role:'bot',text:welcome},{role:'user',text:'How do I calculate pot odds?'}]);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const history = useRef<HTMLDivElement>(null);
  useEffect(() => { if(open) input.current?.focus(); }, [open]);
  useEffect(() => { if(history.current) history.current.scrollTop = history.current.scrollHeight; }, [messages]);
  function close() { setOpen(false); launcher.current?.focus(); }
  function send() { const text=draft.trim(); if(!text) return; setMessages(items=>[...items,{role:'user',text},{role:'bot',text:replyTo(text)}]);setDraft(''); }
  return <div className="chat-widget">
    {open && <section className="chat-panel" id="george-chat" role="dialog" aria-labelledby="george-title" onKeyDown={e=>{if(e.key==='Escape')close();}}>
      <header className="chat-header"><div><h2 id="george-title">George</h2><span>Demo assistant</span></div><button className="chat-close" onClick={close} aria-label="Close chat">×</button></header>
      <div className="chat-history" ref={history} role="log" aria-live="polite" aria-relevant="additions">{messages.map((message,index)=><div key={index} className={'chat-message chat-message-'+message.role}><img src={'/images/chatbot/'+(message.role==='bot'?'george.png':'Avatar.png')} alt={message.role==='bot'?'George':'You'}/><p>{message.text}</p></div>)}</div>
      <form className="chat-form" onSubmit={e=>{e.preventDefault();send();}}><input ref={input} value={draft} onChange={e=>setDraft(e.target.value)} maxLength={1000} aria-label="Your message" placeholder="Type your message here"/><button type="submit" disabled={!draft.trim()} aria-label="Send message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m3 3 18 9-18 9 4-9-4-9Z M7 12h14"/></svg></button></form>
    </section>}
    <button ref={launcher} className="chat-launcher" aria-label={open?'Close George chat':'Open George chat'} aria-expanded={open} aria-controls="george-chat" onClick={()=>open?close():setOpen(true)}><img src="/images/chatbot/chat_icon.svg" alt=""/></button>
  </div>;
}
