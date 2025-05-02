import MandelbrotCanvas from './components/MandelbrotCanvas';
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

function App() {
  const [maxIter, setMaxIter] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
          setZoom((prev) => prev * 1.2);
          break;
        case 's':
          setZoom((prev) => prev / 1.2);
          break;
        case 'i':
          setOffsetY((prev) => prev - 0.1 / zoom);
          break;
        case 'k':
          setOffsetY((prev) => prev + 0.1 / zoom);
          break;
        case 'j':
          setOffsetX((prev) => prev - 0.1 / zoom);
          break;
        case 'l':
          setOffsetX((prev) => prev + 0.1 / zoom);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Mandelbrot Fractal</h1>

      <MandelbrotCanvas
        width={800}
        height={600}
        maxIter={maxIter}
        zoom={zoom}
        offsetX={offsetX}
        offsetY={offsetY}
        setZoom={setZoom}
        setOffsetX={setOffsetX}
        setOffsetY={setOffsetY}
      />

      <div className="w-full max-w-xl space-y-4">
        <div>
          <p>Iterations: {maxIter}</p>
          <Slider defaultValue={[maxIter]} max={1000} step={10} onValueChange={([v]) => setMaxIter(v)} />
        </div>
        <div>
          <p>Zoom: {zoom.toFixed(2)}</p>
          <Slider defaultValue={[zoom]} min={0.5} max={10} step={0.1} onValueChange={([v]) => setZoom(v)} />
        </div>
        <div>
          <p>Offset X: {offsetX.toFixed(2)}</p>
          <Slider defaultValue={[offsetX]} min={-2} max={2} step={0.05} onValueChange={([v]) => setOffsetX(v)} />
        </div>
        <div>
          <p>Offset Y: {offsetY.toFixed(2)}</p>
          <Slider defaultValue={[offsetY]} min={-2} max={2} step={0.05} onValueChange={([v]) => setOffsetY(v)} />
        </div>
      </div>
    </div>
  );
}

export default App;
