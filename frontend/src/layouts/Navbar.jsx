export default function Navbar() {
  return (
    <nav className="bg-surface/90 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <img 
          src="/SegPredict%20ML%20logo%20design.png" 
          alt="SegPredict Logo" 
          className="h-12 w-auto object-contain bg-white/90 py-1 px-3 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
        />
      </div>

      <div className="flex items-center gap-3 bg-surfaceLight/40 px-4 py-2 rounded-lg border border-white/5">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
         <span className="text-xs font-semibold text-green-500 tracking-wider">SYSTEM ONLINE</span>
      </div>
    </nav>
  );
}
