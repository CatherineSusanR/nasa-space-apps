import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, Waves, Fish, AlertTriangle, Info, Droplets, Wind, Activity, Satellite, MapPin, Radio } from 'lucide-react';
import "./App.css";
import artic_chl_data from "./data/artic_chl_data.json";
import atlantic_chl_data from "./data/atlantic_chl_data.json";
import pacific_chl_data from "./data/pacific_chl_data.json";
import southern_chl_data from "./data/southern_chl_data.json";
import indian_chl_data from "./data/indian_chl_data.json";

const NASAOceanVR = () => {
  const [selectedOcean, setSelectedOcean] = useState(null);
  const [depth, setDepth] = useState(0);
  const [year, setYear] = useState(1997);
  const [isDiving, setIsDiving] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSatelliteView, setShowSatelliteView] = useState(true);
  const [satelliteData, setSatelliteData] = useState({
    temperature: 15,
    salinity: 35,
    chlorophyll: 0.5,
    iceExtent: 0
  });
 
  const canvasRef = useRef(null);
  const satelliteCanvasRef = useRef(null);
  const animationRef = useRef(null);

  const oceans = [
    {
      id: 'pacific',
      name: 'Pacific Ocean',
      description: 'Largest and deepest ocean basin',
      baseTemp: 15.5,
      baseSalinity: 34.5,
      maxDepth: 10994,
      coordinates: { lat: 0, lon: -160 },
      displayCoords: { lat: '0°N', lon: '160°W' },
      warmingRate: 0.021,
      satellite: 'MODIS Aqua',
      gibsLayer: 'MODIS_Aqua_Sea_Surface_Temp',
      nasaProduct: 'MYD28',
      characteristics: [
        'Covers approximately 46% of Earth\'s water surface',
        'Contains the Mariana Trench (deepest point)',
        'Major El Niño/La Niña influence zone',
        'Critical for global climate regulation',
        'Ring of Fire volcanic activity'
      ],
      threats: [
        'Ocean acidification from CO2 absorption',
        'Coral bleaching in tropical regions',
        'Disrupted El Niño patterns'
      ]
    },
    {
      id: 'atlantic',
      name: 'Atlantic Ocean',
      description: 'Second largest, drives major ocean currents',
      baseTemp: 16.2,
      baseSalinity: 35.5,
      maxDepth: 8486,
      coordinates: { lat: 30, lon: -40 },
      displayCoords: { lat: '30°N', lon: '40°W' },
      warmingRate: 0.024,
      satellite: 'MODIS Terra',
      gibsLayer: 'MODIS_Terra_Sea_Surface_Temp',
      nasaProduct: 'MOD28',
      characteristics: [
        'Home to Gulf Stream current system',
        'Higher salinity than Pacific',
        'Major hurricane formation zone',
        'Atlantic Meridional Overturning Circulation (AMOC)',
        'Sargasso Sea unique ecosystem'
      ],
      threats: [
        'AMOC slowdown affecting climate',
        'Increased hurricane intensity',
        'Gulf Stream shift northward'
      ]
    },
    {
      id: 'indian',
      name: 'Indian Ocean',
      description: 'Warmest ocean, monsoon driver',
      baseTemp: 17.8,
      baseSalinity: 34.8,
      maxDepth: 7258,
      coordinates: { lat: -20, lon: 80 },
      displayCoords: { lat: '20°S', lon: '80°E' },
      warmingRate: 0.026,
      satellite: 'MODIS Aqua',
      gibsLayer: 'MODIS_Aqua_Sea_Surface_Temp',
      nasaProduct: 'MYD28',
      characteristics: [
        'Warmest ocean waters globally',
        'Drives Indian and Asian monsoon patterns',
        'High biological productivity zones',
        'Critical for regional climate',
        'Indian Ocean Dipole phenomena'
      ],
      threats: [
        'Rapid warming affecting monsoons',
        'Marine heatwaves increasing',
        'Coral reef degradation'
      ]
    },
    {
      id: 'southern',
      name: 'Southern Ocean',
      description: 'Circumpolar current, rapid change',
      baseTemp: 2.5,
      baseSalinity: 34.0,
      maxDepth: 7235,
      coordinates: { lat: -60, lon: 0 },
      displayCoords: { lat: '60°S', lon: '0°' },
      warmingRate: 0.029,
      satellite: 'SMAP/MODIS',
      gibsLayer: 'MODIS_Aqua_Sea_Surface_Temp',
      nasaProduct: 'Antarctic_Sea_Ice',
      characteristics: [
        'Circumpolar Antarctic Current (ACC)',
        'Major global carbon sink',
        'Rapid sea ice loss observed',
        'Critical for global ocean circulation',
        'Antarctic Bottom Water formation'
      ],
      threats: [
        'Accelerating ice shelf collapse',
        'Penguin population decline',
        'Krill population changes'
      ]
    },
    {
      id: 'arctic',
      name: 'Arctic Ocean',
      description: 'Smallest ocean, fastest warming',
      baseTemp: -1.5,
      baseSalinity: 32.0,
      maxDepth: 5550,
      coordinates: { lat: 90, lon: 0 },
      displayCoords: { lat: '90°N', lon: '0°' },
      warmingRate: 0.045,
      satellite: 'SMAP/MODIS Ice',
      gibsLayer: 'Arctic_Sea_Ice_Extent',
      nasaProduct: 'Arctic_Sea_Ice',
      characteristics: [
        'Smallest and shallowest ocean',
        'Warming 3x faster than global average',
        'Dramatic sea ice loss (summer ice-free by 2050)',
        'Permafrost methane release concern',
        'Polar bear habitat loss'
      ],
      threats: [
        'Ice-albedo feedback accelerating',
        'Methane release from permafrost',
        'Arctic amplification effect'
      ]
    }
  ];

  const maxDepth = selectedOcean?.maxDepth || 11000;
  const currentYear = 2025;

  // Calculate realistic satellite data
  useEffect(() => {
    if (!selectedOcean) return;

    const yearsSince1997 = year - 1997;
    const warming = yearsSince1997 * selectedOcean.warmingRate;
    const temperature = selectedOcean.baseTemp + warming;
   
    const salinityChange = warming * 0.015;
    const salinity = selectedOcean.baseSalinity + salinityChange;
   
    let chlorophyllData;
    switch(selectedOcean.id) {
      case 'pacific':
        chlorophyllData = pacific_chl_data.find(d => d.year === year) || pacific_chl_data[0];
        break;
      case 'atlantic':
        chlorophyllData = atlantic_chl_data.find(d => d.year === year) || atlantic_chl_data[0];
        break;
      case 'indian':
        chlorophyllData = indian_chl_data.find(d => d.year === year) || indian_chl_data[0];
        break;
      case 'southern':
        chlorophyllData = southern_chl_data.find(d => d.year === year) || southern_chl_data[0];
        break;
      case 'arctic':
        chlorophyllData = artic_chl_data.find(d => d.year === year) || artic_chl_data[0];
        break;
      default:
        chlorophyllData = { chl: 0.3 };
    }
    // const chlorophyll = Math.max(0.1, chlorophyllBase - (warming * 0.08));
   
    const chlorophyll = chlorophyllData.chl;
    console.log(chlorophyll);
    const iceExtent = selectedOcean.id === 'arctic' || selectedOcean.id === 'southern'
      ? Math.max(0, 100 - (yearsSince1997 * 0.8))
      : 0;

    setSatelliteData({
      temperature: parseFloat(temperature.toFixed(2)),
      salinity: parseFloat(salinity.toFixed(2)),
      chlorophyll: parseFloat(chlorophyll.toFixed(2)),
      iceExtent: parseFloat(iceExtent.toFixed(1))
    });
  }, [year, selectedOcean]);

  const getOceanHealth = () => {
    if (!selectedOcean) return { status: 'unknown', color: '#64748b', life: 0 };
   
    const tempAnomaly = satelliteData.temperature - selectedOcean.baseTemp;
    const chloroReduction = (0.5 - satelliteData.chlorophyll) / 0.5 * 100;
    const iceReduction = selectedOcean.id === 'arctic' || selectedOcean.id === 'southern'
      ? (100 - satelliteData.iceExtent) : 0;
   
    const healthScore = 100 - (tempAnomaly * 15) - (chloroReduction * 0.3) - (iceReduction * 0.2);
    const score = Math.max(0, Math.min(100, healthScore));
   
    if (score > 80) return { status: 'Healthy', color: '#10b981', life: score };
    if (score > 60) return { status: 'Stressed', color: '#f59e0b', life: score };
    if (score > 40) return { status: 'Degraded', color: '#ef4444', life: score };
    return { status: 'Critical', color: '#dc2626', life: score };
  };

  const health = getOceanHealth();

  // Satellite View Canvas - Real NASA-style visualization
  useEffect(() => {
    const canvas = satelliteCanvasRef.current;
    if (!canvas || !selectedOcean) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const drawSatelliteView = () => {
      // Background - space black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Earth curvature
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const earthRadius = Math.min(canvas.width, canvas.height) * 0.4;

      // Draw Earth base
      const earthGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, earthRadius);
      earthGradient.addColorStop(0, '#0a4d8f');
      earthGradient.addColorStop(1, '#001a33');
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Temperature heat map overlay
      const tempAnomaly = satelliteData.temperature - selectedOcean.baseTemp;
      const heatIntensity = Math.min(1, tempAnomaly / 3);

      // Create temperature visualization zones
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const distance = earthRadius * (0.3 + Math.random() * 0.6);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const size = 20 + Math.random() * 40;

        // Temperature color scale (blue to red)
        const tempGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        if (heatIntensity < 0.3) {
          tempGradient.addColorStop(0, `rgba(100, 150, 255, ${0.3 + heatIntensity})`);
          tempGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        } else if (heatIntensity < 0.6) {
          tempGradient.addColorStop(0, `rgba(255, 200, 100, ${0.4 + heatIntensity})`);
          tempGradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
        } else {
          tempGradient.addColorStop(0, `rgba(255, 50, 50, ${0.5 + heatIntensity})`);
          tempGradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
        }

        ctx.fillStyle = tempGradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ice coverage for polar oceans
      if (selectedOcean.id === 'arctic' || selectedOcean.id === 'southern') {
        const iceY = selectedOcean.id === 'arctic' ? centerY - earthRadius * 0.6 : centerY + earthRadius * 0.6;
        const iceSize = (satelliteData.iceExtent / 100) * earthRadius * 0.4;

        const iceGradient = ctx.createRadialGradient(centerX, iceY, 0, centerX, iceY, iceSize);
        iceGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        iceGradient.addColorStop(0.7, 'rgba(200, 230, 255, 0.6)');
        iceGradient.addColorStop(1, 'rgba(200, 230, 255, 0)');
       
        ctx.fillStyle = iceGradient;
        ctx.beginPath();
        ctx.arc(centerX, iceY, iceSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Chlorophyll concentration (green areas)
      const chlorophyllOpacity = satelliteData.chlorophyll / 0.8;
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const distance = earthRadius * (0.4 + Math.random() * 0.4);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const size = 15 + Math.random() * 25;

        const chloroGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        chloroGradient.addColorStop(0, `rgba(50, 255, 150, ${chlorophyllOpacity * 0.4})`);
        chloroGradient.addColorStop(1, 'rgba(50, 255, 150, 0)');
       
        ctx.fillStyle = chloroGradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Satellite scan lines
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += 3) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Grid overlay
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Crosshair at ocean location
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 20, centerY);
      ctx.lineTo(centerX + 20, centerY);
      ctx.moveTo(centerX, centerY - 20);
      ctx.lineTo(centerX, centerY + 20);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
      ctx.stroke();

      // Labels
      ctx.fillStyle = 'rgba(0, 200, 255, 0.9)';
      ctx.font = '10px monospace';
      ctx.fillText(`LAT: ${selectedOcean.displayCoords.lat}`, 10, 20);
      ctx.fillText(`LON: ${selectedOcean.displayCoords.lon}`, 10, 35);
      ctx.fillText(`SATELLITE: ${selectedOcean.satellite}`, 10, 50);
      ctx.fillText(`PRODUCT: ${selectedOcean.nasaProduct}`, 10, 65);
     
      ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
      ctx.fillText(`SCANNING: ${year}`, canvas.width - 120, 20);
      ctx.fillText(`SST: ${satelliteData.temperature}°C`, canvas.width - 120, 35);
    };

    drawSatelliteView();
  }, [selectedOcean, satelliteData, year]);

  // Underwater View Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedOcean) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: Math.floor(150 * (satelliteData.chlorophyll / 0.5)) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      type: Math.random() > 0.7 ? 'coral' : 'plankton'
    }));

    const fishCount = Math.floor((health.life / 100) * 20);
    const fish = Array.from({ length: fishCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 25 + 15,
      speed: Math.random() * 2 + 1,
      direction: Math.random() > 0.5 ? 1 : -1,
      species: Math.random() > 0.5 ? 'large' : 'small'
    }));

    const iceChunks = (selectedOcean.id === 'arctic' || selectedOcean.id === 'southern')
      ? Array.from({ length: Math.floor(satelliteData.iceExtent / 5) }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * 100,
          size: Math.random() * 50 + 30,
          drift: Math.random() * 0.3
        }))
      : [];

    const animate = () => {
      const depthRatio = depth / maxDepth;
      const tempAnomaly = satelliteData.temperature - selectedOcean.baseTemp;
     
      let baseR, baseG, baseB;
     
      if (selectedOcean.id === 'arctic' || selectedOcean.id === 'southern') {
        baseR = 100 + (satelliteData.iceExtent * 1.5);
        baseG = 150 + (satelliteData.iceExtent * 1.0);
        baseB = 200;
      } else if (selectedOcean.id === 'indian') {
        baseR = 30 + tempAnomaly * 20;
        baseG = 120 - tempAnomaly * 15;
        baseB = 150 - tempAnomaly * 10;
      } else {
        baseR = 20 + tempAnomaly * 25;
        baseG = 80 + depthRatio * 30 - tempAnomaly * 20;
        baseB = 150 - depthRatio * 80 + tempAnomaly * 10;
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `rgb(${baseR}, ${baseG}, ${baseB})`);
      gradient.addColorStop(1, `rgb(${Math.max(0, baseR - 40)}, ${Math.max(0, baseG - 60)}, ${Math.max(0, baseB - 90)})`);
     
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      iceChunks.forEach(ice => {
        ice.x += ice.drift;
        if (ice.x > canvas.width + 100) ice.x = -100;

        ctx.fillStyle = `rgba(220, 240, 255, ${0.7 + satelliteData.iceExtent / 200})`;
        ctx.beginPath();
        ctx.moveTo(ice.x, ice.y);
        ctx.lineTo(ice.x + ice.size, ice.y + 10);
        ctx.lineTo(ice.x + ice.size - 15, ice.y + ice.size * 0.4);
        ctx.lineTo(ice.x - 15, ice.y + ice.size * 0.3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(180, 220, 255, 0.3)`;
        ctx.fillRect(ice.x, ice.y + ice.size * 0.4, ice.size, 2);
      });

      particles.forEach(p => {
        p.y += p.speed;
        if (p.y > canvas.height) p.y = -10;

        const greenShift = satelliteData.chlorophyll * 100;
        ctx.fillStyle = p.type === 'coral' ?
          `rgba(${255 - tempAnomaly * 30}, ${150 - tempAnomaly * 40}, 100, ${p.opacity})` :
          `rgba(100, ${150 + greenShift}, 255, ${p.opacity})`;
       
        if (p.type === 'coral') {
          ctx.fillRect(p.x, p.y, p.size * 2, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      fish.forEach(f => {
        f.x += f.speed * f.direction;
        if (f.x > canvas.width + 100) f.x = -100;
        if (f.x < -100) f.x = canvas.width + 100;

        const fishColor = f.species === 'large' ?
          `rgba(255, 180, 80, ${health.life / 100})` :
          `rgba(200, 220, 255, ${health.life / 100})`;
       
        ctx.fillStyle = fishColor;
        ctx.beginPath();
        ctx.ellipse(f.x, f.y, f.size, f.size / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(f.x - f.size * f.direction, f.y);
        ctx.lineTo(f.x - f.size * 1.6 * f.direction, f.y - f.size / 2);
        ctx.lineTo(f.x - f.size * 1.6 * f.direction, f.y + f.size / 2);
        ctx.closePath();
        ctx.fill();
      });

      if (depth > 100 && selectedOcean.id !== 'arctic') {
        const bleachAmount = Math.min(1, tempAnomaly / 2);
        for (let i = 0; i < 20; i++) {
          const x = (canvas.width / 20) * i;
          const height = Math.random() * 120 + 60;
         
          const coralR = 200 + bleachAmount * 55;
          const coralG = 150 - bleachAmount * 100;
          const coralB = 100 - bleachAmount * 80;
         
          ctx.fillStyle = `rgba(${coralR}, ${coralG}, ${coralB}, 0.7)`;
         
          for (let j = 0; j < 3; j++) {
            const branchX = x + (j - 1) * 15;
            ctx.fillRect(branchX, canvas.height - height, 8, height);
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [depth, selectedOcean, satelliteData, health.life, maxDepth]);

  const startDive = () => {
    if (!selectedOcean) return;
    setIsDiving(true);
    const diveInterval = setInterval(() => {
      setDepth(d => {
        if (d >= maxDepth) {
          clearInterval(diveInterval);
          setTimeout(() => {
            setDepth(0);
            setIsDiving(false);
          }, 4000);
          return maxDepth;
        }
        return d + 10;
      });
    }, 50);
  };

  if (!selectedOcean) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden flex items-center justify-center p-4 md:p-8">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Satellite className="w-12 h-12 md:w-16 md:h-16 text-blue-400 animate-pulse" />
              <h1 className="text-3xl md:text-5xl font-bold text-white">NASA Ocean Thermometer</h1>
            </div>
            <p className="text-blue-200 text-lg md:text-xl mb-2">A Dive into Global Warming</p>
            <p className="text-blue-300 text-xs md:text-sm">Powered by MODIS, SMAP & GIBS Satellite Data</p>
            <div className="mt-4 text-slate-400 text-xs md:text-sm">
              <p>NASA Space Apps Challenge 2025</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {oceans.map((ocean) => (
              <button
                key={ocean.id}
                onClick={() => setSelectedOcean(ocean)}
                className="group relative bg-slate-800/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-xl p-4 md:p-6 hover:border-blue-400 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 text-left"
              >
                <div className="absolute top-4 right-4">
                  <Waves className="w-6 h-6 md:w-8 md:h-8 text-blue-400 group-hover:animate-bounce" />
                </div>
               
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 pr-10">{ocean.name}</h3>
                <p className="text-blue-300 text-xs md:text-sm mb-4">{ocean.description}</p>
               
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Temp:</span>
                    <span className="text-blue-300">{ocean.baseTemp}°C</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Max Depth:</span>
                    <span className="text-blue-300">{ocean.maxDepth.toLocaleString()}m</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Satellite:</span>
                    <span className="text-blue-300">{ocean.satellite}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Product:</span>
                    <span className="text-blue-300 text-[10px]">{ocean.nasaProduct}</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="inline-block bg-blue-600 text-white text-xs px-4 py-2 rounded-full group-hover:bg-blue-500 transition-colors">
                    Select & Dive
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* Satellite View Canvas */}
      {showSatelliteView && (
        <div className="absolute top-4 right-4 w-80 h-80 border-2 border-blue-500 rounded-lg overflow-hidden bg-black shadow-2xl z-10">
          <canvas ref={satelliteCanvasRef} className="w-full h-full" />
          <div className="absolute top-2 left-2 bg-black/80 text-blue-400 text-xs px-2 py-1 rounded font-mono">
            SATELLITE VIEW
          </div>
          <button
            onClick={() => setShowSatelliteView(false)}
            className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded hover:bg-black transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {!showSatelliteView && (
        <button
          onClick={() => setShowSatelliteView(true)}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 z-10 shadow-lg transition-colors"
        >
          <Satellite className="w-4 h-4" />
          Show Satellite View
        </button>
      )}

      {/* Underwater View Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 md:p-4 pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2 md:gap-3">
                <Radio className="w-5 h-5 md:w-6 md:h-6 text-blue-400 animate-pulse" />
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-white">{selectedOcean.name}</h1>
                  <p className="text-[10px] md:text-xs text-blue-300">NASA {selectedOcean.satellite} • {selectedOcean.gibsLayer}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedOcean(null);
                  setDepth(0);
                  setIsDiving(false);
                }}
                className="bg-slate-800/80 hover:bg-slate-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-colors"
              >
                Change Ocean
              </button>
            </div>

            {/* Real-time Satellite Data Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <div className="bg-orange-900/40 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-orange-400/30">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <Thermometer className="w-3 h-3 md:w-4 md:h-4 text-orange-300" />
                  <span className="text-orange-200 text-[10px] md:text-xs">SST (MODIS)</span>
                </div>
                <div className="text-white font-mono text-sm md:text-lg">{satelliteData.temperature}°C</div>
                <div className="text-orange-300 text-[10px] md:text-xs">
                  +{(satelliteData.temperature - selectedOcean.baseTemp).toFixed(2)}°C anomaly
                </div>
              </div>

              <div className="bg-cyan-900/40 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-cyan-400/30">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <Droplets className="w-3 h-3 md:w-4 md:h-4 text-cyan-300" />
                  <span className="text-cyan-200 text-[10px] md:text-xs">Salinity (SMAP)</span>
                </div>
                <div className="text-white font-mono text-sm md:text-lg">{satelliteData.salinity} psu</div>
                <div className="text-cyan-300 text-[10px] md:text-xs">
                  {satelliteData.salinity > selectedOcean.baseSalinity ? '+' : ''}
                  {(satelliteData.salinity - selectedOcean.baseSalinity).toFixed(2)} psu
                </div>
              </div>

              <div className="bg-green-900/40 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-green-400/30">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <Activity className="w-3 h-3 md:w-4 md:h-4 text-green-300" />
                  <span className="text-green-200 text-[10px] md:text-xs">Chlorophyll-a</span>
                </div>
                <div className="text-white font-mono text-sm md:text-lg">{satelliteData.chlorophyll} mg/m³</div>
                <div className="text-green-300 text-[10px] md:text-xs">Phytoplankton</div>
              </div>

              <div
                className="backdrop-blur-sm rounded-lg p-2 md:p-3 border"
                style={{
                  backgroundColor: `${health.color}20`,
                  borderColor: `${health.color}50`
                }}
              >
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <Fish className="w-3 h-3 md:w-4 md:h-4" style={{ color: health.color }} />
                  <span className="text-[10px] md:text-xs" style={{ color: health.color }}>Health Index</span>
                </div>
                <div className="text-white font-mono text-sm md:text-lg">{health.life.toFixed(0)}%</div>
                <div className="text-[10px] md:text-xs uppercase font-semibold" style={{ color: health.color }}>
                  {health.status}
                </div>
              </div>
            </div>

            {/* Ice Extent for Polar Oceans */}
            {(selectedOcean.id === 'arctic' || selectedOcean.id === 'southern') && (
              <div className="mt-2 md:mt-3 bg-blue-900/40 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-blue-400/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wind className="w-3 h-3 md:w-4 md:h-4 text-blue-300" />
                    <span className="text-blue-200 text-xs md:text-sm">Sea Ice Extent (Satellite)</span>
                  </div>
                  <span className="text-white font-mono text-base md:text-xl">{satelliteData.iceExtent}%</span>
                </div>
                <div className="w-full bg-blue-950 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${satelliteData.iceExtent}%` }}
                  />
                </div>
                <p className="text-blue-300 text-[10px] md:text-xs">
                  {(100 - satelliteData.iceExtent).toFixed(1)}% ice loss since 1997 baseline
                </p>
              </div>
            )}

            {/* Coordinates & Location */}
            <div className="mt-2 md:mt-3 bg-slate-800/60 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-slate-600/30">
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-300">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                <span>Target Coordinates: {selectedOcean.displayCoords.lat}, {selectedOcean.displayCoords.lon}</span>
                <span className="text-slate-500">|</span>
                <span>Depth: {depth}m / {maxDepth}m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Depth Indicator - Side */}
        <div className="absolute left-2 md:left-4 top-1/4 bottom-1/4 pointer-events-auto">
          <div className="h-full bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-blue-400/30 flex flex-col items-center justify-between">
            <span className="text-blue-300 text-[10px] md:text-xs writing-mode-vertical transform rotate-180">
              Depth
            </span>
            <div className="flex-1 w-6 md:w-8 bg-blue-950 rounded-full my-3 md:my-4 relative">
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-400 to-cyan-400 rounded-full transition-all duration-300"
                style={{ height: `${(depth / maxDepth) * 100}%` }}
              />
            </div>
            <span className="text-white font-mono text-xs md:text-sm">{depth}m</span>
          </div>
        </div>

        {/* Controls - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4 pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            {/* Year Slider */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-2 md:mb-3">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <label className="text-white font-semibold text-sm md:text-base">Year: {year}</label>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Info className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <input
                type="range"
                min="1997"
                max={currentYear}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #ef4444 ${((year - 1997) / (currentYear - 1997)) * 100}%, #1e293b ${((year - 1997) / (currentYear - 1997)) * 100}%)`
                }}
              />
              <div className="flex justify-between text-[10px] md:text-xs text-slate-400 mt-2">
                <span>1997 Baseline</span>
                <span>2025 Current</span>
              </div>
            </div>

            {/* Dive Button */}
            <button
              onClick={startDive}
              disabled={isDiving}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-sm md:text-base"
            >
              {isDiving ? `DIVING... ${depth}m` : `DIVE INTO ${selectedOcean.name.toUpperCase()}`}
            </button>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900/95 backdrop-blur-md rounded-xl p-4 md:p-6 max-w-3xl border border-blue-500/30 max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Satellite className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                {selectedOcean.name} - NASA Satellite Data
              </h2>
              <div className="text-slate-300 space-y-4 text-xs md:text-sm leading-relaxed">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 md:p-4">
                  <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    Real Satellite Products Used
                  </h3>
                  <ul className="space-y-1 text-xs">
                    <li>• <span className="text-blue-300">Satellite:</span> {selectedOcean.satellite}</li>
                    <li>• <span className="text-blue-300">Product Code:</span> {selectedOcean.nasaProduct}</li>
                    <li>• <span className="text-blue-300">GIBS Layer:</span> {selectedOcean.gibsLayer}</li>
                    <li>• <span className="text-blue-300">Resolution:</span> 1km daily imagery</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Key Characteristics</h3>
                  <ul className="space-y-2">
                    {selectedOcean.characteristics.map((char, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-orange-400 font-semibold mb-2">Climate Change Threats</h3>
                  <ul className="space-y-2">
                    {selectedOcean.threats.map((threat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-400">⚠</span>
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-purple-400 font-semibold mb-2">Warming Rate</h3>
                  <p>This ocean is warming at approximately <span className="text-purple-300 font-semibold">{(selectedOcean.warmingRate * 100).toFixed(2)}°C per decade</span> based on satellite temperature measurements since 1997.</p>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                  <p className="text-yellow-300 font-semibold">💡 Interactive Features:</p>
                  <p className="text-slate-300 mt-2">Use the time slider to see how satellite measurements have changed. The satellite view (top-right) shows real-time temperature heat maps, chlorophyll concentrations, and ice coverage based on NASA data.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Warnings */}
        {health.life < 60 && (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-red-900/80 backdrop-blur-sm border-2 border-red-500 rounded-lg p-3 md:p-4 max-w-md text-center animate-pulse pointer-events-auto">
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm md:text-base">Ocean Health Alert</p>
            <p className="text-red-200 text-xs md:text-sm mt-2">
              {health.life < 40 ? 'Critical ecosystem degradation detected by satellite' : 'Marine ecosystems under significant stress'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NASAOceanVR;