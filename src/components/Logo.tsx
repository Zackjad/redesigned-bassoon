import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl font-black'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon with Custom Dynamic Vector Monogram */}
      <div className={`${iconDimensions} rounded-xl bg-gradient-to-tr from-sky-600 via-sky-400 to-indigo-500 p-[1.5px] shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/40 group-hover:scale-105 transition-all duration-300 relative shrink-0`}>
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle geometric backlight glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-transparent to-indigo-600/30 opacity-70 group-hover:opacity-100 transition-opacity"></div>
          
          <svg 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-[72%] h-[72%] text-white relative z-10 drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]"
          >
            {/* Top Bar of Z with angled futuristic facet */}
            <path 
              d="M7 8.5C7 7.67 7.67 7 8.5 7H24C24.83 7 25.32 7.92 24.88 8.62L13.8 22H23.5C24.33 22 25 22.67 25 23.5C25 24.33 24.33 25 23.5 25H8C7.17 25 6.68 24.08 7.12 23.38L18.2 10H8.5C7.67 10 7 9.33 7 8.5Z" 
              fill="url(#zackjad_gradient)" 
            />
            {/* Prism accent overlay */}
            <path 
              d="M12.5 10L7.12 23.38C6.68 24.08 7.17 25 8 25H12L20.5 10H12.5Z" 
              fill="url(#accent_gradient)" 
              opacity="0.45"
            />
            {/* Precision Star / Aperture sparkle */}
            <circle cx="21" cy="9.5" r="1.5" fill="#38BDF8" className="animate-pulse" />
            <circle cx="10" cy="22.5" r="1.2" fill="#818CF8" />

            <defs>
              <linearGradient id="zackjad_gradient" x1="7" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="0.5" stopColor="#0284C7" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="accent_gradient" x1="7" y1="10" x2="20" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent ${textSizes}`}>
              Zackjad
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse mt-0.5"></span>
          </div>
          <span className="text-[9px] font-semibold tracking-wider uppercase text-sky-400/80 -mt-0.5">
            Visual Studio
          </span>
        </div>
      )}
    </div>
  );
};
