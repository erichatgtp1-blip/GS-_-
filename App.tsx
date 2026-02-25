
import React, { useState, useMemo } from 'react';
import { schools } from './data';
import { SchoolData } from './types';
import QuadrantChart from './components/QuadrantChart';
import TaiwanMap from './components/TaiwanMap';

const App: React.FC = () => {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  // Normalize county name for comparison (handle 臺 vs 台)
  const normalize = (name: string) => name.replace('臺', '台');

  const filteredData = useMemo(() => {
    if (!selectedCounty) return schools;
    const targetNorm = normalize(selectedCounty);
    return schools.filter(s => normalize(s.縣市) === targetNorm);
  }, [selectedCounty]);

  const countyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    schools.forEach(s => {
      counts[s.縣市] = (counts[s.縣市] || 0) + 1;
    });
    return counts;
  }, []);

  const handleCountyClick = (county: string) => {
    // If clicking same county, toggle off, or just select
    setSelectedCounty(county);
  };

  const handleReset = () => {
    setSelectedCounty(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">學校碳排放視覺化分析</h1>
          <p className="text-gray-500">分析全台 59 所學校之人口規模與碳排放關係</p>
        </div>
        <div className="flex items-center gap-4">
          {selectedCounty && (
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 flex items-center gap-2">
              目前選取：{selectedCounty}
              <button onClick={handleReset} className="hover:text-blue-900 font-bold">&times;</button>
            </div>
          )}
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-all shadow-md active:scale-95"
          >
            初始設定
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Center: Quadrant Chart */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center mb-2 px-2">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              四象限分布圖
            </h2>
            <div className="text-xs text-gray-400">
              Y軸：學校人數 | X軸：碳排放總量 | 點半徑：人均碳排放
            </div>
          </div>
          <QuadrantChart data={filteredData} />
          
          <div className="bg-white p-4 rounded-xl border shadow-sm text-xs text-gray-500 leading-relaxed">
            <h3 className="font-bold mb-1 text-gray-700">象限定義說明：</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="font-semibold text-blue-600">右上：</span>高人數、高碳排</div>
              <div><span className="font-semibold text-green-600">左上：</span>高人數、低碳排 (高效)</div>
              <div><span className="font-semibold text-orange-600">右下：</span>低人數、高碳排 (高密集)</div>
              <div><span className="font-semibold text-purple-600">左下：</span>低人數、低碳排</div>
            </div>
          </div>
        </div>

        {/* Right: Map Control */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2 px-2">
            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
            行政區篩選
          </h2>
          <TaiwanMap 
            onCountyClick={handleCountyClick} 
            countyCounts={countyCounts} 
            selectedCounty={selectedCounty}
          />
          
          {/* Quick Stats Panel */}
          <div className="bg-white p-6 rounded-xl shadow-md border space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">數據統計</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">總學校數</p>
                <p className="text-xl font-bold text-slate-800">{filteredData.length}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">平均人均碳排</p>
                <p className="text-xl font-bold text-slate-800">
                  {(filteredData.reduce((s, a) => s + a.人均碳排放當量, 0) / (filteredData.length || 1)).toFixed(3)}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">主要排放來源</p>
                <p className="text-sm font-semibold text-slate-700">能源間接排放源 (均值約 70%+)</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-400 text-sm">
        &copy; 2024 學校環境數據視覺化分析平台
      </footer>
    </div>
  );
};

export default App;
