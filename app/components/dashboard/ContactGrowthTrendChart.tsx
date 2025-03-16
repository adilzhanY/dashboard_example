import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { clientLoader } from "~/routes/dashboard";
import type { ClientData } from "../../types/data";

const ContactGrowthTrendChart: React.FC = () => {
  const [chartData, setChartData] = useState<ClientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await clientLoader();
        if (data?.contacts?.thisWeek) {
          setChartData(data as ClientData);
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

  const thisWeek = chartData.contacts.thisWeek;
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formattedData = days.map((day, index) => ({
    name: day,
    thisWeek: thisWeek[index],
  }));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-xl font-semibold mb-4">Contact Growth</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" hide={true} />
            <YAxis domain={["auto", "auto"]} hide={true} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                border: "none",
              }}
              formatter={(value) => [`${value} contacts`, ""]}
              labelFormatter={(label) => `${label}`}
              animationDuration={300}
            />
            <Line
              type="monotone"
              dataKey="thisWeek"
              stroke="url(#trendGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
              name="Contacts"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContactGrowthTrendChart;
