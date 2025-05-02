import { useRef, useEffect } from 'react';

export default function MandelbrotCanvas({ width, height, maxIter, zoom, offsetX, offsetY, setZoom, setOffsetX, setOffsetY }) {
  const canvasRef = useRef();

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
        while (zx * zx + zy * zy < 4 && i < maxIter) {
          let tmp = zx * zx - zy * zy + cx;
          zy = 2 * zx * zy + cy;
          zx = tmp;
          i++;
        }
        const pixelIndex = (y * width + x) * 4;
        const color = i === maxIter ? 0 : 255 - (i * 255 / maxIter);
        data[pixelIndex] = color;
        data[pixelIndex + 1] = color;
        data[pixelIndex + 2] = color;
        data[pixelIndex + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [width, height, maxIter, zoom, offsetX, offsetY]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = ((x - width / 2) / (width / 4)) / zoom + offsetX;
    const cy = ((y - height / 2) / (height / 4)) / zoom + offsetY;

    setOffsetX(cx);
    setOffsetY(cy);
    setZoom(zoom * 2); // Zoom in by a factor of 2
  };

  return <canvas ref={canvasRef} width={width} height={height} className="border rounded" onClick={handleClick} />;
}
