import React, { useEffect, useRef } from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: ChartData[];
  size?: number;
  thickness?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  size = 200,
  thickness = 40
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate total value
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);
    
    // Start angle
    let startAngle = -0.5 * Math.PI; // Start at top (12 o'clock position)
    
    // Draw segments
    data.forEach(item => {
      const colorClass = item.color;
      let color;
      
      // Extract color from Tailwind classes
      if (colorClass.includes('blue')) color = '#3B82F6';
      else if (colorClass.includes('emerald')) color = '#10B981';
      else if (colorClass.includes('amber')) color = '#F59E0B';
      else if (colorClass.includes('purple')) color = '#8B5CF6';
      else if (colorClass.includes('rose')) color = '#F43F5E';
      else if (colorClass.includes('cyan')) color = '#06B6D4';
      else if (colorClass.includes('indigo')) color = '#6366F1';
      else if (colorClass.includes('pink')) color = '#EC4899';
      else color = '#6B7280'; // Default gray
      
      // Calculate angle for this segment
      const segmentAngle = (item.value / totalValue) * 2 * Math.PI;
      
      // Draw segment
      ctx.beginPath();
      ctx.arc(
        size / 2, // center x
        size / 2, // center y
        size / 2 - 10, // radius (slightly smaller than canvas)
        startAngle,
        startAngle + segmentAngle
      );
      ctx.lineTo(size / 2, size / 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Move start angle for next segment
      startAngle += segmentAngle;
    });
    
    // Draw center circle (for donut hole)
    ctx.beginPath();
    ctx.arc(
      size / 2,
      size / 2,
      (size - thickness * 2) / 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-background') || '#FFFFFF';
    ctx.fill();
    
  }, [data, size, thickness]);

  // Create legend items
  const legendItems = data.map((item, index) => {
    const percentage = item.value / data.reduce((acc, i) => acc + i.value, 0) * 100;
    
    return (
      <div key={index} className="flex items-center text-xs">
        <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
        <span className="truncate">{item.label}</span>
        <span className="ml-auto font-medium">{percentage.toFixed(1)}%</span>
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <canvas ref={canvasRef} width={size} height={size}></canvas>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
          <span className="text-xl font-bold">
            ₹{data.reduce((acc, item) => acc + item.value, 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2 w-full max-w-xs">
        {legendItems}
      </div>
    </div>
  );
};

export default DonutChart;