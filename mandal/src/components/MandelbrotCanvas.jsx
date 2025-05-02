import { useRef, useEffect, useState } from 'react';

export default function MandelbrotCanvas({ 
  width, 
  height, 
  maxIter, 
  zoom, 
  offsetX, 
  offsetY, 
  colorPalette,
  setZoom, 
  setOffsetX, 
  setOffsetY 
}) {
  const canvasRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, cx: 0, cy: 0 });

  // Render the Mandelbrot set
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let zx = 0, zy = 0;
        const cx = ((x - width / 2) / (width / 4)) / zoom + offsetX;
        const cy = ((y - height / 2) / (height / 4)) / zoom + offsetY;
        let i = 0;

        // Main Mandelbrot calculation
        while (zx * zx + zy * zy < 4 && i < maxIter) {
          let tmp = zx * zx - zy * zy + cx;
          zy = 2 * zx * zy + cy;
          zx = tmp;
          i++;
        }

        const pixelIndex = (y * width + x) * 4;
        
        // Apply different color palettes
        if (i === maxIter) {
          // Interior (black for all palettes)
          data[pixelIndex] = 0;
          data[pixelIndex + 1] = 0;
          data[pixelIndex + 2] = 0;
        } else {
          // Apply the selected color palette
          const normalizedI = i / maxIter;
          
          switch (colorPalette) {
            case 'grayscale':
              const grayscale = 255 - Math.floor(normalizedI * 255);
              data[pixelIndex] = grayscale;
              data[pixelIndex + 1] = grayscale;
              data[pixelIndex + 2] = grayscale;
              break;
            case 'rainbow':
              // Rainbow palette (spectrum cycling)
              const hue = (normalizedI * 360) % 360;
              const [r, g, b] = hslToRgb(hue / 360, 0.8, 0.5);
              data[pixelIndex] = r;
              data[pixelIndex + 1] = g;
              data[pixelIndex + 2] = b;
              break;
            case 'fire':
              // Fire palette (red to yellow)
              data[pixelIndex] = Math.min(255, Math.floor(normalizedI * 510));
              data[pixelIndex + 1] = Math.floor(normalizedI * normalizedI * 255);
              data[pixelIndex + 2] = 0;
              break;
            case 'ocean':
              // Ocean palette (deep blue to cyan)
              data[pixelIndex] = 0;
              data[pixelIndex + 1] = Math.floor(normalizedI * 255);
              data[pixelIndex + 2] = 255 - Math.floor(normalizedI * 128);
              break;
            default:
              // Default grayscale
              const defaultColor = 255 - Math.floor(normalizedI * 255);
              data[pixelIndex] = defaultColor;
              data[pixelIndex + 1] = defaultColor;
              data[pixelIndex + 2] = defaultColor;
          }
        }
        
        // Alpha channel always fully opaque
        data[pixelIndex + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [width, height, maxIter, zoom, offsetX, offsetY, colorPalette]);

  // Mouse handlers for drag navigation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate complex coordinates
    const cx = ((x - width / 2) / (width / 4)) / zoom + offsetX;
    const cy = ((y - height / 2) / (height / 4)) / zoom + offsetY;
    
    setMousePos({ x, y, cx, cy });
    
    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / (width / 4) / zoom;
      const dy = (e.clientY - dragStart.y) / (height / 4) / zoom;
      
      setOffsetX(offsetX - dx);
      setOffsetY(offsetY - dy);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Mouse wheel for zooming
  const handleWheel = (e) => {
    e.preventDefault();
    
    // Get mouse position
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate the position in the complex plane before zooming
    const cx = ((x - width / 2) / (width / 4)) / zoom + offsetX;
    const cy = ((y - height / 2) / (height / 4)) / zoom + offsetY;
    
    // Calculate new zoom level
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = zoom * zoomFactor;
    
    // Update the offset to keep the point under the mouse fixed
    const newOffsetX = cx - ((x - width / 2) / (width / 4)) / newZoom;
    const newOffsetY = cy - ((y - height / 2) / (height / 4)) / newZoom;
    
    setZoom(newZoom);
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  };

  // Double click to zoom in
  const handleDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate complex coordinates to center on
    const cx = ((x - width / 2) / (width / 4)) / zoom + offsetX;
    const cy = ((y - height / 2) / (height / 4)) / zoom + offsetY;
    
    // Zoom in by a factor of 2 centered on the clicked point
    const newZoom = zoom * 2;
    const newOffsetX = cx - ((x - width / 2) / (width / 4)) / newZoom;
    const newOffsetY = cy - ((y - height / 2) / (height / 4)) / newZoom;
    
    setZoom(newZoom);
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  };

  // HSL to RGB conversion utility
  function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="border border-gray-600 rounded cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm p-1 rounded">
        Position: {mousePos.cx.toFixed(6)}, {mousePos.cy.toFixed(6)}
      </div>
    </div>
  );
}