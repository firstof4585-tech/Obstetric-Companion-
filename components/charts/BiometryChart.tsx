import React from 'react';
// FIX: Import `Symbols` to be used for custom scatter shape.
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ComposedChart, Symbols } from 'recharts';
import { EFW_CHART_DATA, AFI_CHART_DATA } from '../../constants';

interface BiometryChartProps {
  title: string;
  dataKey: 'efw' | 'afi';
  measuredGa: number | null;
  measuredValue: number | null;
}

const BiometryChart: React.FC<BiometryChartProps> = ({ title, dataKey, measuredGa, measuredValue }) => {
    const chartData = dataKey === 'efw' ? EFW_CHART_DATA : AFI_CHART_DATA;
    const yAxisLabel = dataKey === 'efw' ? 'Weight (g)' : 'AFI (cm)';
    const domain = dataKey === 'efw' ? [0, 4500] : [0, 30];

    const measuredData = (measuredGa && measuredValue) ? [{ ga: measuredGa, value: measuredValue }] : [];

    return (
        <>
            <h3 className="text-md font-semibold text-center mb-2">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                    <XAxis 
                        dataKey="ga" 
                        type="number" 
                        domain={[16, 42]}
                        label={{ value: 'Gestational Age (weeks)', position: 'insideBottom', offset: -5 }} 
                        tick={{fill: 'currentColor', fontSize: 12}}
                        />
                    <YAxis 
                        label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} 
                        domain={domain}
                        tick={{fill: 'currentColor', fontSize: 12}}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            borderColor: 'rgba(100, 116, 139, 0.8)',
                            borderRadius: '0.5rem',
                        }}
                        labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="p5" stroke="#f43f5e" strokeWidth={2} name="5th Percentile" dot={false} />
                    <Line type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={2} name="50th Percentile" dot={false} />
                    <Line type="monotone" dataKey="p95" stroke="#eab308" strokeWidth={2} name="95th Percentile" dot={false} />
                    
                    {measuredData.length > 0 && (
                        // FIX: The `size` prop does not exist on `Scatter`. Use a custom shape with `Symbols` to control the size of the scatter point.
                        <Scatter data={measuredData} dataKey="value" name="Measurement" fill="#10b981" shape={<Symbols type="star" size={150} />} />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </>
    );
};

export default BiometryChart;