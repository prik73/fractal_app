import MandelbrotCanvas from './components/MandelbrotCanvas';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Save, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

function App() {
  // State management
  const [maxIter, setMaxIter] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [colorPalette, setColorPalette] = useState('grayscale');
  const [savedLocations, setSavedLocations] = useState([
    { name: "Classic View", zoom: 1, offsetX: 0, offsetY: 0 },
    { name: "Mini Mandelbrot", zoom: 60, offsetX: -1.77, offsetY: 0 },
    { name: "Spiral Pattern", zoom: 13, offsetX: -0.761574, offsetY: -0.0847596 },
  ]);
  
  // Keyboard navigation
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
        case 'r':
          // Reset to default view
          resetView();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom]);
  
  // Reset view to initial state
  const resetView = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setMaxIter(100);
  };
  
  // Save current location
  const saveCurrentLocation = () => {
    const locationName = prompt("Enter a name for this location:");
    if (locationName) {
      setSavedLocations([
        ...savedLocations,
        {
          name: locationName,
          zoom,
          offsetX,
          offsetY
        }
      ]);
    }
  };
  
  // Go to saved location
  const goToLocation = (location) => {
    setZoom(location.zoom);
    setOffsetX(location.offsetX);
    setOffsetY(location.offsetY);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Mandelbrot Explorer</h1>
      
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Main canvas */}
        <div className="flex-1">
          <MandelbrotCanvas
            width={800}
            height={600}
            maxIter={maxIter}
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
            colorPalette={colorPalette}
            setZoom={setZoom}
            setOffsetX={setOffsetX}
            setOffsetY={setOffsetY}
          />
        </div>
        
        {/* Controls panel */}
        <div className="w-full md:w-64 space-y-6 flex-shrink-0">
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Controls</h2>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={18} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      <strong>Mouse:</strong> Wheel to zoom, drag to pan, double-click to zoom in<br/>
                      <strong>Keyboard:</strong> W/S to zoom, I/J/K/L to navigate, R to reset
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Iterations control */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label>Iterations:</label>
                  <span>{maxIter}</span>
                </div>
                <Slider 
                  defaultValue={[maxIter]} 
                  value={[maxIter]}
                  min={10} 
                  max={1000} 
                  step={10} 
                  onValueChange={([v]) => setMaxIter(v)} 
                />
              </div>
              
              {/* Zoom control */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label>Zoom:</label>
                  <span>{zoom.toFixed(2)}x</span>
                </div>
                <Slider 
                  defaultValue={[zoom]} 
                  value={[zoom]}
                  min={0.5} 
                  max={100} 
                  step={0.5} 
                  onValueChange={([v]) => setZoom(v)} 
                />
              </div>
              
              {/* X Offset control */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label>X Offset:</label>
                  <span>{offsetX.toFixed(4)}</span>
                </div>
                <Slider 
                  defaultValue={[offsetX]} 
                  value={[offsetX]}
                  min={-2} 
                  max={2} 
                  step={0.01} 
                  onValueChange={([v]) => setOffsetX(v)} 
                />
              </div>
              
              {/* Y Offset control */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label>Y Offset:</label>
                  <span>{offsetY.toFixed(4)}</span>
                </div>
                <Slider 
                  defaultValue={[offsetY]} 
                  value={[offsetY]}
                  min={-2} 
                  max={2} 
                  step={0.01} 
                  onValueChange={([v]) => setOffsetY(v)} 
                />
              </div>
              
              {/* Color palette selector */}
              <div className="space-y-2">
                <label className="block">Color Palette:</label>
                <Select 
                  value={colorPalette} 
                  onValueChange={setColorPalette}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select palette" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                    <SelectItem value="rainbow">Rainbow</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={resetView}
                >
                  Reset View
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={saveCurrentLocation}
                >
                  <Save size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Saved locations panel */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Saved Locations</h2>
            <div className="space-y-2">
              {savedLocations.map((location, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  className="w-full justify-start text-left"
                  onClick={() => goToLocation(location)}
                >
                  <Bookmark size={16} className="mr-2" />
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Pro tip: Use mouse wheel to zoom, drag to pan, and double-click to zoom in on a specific point.</p>
      </div>
    </div>
  );
}

export default App;