
import React from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Cell 
} from 'recharts';
import { SchoolData } from '../types';
import { COLORS } from '../constants';

interface QuadrantChartProps {
  data: SchoolData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: SchoolData = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded-lg shadow-xl text-xs max-w-sm space-y-1">
        <h3 className="font-bold text-sm border-b pb-1 mb-2 text-gray-800">{data.學校名稱}</h3>
        <p><span className="font-semibold text-gray-600">縣市:</span> {data.縣市} ({data.類型})</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <p><span className="font-semibold">教職員:</span> {data.教職員總人數}</p>
          <p><span className="font-semibold">學生數:</span> {data.學生總人數}</p>
          <p><span className="font-semibold">總人數:</span> {data.學校人數}</p>
          <p><span className="font-semibold">碳排總量:</span> {data.碳排放總量.toFixed(2)} t</p>
          <p className="col-span-2"><span className="font-semibold">人均碳排當量:</span> {data.人均碳排放當量.toFixed(4)} t/人</p>
        </div>
        <div className="mt-2 border-t pt-2 space-y-1 text-gray-700">
          <p>固定式排放: {data["固定式排放源比例(%)"].toFixed(1)}%</p>
          <p>移動式排放: {data["移動式排放源比例(%)"].toFixed(1)}%</p>
          <p>逸散性排放: {data["逸散性排放源比例(%)"].toFixed(1)}%</p>
          <p>能源間接排放: {data["能源間接排放源比例(%)"].toFixed(1)}%</p>
          <p>其他間接排放: {data["其他間接排放源比例(%)"].toFixed(1)}%</p>
        </div>
      </div>
    );
  }
  return null;
};

const QuadrantChart: React.FC<QuadrantChartProps> = ({ data }) => {
  // Calculate midpoints for quadrants
  const avgPopulation = data.length > 0 ? data.reduce((sum, s) => sum + s.學校人數, 0) / data.length : 0;
  const avgEmission = data.length > 0 ? data.reduce((sum, s) => sum + s.碳排放總量, 0) / data.length : 0;

  return (
    <div className="w-full h-[600px] bg-white rounded-xl shadow-lg p-6 relative">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-6 text-xs font-medium text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div> 國小
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div> 國中
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div> 高中
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            type="number" 
            dataKey="碳排放總量" 
            name="碳排放總量" 
            label={{ value: '碳排放總量 (t)', position: 'insideBottomRight', offset: -20 }}
            domain={[0, 'dataMax + 100']}
          />
          <YAxis 
            type="number" 
            dataKey="學校人數" 
            name="學校人數" 
            label={{ value: '學校人數', angle: -90, position: 'insideLeft', offset: 10 }}
            domain={[0, 'dataMax + 200']}
          />
          <ZAxis 
            type="number" 
            dataKey="人均碳排放當量" 
            range={[50, 2000]} 
            name="人均碳排放當量" 
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Quadrant Lines */}
          <ReferenceLine x={avgEmission} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: '平均排放', position: 'top', fill: '#94a3b8', fontSize: 10 }} />
          <ReferenceLine y={avgPopulation} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: '平均人數', position: 'right', fill: '#94a3b8', fontSize: 10 }} />
          
          <Scatter name="Schools" data={data}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.類型 as keyof typeof COLORS]} fillOpacity={0.7} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuadrantChart;
