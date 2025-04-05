import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft } from 'lucide-react';

const WsiViewer = () => {
  const [imageData, setImageData] = useState({
    id: 19,
    patient_id: "7",
    sample_type: "blood",
    date: "2024-12-09",
    detection_results: []
  });
  
  const [bloodCounts, setBloodCounts] = useState({
    rbc: {
      'Angled Cells': { count: 222, percentage: '67%', image: 'normal-peripheral-blood.jpg' },
      'Borderline Ovalocytes': { count: 50, percentage: '20%', image: 'autoimmune-hemolytic-anemia.jpg' },
      'Burr Cells': { count: 87, percentage: '34%', image: 'sickle-cell-anemia.jpg' },
      'Fragmented Cells': { count: 2, percentage: '0.12%', image: 'myelodysplastic-syndrome.jpg' },
      'Ovalocytes': { count: 0, percentage: '0%', image: 'malaria.jpg' },
      'Rounded RBC': { count: 0, percentage: '0%', image: 'essential-thrombocythemia.jpg' },
      'Teardrops': { count: 0, percentage: '0%', image: 'chronic-myeloid-leukemia.jpg' }
    },
    wbc: {
      'Basophil': { count: 222, percentage: '67%', image: 'plasma-cell-leukemia.jpg' },
      'Eosinophil': { count: 50, percentage: '20%', image: 'marginal-zone-lymphoma.jpg' },
      'Lymphocyte': { count: 87, percentage: '34%', image: 'chronic-lymphocytic-leukemia.jpg' },
      'Monocyte': { count: 2, percentage: '0.12%', image: 'acute-lymphoblastic-leukemia.jpg' }
    },
    platelets: {
      'Count': { count: 222 },
      'Percentage': { count: 222 }
    }
  });
  
  const [selectedCellType, setSelectedCellType] = useState('Angled Cells');
  const [cellCategory, setCellCategory] = useState('rbc');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hubViewPosition, setHubViewPosition] = useState({ x: 0, y: 0, width: 40, height: 20 });
  const [currentDate] = useState(new Date());
  
  const mainViewRef = useRef(null);
  const hubViewRef = useRef(null);
  
  // Format date as Mon Oct 07 2024 16:39:07
  const formattedDate = currentDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Get the current selected image and class
  const getBloodCellClass = () => {
    if (cellCategory === 'rbc') {
      if (selectedCellType === 'Angled Cells') return 'blood-normal';
      if (selectedCellType === 'Sickle Cells' || selectedCellType === 'Burr Cells') return 'blood-sickle-cell';
      if (selectedCellType === 'Ovalocytes' || selectedCellType === 'Teardrops') return 'blood-anemia';
      if (selectedCellType === 'Fragmented Cells') return 'blood-leukemia';
      if (selectedCellType === 'Ovalocytes') return 'blood-malaria';
    } else if (cellCategory === 'wbc') {
      if (selectedCellType.includes('leukemia')) return 'blood-leukemia';
      return 'blood-normal';
    }
    return 'blood-normal';
  };

  // Get the current selected image
  const getCurrentImage = () => {
    if (cellCategory === 'rbc' && bloodCounts.rbc[selectedCellType]) {
      return bloodCounts.rbc[selectedCellType].image;
    } else if (cellCategory === 'wbc' && bloodCounts.wbc[selectedCellType]) {
      return bloodCounts.wbc[selectedCellType].image;
    }
    return 'normal-peripheral-blood.jpg'; // default image
  };

  // Parse detection results on load
  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          // In a real app, this would be an API call
          // For this demo, we're manually creating the detection results
          // to avoid JSON parsing issues with the sample data
          
          const detectionResults = [
            [121, 4, 163, 45, 'Circular_RBC'],
            [396, 312, 433, 353, 'Circular_RBC'],
            [388, 90, 428, 130, 'Circular_RBC'],
            [334, 157, 373, 199, 'Circular_RBC'],
            [27, 148, 64, 190, 'Circular_RBC'],
            [89, 339, 131, 380, 'Circular_RBC'],
            [346, 222, 381, 265, 'Circular_RBC'],
            [455, 24, 491, 66, 'Circular_RBC'],
            [250, 374, 287, 412, 'Circular_RBC'],
            [30, 350, 67, 392, 'Circular_RBC'],
            [256, 285, 293, 324, 'Circular_RBC'],
            [118, 316, 158, 354, 'Circular_RBC'],
            [155, 311, 189, 350, 'Circular_RBC'],
            [0, 270, 37, 307, 'Circular_RBC'],
            [248, 409, 285, 448, 'Circular_RBC'],
            [77, 271, 113, 307, 'Circular_RBC'],
            [222, 437, 262, 475, 'Circular_RBC'],
            [126, 41, 163, 79, 'Circular_RBC'],
            [250, 152, 288, 189, 'Circular_RBC'],
            [177, 75, 214, 114, 'Circular_RBC'],
            [157, 446, 196, 484, 'Circular_RBC'],
            [12, 310, 56, 346, 'Circular_RBC'],
            [404, 195, 441, 237, 'Circular_RBC'],
            [464, 135, 499, 171, 'Circular_RBC'],
            [314, 355, 352, 396, 'Circular_RBC'],
            [211, 401, 247, 440, 'Circular_RBC'],
            [55, 190, 94, 229, 'Circular_RBC'],
            [110, 87, 148, 121, 'Circular_RBC'],
            [456, 364, 496, 400, 'Circular_RBC'],
            [466, 296, 505, 342, 'Circular_RBC'],
            [205, 195, 249, 234, 'Circular_RBC'],
            [287, 8, 324, 48, 'Circular_RBC'],
            [315, 128, 344, 170, 'Circular_RBC'],
            [372, 206, 410, 245, 'Circular_RBC'],
            [414, 41, 451, 76, 'Circular_RBC'],
            [103, 118, 142, 156, 'Circular_RBC'],
            [59, 447, 95, 487, 'Circular_RBC'],
            [241, 98, 275, 140, 'Circular_RBC'],
            [419, 256, 455, 296, 'Circular_RBC'],
            [122, 435, 160, 473, 'Circular_RBC']
          ];
          
          // Transform the detection results into a more usable format
          const formattedResults = detectionResults.map((item) => ({
            x: item[0],
            y: item[1],
            width: item[2] - item[0],
            height: item[3] - item[1],
            label: item[4]
          }));
          
          // Additional detection results for the rest of the visible area
          const additionalResults = Array(100).fill(0).map((_, i) => {
            const x = Math.floor(Math.random() * 900) + 50;
            const y = Math.floor(Math.random() * 400) + 50;
            const width = Math.floor(Math.random() * 20) + 30;
            const height = Math.floor(Math.random() * 20) + 30;
            
            return {
              x,
              y,
              width,
              height,
              label: 'Circular_RBC'
            };
          });
          
          setImageData(prev => ({
            ...prev,
            id: 19,
            patient_id: "7",
            sample_type: "blood",
            date: "2024-12-09",
            filename: "7_20241209_024613.png",
            detection_results: [...formattedResults, ...additionalResults]
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
      fetchData();
    } catch (error) {
      console.error("Error parsing detection results:", error);
    }
  }, []);

  // Update hub view when position or zoom changes
  useEffect(() => {
    updateHubViewPosition();
  }, [position, zoomLevel]);

  // Handle cell type selection
  const handleCellTypeSelect = (category, cellType) => {
    setSelectedCellType(cellType);
    setCellCategory(category);
    
    // Reset zoom and position when changing cell types
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle mouse events for panning
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setPosition({
        x: newX,
        y: newY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse wheel for zooming
  const handleWheel = (e) => {
    e.preventDefault();
    
    // Get mouse position relative to the viewport
    const rect = mainViewRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Current position in the zoomed space
    const zoomedX = (mouseX - position.x) / zoomLevel;
    const zoomedY = (mouseY - position.y) / zoomLevel;
    
    // Calculate new zoom level
    const newZoomLevel = e.deltaY < 0 
      ? Math.min(zoomLevel * 1.1, 5) // Zoom in (limit to 5x)
      : Math.max(zoomLevel / 1.1, 0.5); // Zoom out (limit to 0.5x)
    
    // Calculate new position to keep mouse point fixed
    const newPosX = mouseX - zoomedX * newZoomLevel;
    const newPosY = mouseY - zoomedY * newZoomLevel;
    
    // Update state
    setZoomLevel(newZoomLevel);
    setPosition({
      x: newPosX,
      y: newPosY
    });
  };

  // Update hub view indicator position
  const updateHubViewPosition = () => {
    if (hubViewRef.current && mainViewRef.current) {
      const mainWidth = mainViewRef.current.offsetWidth;
      const mainHeight = mainViewRef.current.offsetHeight;
      const hubWidth = hubViewRef.current.offsetWidth;
      const hubHeight = hubViewRef.current.offsetHeight;
      
      // Calculate the position of the viewport in the hub view
      const viewportX = (-position.x / zoomLevel) * (hubWidth / 1024);
      const viewportY = (-position.y / zoomLevel) * (hubHeight / 512);
      const viewportWidth = (mainWidth / zoomLevel) * (hubWidth / 1024);
      const viewportHeight = (mainHeight / zoomLevel) * (hubHeight / 512);
      
      setHubViewPosition({
        x: Math.max(0, Math.min(viewportX, hubWidth - 10)),
        y: Math.max(0, Math.min(viewportY, hubHeight - 10)),
        width: Math.min(viewportWidth, hubWidth),
        height: Math.min(viewportHeight, hubHeight)
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header with date */}
      <header className="bg-white shadow-sm p-3 text-center">
        <h2 className="text-md font-medium text-gray-700">{formattedDate}</h2>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Cell Counts */}
        <div className="w-1/4 bg-white shadow-md p-3 overflow-y-auto">
          <div className="flex items-center mb-3">
            <button className="p-1 mr-2 rounded border border-gray-300 hover:bg-gray-100">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">RBC</h2>
          </div>
          
          {/* RBC Table */}
          <div className="mb-5">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 rbc-table-header"></th>
                  <th className="text-center p-2 rbc-table-header">Count</th>
                  <th className="text-center p-2 rbc-table-header">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bloodCounts.rbc).map(([name, data]) => (
                  <tr 
                    key={name} 
                    className={`rbc-table-row ${cellCategory === 'rbc' && selectedCellType === name ? 'bg-blue-100' : ''} cursor-pointer hover:bg-gray-100`}
                    onClick={() => handleCellTypeSelect('rbc', name)}
                  >
                    <td className="p-2">{name}</td>
                    <td className="p-2 text-center">{data.count}</td>
                    <td className="p-2 text-center">{data.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* WBC Table */}
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">WBC</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 wbc-table-header"></th>
                  <th className="text-center p-2 wbc-table-header">Count</th>
                  <th className="text-center p-2 wbc-table-header">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bloodCounts.wbc).map(([name, data]) => (
                  <tr 
                    key={name} 
                    className={`rbc-table-row ${cellCategory === 'wbc' && selectedCellType === name ? 'bg-blue-100' : ''} cursor-pointer hover:bg-gray-100`}
                    onClick={() => handleCellTypeSelect('wbc', name)}
                  >
                    <td className="p-2">{name}</td>
                    <td className="p-2 text-center">{data.count}</td>
                    <td className="p-2 text-center">{data.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Platelets Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Platelets</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 platelets-table-header"></th>
                  <th className="text-center p-2 platelets-table-header"></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bloodCounts.platelets).map(([name, data]) => (
                  <tr key={name} className="rbc-table-row">
                    <td className="p-2">{name}</td>
                    <td className="p-2 text-center">{data.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Main View and Controls */}
        <div className="flex-1 flex flex-col">
          {/* WSI Zoomed IN View */}
          <div 
            ref={mainViewRef}
            className="flex-1 relative overflow-hidden bg-gray-200 cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div 
              className="absolute"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                transformOrigin: '0 0',
              }}
            >
              <div className="relative">
                {/* Blood cell background with dynamic image */}
                <div 
                  className={`blood-cell-bg ${getBloodCellClass()}`} 
                  style={{ 
                    width: '1024px', 
                    height: '512px',
                    backgroundImage: `url("/images/blood-samples/${getCurrentImage()}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Render all detection boxes */}
                  {imageData.detection_results.map((detection, index) => (
                    <div
                      key={index}
                      className="absolute rbc-cell"
                      style={{
                        left: `${detection.x}px`,
                        top: `${detection.y}px`,
                        width: `${detection.width}px`,
                        height: `${detection.height}px`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Mouse wheel zoom instruction */}
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-75 px-3 py-1 rounded-md shadow-sm text-sm">
              <span>Use mouse wheel to zoom in/out</span>
            </div>
            
            {/* WSI Zoomed IN View header */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 px-4 py-2 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                WSI Zoomed IN View
              </h3>
            </div>
            
            {/* Selected cell type indicator */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-75 px-3 py-1 rounded-md shadow-sm">
              <span className="font-semibold">{cellCategory.toUpperCase()}: </span>
              <span>{selectedCellType}</span>
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="p-2 bg-white shadow-md flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setZoomLevel(Math.max(zoomLevel / 1.2, 0.5))}
                className="p-2 rounded hover:bg-gray-100"
              >
                <ZoomOut size={20} />
              </button>
              <span className="text-sm text-gray-700">{Math.round(zoomLevel * 100)}%</span>
              <button 
                onClick={() => setZoomLevel(Math.min(zoomLevel * 1.2, 5))}
                className="p-2 rounded hover:bg-gray-100"
              >
                <ZoomIn size={20} />
              </button>
            </div>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
            >
              Report
            </button>
          </div>
        </div>
        
        {/* Right Sidebar - Hub View */}
        <div className="w-1/4 bg-white shadow-md p-4 flex flex-col">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">WSI</h2>
            <h3 className="text-lg font-medium text-gray-600">Zoomed out View</h3>
            <h3 className="text-lg font-medium text-gray-600">(Hub)</h3>
          </div>
          
          {/* Hub view (minimap) */}
          <div className="relative mb-4 border border-gray-300" ref={hubViewRef} style={{ height: '140px' }}>
            <div 
              className={`${getBloodCellClass()} w-full h-full relative`}
              style={{ 
                backgroundImage: `url("/images/blood-samples/${getCurrentImage()}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Visual indicator of current view */}
              <div 
                className="absolute hub-indicator"
                style={{
                  left: `${hubViewPosition.x}px`,
                  top: `${hubViewPosition.y}px`,
                  width: `${hubViewPosition.width}px`,
                  height: `${hubViewPosition.height}px`,
                  minWidth: '10px',
                  minHeight: '10px',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              ></div>
            </div>
          </div>
          
          {/* Patient info */}
          <div className="border border-gray-300 p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-700 font-medium">Patient ID</div>
              <div>{imageData.patient_id}</div>
              
              <div className="text-gray-700 font-medium">Blood</div>
              <div>{imageData.sample_type}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WsiViewer;