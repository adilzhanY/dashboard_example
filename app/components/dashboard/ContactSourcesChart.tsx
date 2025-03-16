import React, { useEffect, useState, PureComponent } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { clientLoader } from "~/routes/dashboard";
import type { ClientData, ContactSource } from "../../types/data";

const gradientColors = {
  sources: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
};

const ContactSourcesChart: React.FC = () => {
  const [chartData, setChartData] = useState<ContactSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await clientLoader();
        if (data?.contactSources && Array.isArray(data.contactSources)) {
          setChartData(data.contactSources);
        } else {
          throw new Error("Invalid data structure for contacts");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <div>Loading chart data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chartData) return <div>No data available</div>;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-xl font-semibold mb-4">Contact Sources</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`sourceGradient${index}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={
                      gradientColors.sources[
                        index % gradientColors.sources.length
                      ]
                    }
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      gradientColors.sources[
                        index % gradientColors.sources.length
                      ]
                    }
                    stopOpacity={0.6}
                  />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={90}
              paddingAngle={5}
              cornerRadius={3}
              dataKey="count"
              nameKey="source"
              animationDuration={1500}
              animationEasing="ease-in-out"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#sourceGradient${index})`}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                border: "none",
              }}
              animationDuration={300}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContactSourcesChart;
