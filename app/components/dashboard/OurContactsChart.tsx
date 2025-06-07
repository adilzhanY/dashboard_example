import React, { useEffect, useState, PureComponent } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
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
import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const CustomTooltip = ({ active, payload, label }: any) => {
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
        {payload.map((entry: any, index: number) => {
          return (
            <div key={index} className="flex text-sm text-grey-500">
              {entry.name === "Last Week" ? (
                <TrendingDown className="mr-1 h-3 w-3" />
              ) : (
                <TrendingUp className="mr-1 h-3 w-3" />
              )}
              <div className="mr-2 text-xs text-gray-600">{entry.name}</div>
              <div className="text-xs font-bold">{entry.value}</div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

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
          throw new Error("Invalid data structure");
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
    <div className="bg-white p-6 py-6">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ left: 20, right: 20 }}>
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
            <CartesianGrid vertical={false} opacity={0.2} />
            <XAxis
              dataKey={"name"}
              tickFormatter={(tick) => tick.substring(0, 3)}
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={["auto", "auto"]} hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="natural"
              dataKey="thisWeek"
              name="This Week"
              stroke="#6A0DAD"
              strokeWidth={1}
              fill="url(#colorThisWeek)"
              animationDuration={1500}
              animationEasing="ease-out"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#6A0DAD",
                stroke: "none",
              }}
            />
            <Area
              type="natural"
              dataKey="lastWeek"
              name="Last Week"
              stroke="#C4A1E3"
              strokeWidth={1}
              fill="url(#colorLastWeek)"
              animationDuration={1500}
              animationEasing="ease-out"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#C4A1E3",
                stroke: "none",
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                fontSize: "14px",
                marginTop: "-10px",
              }}
              content={({ payload }) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  {payload &&
                    payload.map((entry, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          color: entry.color,
                        }}
                      >
                        {entry.dataKey === "lastWeek" ? (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        )}
                        {entry.value}
                      </div>
                    ))}
                </div>
              )}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OurContactsChart;
