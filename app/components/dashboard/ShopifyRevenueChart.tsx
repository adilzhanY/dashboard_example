import React, { useEffect, useState, PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { clientLoader } from "~/routes/dashboard";
import type { ClientData } from "../../types/data";

const CustomToolTip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "14px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "none",
          padding: "7px",
        }}
      >
        <div
          style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "4px" }}
        >
          {label}
        </div>
        <div className="text-xl font-bold text-gray-500">
          ${payload[0].value.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

const ShopifyRevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<ClientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const gradientColors = {
    lastWeek: ["#81D4FA", "#4FC3F7"],
    thisWeek: ["#80CBC4", "#26A69A"],
  };
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await clientLoader();
        if (data?.shopifyRevenue?.thisWeek && data?.shopifyRevenue?.lastWeek) {
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

  const revenueData = [
    { name: "Last Week", value: chartData.shopifyRevenue.lastWeek },
    { name: "This Week", value: chartData.shopifyRevenue.thisWeek },
  ];

  const totalRevenue =
    (revenueData[0].value || 0) + (revenueData[1].value || 0);

  return (
    <div className="bg-white p-6 py-6">
      <div>
        <h3 className="font-medium">Total Revenue</h3>
        <h3 className="text-2xl font-bold mr-1">
          ${totalRevenue.toLocaleString()}
        </h3>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData} margin={{ left: 50, right: 50 }}>
            <defs>
              <linearGradient id="revenueLastWeek" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={gradientColors.lastWeek[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={gradientColors.lastWeek[1]}
                  stopOpacity={0.6}
                />
              </linearGradient>
              <linearGradient id="revenueThisWeek" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={gradientColors.thisWeek[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={gradientColors.thisWeek[1]}
                  stopOpacity={0.6}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} opacity={0.2} />
            <XAxis
              dataKey={"name"}
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide={true} />
            <Tooltip content={<CustomToolTip />} cursor={false} />
            <Bar
              dataKey="value"
              name="Revenue"
              fill="url(#revenueThisWeek)"
              radius={[10, 10, 10, 10]}
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {revenueData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === "Last Week"
                      ? "url(#revenueLastWeek)"
                      : "url(#revenueThisWeek)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ShopifyRevenueChart;
