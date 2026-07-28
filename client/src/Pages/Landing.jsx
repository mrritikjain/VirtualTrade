import React from "react";

const Landing = () => {
  // Static mock trading terminal data
  const assets = [
    { 
      symbol: "BTC/USD", 
      name: "Bitcoin", 
      price: 64250.80, 
      change: 2.45, 
      linePath: "M 0 20 L 20 15 L 40 25 L 60 8 L 80 18 L 110 5",
      areaPath: "M 0 20 L 20 15 L 40 25 L 60 8 L 80 18 L 110 5 L 110 30 L 0 30 Z"
    },
    { 
      symbol: "ETH/USD", 
      name: "Ethereum", 
      price: 3450.20, 
      change: 1.82, 
      linePath: "M 0 18 L 20 22 L 40 12 L 60 18 L 80 10 L 110 6",
      areaPath: "M 0 18 L 20 22 L 40 12 L 60 18 L 80 10 L 110 6 L 110 30 L 0 30 Z"
    },
    { 
      symbol: "AAPL", 
      name: "Apple Inc.", 
      price: 182.10, 
      change: 1.15, 
      linePath: "M 0 25 L 20 22 L 40 20 L 60 14 L 80 10 L 110 8",
      areaPath: "M 0 25 L 20 22 L 40 20 L 60 14 L 80 10 L 110 8 L 110 30 L 0 30 Z"
    },
    { 
      symbol: "TSLA", 
      name: "Tesla Inc.", 
      price: 178.50, 
      change: -0.75, 
      linePath: "M 0 6 L 20 12 L 40 18 L 60 28 L 80 20 L 110 24",
      areaPath: "M 0 6 L 20 12 L 40 18 L 60 28 L 80 20 L 110 24 L 110 30 L 0 30 Z"
    }
  ];

  return (
    <div className="h-screen max-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
      
      {/* Decorative Gradient Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[180px] pointer-events-none"></div>

      {/* Header/Navbar */}
      <header className="z-50 border-b border-zinc-900/60 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg className="w-5 h-5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Virtual<span className="text-teal-400 font-extrabold">Trade</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer px-3 py-1.5">
              Sign In
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg border border-zinc-700 transition-all duration-200 cursor-pointer">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 overflow-hidden py-4">
        
        {/* Left Hero Column */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest">Risk-Free Simulator</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Master trading. <br />
              <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Without the risk.
              </span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">
              Practice stock and crypto trading in real-time with zero financial risk. We start your account with $100,000 in virtual cash so you can test your strategies securely.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-row gap-3">
            <button className="bg-gradient-to-r from-teal-500 to-emerald-400 text-zinc-950 hover:from-teal-400 hover:to-emerald-300 font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-teal-500/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              Start Trading Free
            </button>
            <button className="border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              View Markets
            </button>
          </div>

          {/* Minimal Key Feature Badges */}
          <div className="pt-6 border-t border-zinc-900 grid grid-cols-3 gap-4">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0 border border-teal-500/10">
                <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Live Feeds</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Real-time assets</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/10">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">No Risk</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">$100k virtual</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/10">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Leaderboards</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Rank & compete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Column (Dedicated Asset Tracker Workspace) */}
        <div className="lg:col-span-6 w-full flex justify-center items-center overflow-hidden">
          <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
            
            {/* Asset Tracker Header */}
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Asset Tracker</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">LIVE_MONITOR_v1.0</span>
            </div>

            {/* Asset Tracker Body */}
            <div className="space-y-4">
              {assets.map((asset) => {
                const isPositive = asset.change >= 0;
                const strokeColor = isPositive ? "#14b8a6" : "#f43f5e";
                const gradientId = `grad-${asset.symbol.replace("/", "-")}`;

                return (
                  <div 
                    key={asset.symbol} 
                    className="flex items-center justify-between p-3.5 bg-zinc-950/45 border border-zinc-900/80 hover:border-zinc-800/60 rounded-xl transition-all duration-200"
                  >
                    {/* Asset Name & Icon */}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isPositive ? 'bg-teal-500/10 text-teal-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {asset.symbol.split('/')[0].substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white leading-none">{asset.symbol}</div>
                        <span className="text-[10px] text-zinc-500">{asset.name}</span>
                      </div>
                    </div>

                    {/* Highly Visible Static Sparkline Chart */}
                    <div className="w-[110px] h-[30px] mx-2 relative">
                      <svg className="w-full h-full" viewBox="0 0 110 30" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Sparkline Area path */}
                        <path
                          d={asset.areaPath}
                          fill={`url(#${gradientId})`}
                        />
                        
                        {/* Sparkline Line path */}
                        <path
                          d={asset.linePath}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* Last Data Node Accent */}
                        <circle cx="110" cy={asset.linePath.split(" ").slice(-1)[0]} r="2" fill={strokeColor} />
                      </svg>
                    </div>

                    {/* Price and Percentage Change */}
                    <div className="text-right min-w-[70px]">
                      <div className="font-bold text-sm text-white">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className={`text-[10px] font-bold ${isPositive ? 'text-teal-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{asset.change}%
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 border-t border-zinc-900/60 bg-zinc-950/20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] text-zinc-600">
          <span>© {new Date().getFullYear()} Virtual Trade. Educational purposes only.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
