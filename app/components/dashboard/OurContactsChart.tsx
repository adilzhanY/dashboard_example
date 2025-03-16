import React, { useEffect, useState, PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { clientLoader } from "~/routes/dashboard";
import type { ClientData } from "../../types/data";
import { GRADIENT_COLORS } from "./constants/colors";

const OurContactsChart: React.FC = () => {
  const [chartData, setChartData] = useState<ClientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await clientLoader();
        if (data?.contacts?.thisWeek && data?.contacts?.lastWeek) {
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

  const { thisWeek, lastWeek } = chartData.contacts;
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
    lastWeek: lastWeek[index],
  }));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <h3 className="text-xl font-semibold mb-4">Our Contacts</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={GRADIENT_COLORS.lastWeek[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={GRADIENT_COLORS.lastWeek[1]}
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={GRADIENT_COLORS.thisWeek[0]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={GRADIENT_COLORS.thisWeek[1]}
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0} />
            <XAxis dataKey={"name"} hide={true} />
            <YAxis domain={["auto", "auto"]} hide={true} />
            <Tooltip
              formatter={(value, name) => {
                const textColor = name === "Last Week" ? "#ff5252" : "#4caf50";

                return [
                  <span style={{ color: textColor }}>{value}</span>,
                  name,
                ];
              }}
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                border: "none",
              }}
            />
            <Area
              type="monotone"
              dataKey="thisWeek"
              name="This Week"
              stroke="none"
              fill="url(#colorThisWeek)"
              animationDuration={1500}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="lastWeek"
              name="Last Week"
              stroke="none"
              fill="url(#colorLastWeek)"
              animationDuration={1500}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OurContactsChart;
