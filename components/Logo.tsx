
import React from 'react';
import { store } from '../services/store';

export const Logo = ({ className = "", size = "normal" }: { className?: string, size?: "small" | "normal" | "large" }) => {
  // Map abstract sizes to Tailwind height classes for the image
  const imgHeight = size === "small" ? "h-8" : size === "large" ? "h-20" : "h-12";
  const { settings } = store;

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Dynamic Logo from settings - updated to new URL provided by user */}
      <img 
        src={settings.companyLogo || "https://files.catbox.moe/oq7gs8.jpg"} 
        alt={settings.companyName || "UdyanIT.com"} 
        className={`${imgHeight} object-contain mix-blend-multiply`}
      />
    </div>
  );
};
