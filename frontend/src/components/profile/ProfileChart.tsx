'use client';

import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProfileChartProps {
  userId: string;
}

interface ChartData {
  timestamp: string;
  monthlyData: Record<string, { projects: number; earnings: number; completed: number }>;
  totalProjects: number;
  totalEarnings: number;
  completedProjects: number;
}

export function ProfileChart({ userId }: ProfileChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/${userId}/stats-stream`
    );

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.error) {
          setChartData(data);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">
            {isConnected ? 'Loading chart data...' : 'Connecting...'}
          </p>
        </div>
      </div>
    );
  }

  const months = Object.keys(chartData.monthlyData).sort();
  const monthLabels = months.map(month => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  const projectsData = months.map(month => chartData.monthlyData[month]?.projects || 0);
  const earningsData = months.map(month => chartData.monthlyData[month]?.earnings || 0);
  const completedData = months.map(month => chartData.monthlyData[month]?.completed || 0);

  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Projects',
        data: projectsData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Completed',
        data: completedData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Earnings ($)',
        data: earningsData,
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {chartData.totalProjects}
          </div>
          <div className="text-sm text-blue-800">Total Projects</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {chartData.completedProjects}
          </div>
          <div className="text-sm text-green-800">Completed Projects</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            ${chartData.totalEarnings.toFixed(2)}
          </div>
          <div className="text-sm text-purple-800">Total Earnings</div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center space-x-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-gray-600">
          {isConnected ? 'Live data connected' : 'Connection lost'}
        </span>
        <span className="text-gray-400">
          Last updated: {new Date(chartData.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Project Activity</h3>
          <Line data={lineChartData} options={chartOptions} />
        </div>
        
        <div className="bg-white p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Monthly Earnings</h3>
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
