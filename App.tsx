
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import ChristmasTree from './components/ChristmasTree';
import PostProcessing from './components/PostProcessing';
import { ArixConciergeService } from './services/geminiService';
import { COLORS, INITIAL_CONFIG } from './constants';
import { ChatMessage, TreeMorphStatus } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [treeConfig, setTreeConfig] = useState(INITIAL_CONFIG);
  const [morphStatus, setMorphStatus] = useState<TreeMorphStatus>(TreeMorphStatus.TREE_SHAPE);
  
  const concierge = useRef(new ArixConciergeService());
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleMorph = () => {
    setMorphStatus(prev => 
      prev === TreeMorphStatus.TREE_SHAPE ? TreeMorphStatus.SCATTERED : TreeMorphStatus.TREE_SHAPE
    );
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    const response = await concierge.current.getResponse(userMsg, history);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    
    setTreeConfig(prev => ({
      ...prev,
      lightIntensity: 1.5 + Math.random(),
      rotationSpeed: 0.2 + Math.random() * 0.3
    }));

    if (userMsg.toLowerCase().includes('scatter') || userMsg.toLowerCase().includes('disperse')) {
      setMorphStatus(TreeMorphStatus.SCATTERED);
    } else if (userMsg.toLowerCase().includes('shape') || userMsg.toLowerCase().includes('form') || userMsg.toLowerCase().includes('tree')) {
      setMorphStatus(TreeMorphStatus.TREE_SHAPE);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#021a12] text-[#d4af37] overflow-hidden">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0.5, 12]} fov={40} />
          <color attach="background" args={[COLORS.EMERALD_DARK]} />
          <fog attach="fog" args={[COLORS.EMERALD_DARK, 8, 25]} />
          
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[15, 20, 15]} 
            angle={0.2} 
            penumbra={1} 
            intensity={3} 
            castShadow 
            color={COLORS.GOLD_BRIGHT}
          />
          <pointLight position={[-10, -5, -10]} intensity={0.8} color={COLORS.EMERALD_MID} />

          <Suspense fallback={null}>
            <ChristmasTree config={treeConfig} status={morphStatus} />
            <Environment preset="night" />
            <ContactShadows 
              position={[0, -3.5, 0]} 
              opacity={0.4} 
              scale={25} 
              blur={2} 
              far={10} 
            />
            <PostProcessing />
          </Suspense>

          <OrbitControls 
            enablePan={false} 
            minDistance={8} 
            maxDistance={20} 
            maxPolarAngle={Math.PI / 1.7} 
          />
        </Canvas>
      </div>

      {/* UI Overlay: Branding */}
      <header className="absolute top-0 left-0 w-full p-8 z-10 pointer-events-none flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-serif gold-gradient-text tracking-tighter drop-shadow-2xl text-center">
          ARIX SIGNATURE
        </h1>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-80 mt-2 font-light text-center">
          Luxury Interactive Christmas Masterpiece
        </p>
      </header>

      {/* UI Overlay: Controls (Relocated to Top Right) */}
      <div className="absolute top-8 right-8 z-20 pointer-events-auto">
        <button 
          onClick={toggleMorph}
          className="group flex items-center gap-3 bg-black/40 backdrop-blur-md border border-gold-metallic/30 px-5 py-2.5 rounded-full hover:bg-gold-metallic hover:text-emerald-950 transition-all duration-500 shadow-xl"
        >
          <div className={`w-2 h-2 rounded-full ${morphStatus === TreeMorphStatus.TREE_SHAPE ? 'bg-emerald-400' : 'bg-gold-bright animate-pulse'}`} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            {morphStatus === TreeMorphStatus.TREE_SHAPE ? 'Disperse' : 'Manifest'}
          </span>
        </button>
      </div>

      {/* UI Overlay: Compact Bottom Concierge */}
      <aside className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[700px] h-[160px] md:h-[180px] z-20 bg-emerald-950/60 backdrop-blur-2xl border border-gold-metallic/20 rounded-3xl flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-700">
        
        {/* Chat Feed (Smaller Padding) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center py-2">
              <p className="text-[11px] italic opacity-70 leading-relaxed font-serif text-gold-bright/80">
                "Welcome. I am the Arix Concierge. Speak your wishes to the emerald glow."
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-md ${
                msg.role === 'user' 
                  ? 'bg-emerald-800/60 border border-gold-metallic/20 text-gold-bright rounded-tr-none' 
                  : 'bg-black/60 border border-emerald-900/30 text-white/90 rounded-tl-none italic font-light'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-black/40 px-4 py-2 rounded-2xl animate-pulse text-[10px] text-gold-metallic italic">
                Concierge is listening...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar (Sleeker) */}
        <form onSubmit={handleSendMessage} className="p-3 bg-black/30 border-t border-gold-metallic/10 backdrop-blur-xl">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Manifest your holiday desire..."
              className="w-full bg-emerald-950/40 border border-gold-metallic/10 rounded-full py-2.5 px-6 text-xs focus:outline-none focus:border-gold-metallic/40 transition-all text-white placeholder:text-gold-metallic/20"
            />
            <button 
              type="submit"
              className="absolute right-2 p-2 bg-gold-metallic text-emerald-950 rounded-full hover:brightness-110 active:scale-90 transition-all shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </aside>

      {/* Subtle Branding Bottom Left */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:block opacity-30 pointer-events-none">
        <div className="text-[9px] tracking-[0.4em] uppercase font-bold text-gold-metallic mb-0.5">ESTATE STATUS</div>
        <div className="text-[10px] font-light text-white uppercase tracking-widest">{morphStatus}</div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
