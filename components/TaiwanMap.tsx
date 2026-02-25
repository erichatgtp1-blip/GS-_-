
import React, { useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';

interface TaiwanMapProps {
  onCountyClick: (county: string) => void;
  countyCounts: Record<string, number>;
  selectedCounty: string | null;
}

const TaiwanMap: React.FC<TaiwanMapProps> = ({ onCountyClick, countyCounts, selectedCounty }) => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    // Standard Taiwan GeoJSON source
    d3.json('https://raw.githubusercontent.com/g0v/twgeojson/master/json/twCounty2010.geo.json')
      .then(data => setGeoData(data))
      .catch(err => console.error("Map loading error:", err));
  }, []);

  const colorScale = useMemo(() => {
    const values = Object.values(countyCounts);
    const max = Math.max(...values, 1);
    return d3.scaleSequential(d3.interpolateBlues).domain([0, max]);
  }, [countyCounts]);

  // Map Taiwan GeoJSON county names to our data names if they differ
  const normalizeCountyName = (name: string) => {
    if (!name) return "";
    return name.replace('臺', '台');
  };

  const getCountyColor = (countyName: string) => {
    const normName = normalizeCountyName(countyName);
    // Find matching key in countyCounts
    const match = Object.keys(countyCounts).find(k => normalizeCountyName(k) === normName);
    const count = match ? countyCounts[match] : 0;
    return count === 0 ? '#f1f5f9' : colorScale(count);
  };

  if (!geoData) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="text-gray-400 text-sm flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 mb-2 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          載入地圖中...
        </div>
      </div>
    );
  }

  const projection = d3.geoMercator().center([121, 23.5]).scale(5500).translate([200, 250]);
  const pathGenerator = d3.geoPath().projection(projection);

  return (
    <div className="relative w-full h-[600px] bg-white rounded-xl shadow-lg overflow-hidden border">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-sm font-bold text-gray-700">縣市學校分布圖</h4>
        <p className="text-xs text-gray-500">顏色越深代表學校數量越多</p>
      </div>
      
      <svg width="100%" height="100%" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid meet">
        <g>
          {geoData.features.map((feature: any, i: number) => {
            const countyName = feature.properties.COUNTYNAME;
            const isSelected = selectedCounty && normalizeCountyName(selectedCounty) === normalizeCountyName(countyName);
            
            return (
              <path
                key={`county-${i}`}
                d={pathGenerator(feature) || ""}
                fill={getCountyColor(countyName)}
                stroke={isSelected ? "#2563eb" : "#cbd5e1"}
                strokeWidth={isSelected ? 2 : 0.5}
                className="cursor-pointer transition-colors duration-200 hover:opacity-80"
                onClick={() => onCountyClick(countyName)}
              >
                <title>{countyName}: {countyCounts[Object.keys(countyCounts).find(k => normalizeCountyName(k) === normalizeCountyName(countyName)) || ""] || 0} 所學校</title>
              </path>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default TaiwanMap;
