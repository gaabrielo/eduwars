import React from 'react';

interface NineSliceBoxProps {
  children?: React.ReactNode;
  className?: string;
  spriteDir?: string;
  scale?: number;
  width?: string | number;
  height?: string | number;
  fillPercentage?: number;
  fillSprite?: string;
  fillInsetX?: number;
  fillInsetY?: number;
}

export function NineSliceBox({ 
  children, 
  className = '', 
  spriteDir = '/hud-sprites/container',
  scale = 2,
  width,
  height,
  fillPercentage,
  fillSprite,
  fillInsetX,
  fillInsetY
}: NineSliceBoxProps) {
  const size = 16 * scale;
  const paddingX = 8 * scale;
  const paddingY = 6 * scale; 

  const offsetX = `min(${size}px, 50%)`;
  const offsetY = `min(${size}px, 50%)`;
  
  const innerInsetX = fillInsetX !== undefined ? fillInsetX : paddingX;
  const innerInsetY = fillInsetY !== undefined ? fillInsetY : paddingY;

  return (
    <div className={`relative pixelated ${className}`} style={{ minWidth: width ? 0 : size * 2, minHeight: height ? 0 : size * 2, width, height }}>
      {/* Corners */}
      <div className="absolute top-0 left-0 pixelated" style={{ width: size, height: size, maxWidth: '50%', maxHeight: '50%', backgroundImage: `url(${spriteDir}/top-left.png)`, backgroundSize: `${size}px ${size}px`, backgroundPosition: 'top left' }} />
      <div className="absolute top-0 right-0 pixelated" style={{ width: size, height: size, maxWidth: '50%', maxHeight: '50%', backgroundImage: `url(${spriteDir}/top-right.png)`, backgroundSize: `${size}px ${size}px`, backgroundPosition: 'top right' }} />
      <div className="absolute bottom-0 left-0 pixelated" style={{ width: size, height: size, maxWidth: '50%', maxHeight: '50%', backgroundImage: `url(${spriteDir}/bottom-left.png)`, backgroundSize: `${size}px ${size}px`, backgroundPosition: 'bottom left' }} />
      <div className="absolute bottom-0 right-0 pixelated" style={{ width: size, height: size, maxWidth: '50%', maxHeight: '50%', backgroundImage: `url(${spriteDir}/bottom-right.png)`, backgroundSize: `${size}px ${size}px`, backgroundPosition: 'bottom right' }} />

      {/* Edges */}
      <div className="absolute top-0" style={{ left: offsetX, right: offsetX, height: size, maxHeight: '50%', backgroundImage: `url(${spriteDir}/top.png)`, backgroundRepeat: 'repeat-x', backgroundSize: `${size}px ${size}px`, backgroundPosition: 'top left' }} />
      <div className="absolute bottom-0" style={{ left: offsetX, right: offsetX, height: size, maxHeight: '50%', backgroundImage: `url(${spriteDir}/bottom.png)`, backgroundRepeat: 'repeat-x', backgroundSize: `${size}px ${size}px`, backgroundPosition: 'bottom left' }} />
      <div className="absolute left-0" style={{ top: offsetY, bottom: offsetY, width: size, maxWidth: '50%', backgroundImage: `url(${spriteDir}/left.png)`, backgroundRepeat: 'repeat-y', backgroundSize: `${size}px ${size}px`, backgroundPosition: 'top left' }} />
      <div className="absolute right-0" style={{ top: offsetY, bottom: offsetY, width: size, maxWidth: '50%', backgroundImage: `url(${spriteDir}/right.png)`, backgroundRepeat: 'repeat-y', backgroundSize: `${size}px ${size}px`, backgroundPosition: 'top right' }} />
      
      {/* Center */}
      <div className="absolute" style={{ top: innerInsetY, bottom: innerInsetY, left: innerInsetX, right: innerInsetX, backgroundImage: `url(${spriteDir}/center.png)`, backgroundRepeat: 'repeat', backgroundSize: `${size}px ${size}px`, zIndex: 1 }} />

      {/* Dynamic Fill Center */}
      {fillPercentage !== undefined && fillSprite && (
        <div 
          className="absolute" 
          style={{ 
            top: innerInsetY, bottom: innerInsetY, left: innerInsetX, 
            width: `calc((100% - (${innerInsetX * 2}px)) * ${fillPercentage / 100})`, 
            backgroundImage: `url(${fillSprite})`, 
            backgroundRepeat: 'repeat', 
            backgroundSize: `${size}px ${size}px`,
            transition: 'width 0.3s ease-out',
            zIndex: 2
          }} 
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center" style={{ padding: `${paddingY}px ${paddingX}px` }}>
        {children}
      </div>
    </div>
  );
}
