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

const ShopifyRevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<ClientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const gradientColors = {
    lastWeek: ["#FF5252", "#FF1744"], // Red gradients for last week
    thisWeek: ["#69F0AE", "#00C853"], // Green gradients for this week
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

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-xl font-semibold mb-4">Shopify Revenue</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
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
            <CartesianGrid strokeDasharray="3 3" opacity={0} />
            <XAxis dataKey="name" hide={true} />
            <YAxis hide={true} />
            <Tooltip
              formatter={(value, name, props) => {
                const weekName = props.payload.name;

                const textColor =
                  weekName === "Last Week" ? "#ff5252" : "#4caf50";

                return [
                  <span style={{ color: textColor }}>
                    ${value.toLocaleString()}
                  </span>,
                  "Revenue",
                ];
              }}
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                border: "none",
              }}
              animationDuration={300}
            />
            <Bar
              dataKey="value"
              name="Revenue"
              fill="url(#revenueThisWeek)"
              radius={[10, 10, 0, 0]}
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
