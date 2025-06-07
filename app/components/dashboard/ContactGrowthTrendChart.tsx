import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { clientLoader } from "~/routes/dashboard";
import type { ClientData } from "../../types/data";

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

const ContactGrowthTrendChart: React.FC = () => {
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

  let twTotal = 0;
  let lwTotal = 0;

  for (const data of formattedData) {
    twTotal += data.thisWeek;
  }
  console.log("This week Total", twTotal);

  for (const data of formattedData) {
    lwTotal += data.lastWeek;
  }
  console.log("Last week Total", lwTotal);

  let growthPercentage =
    lwTotal !== 0 ? ((twTotal - lwTotal) / lwTotal) * 100 : 0;

  console.log("Growth Percentage:", growthPercentage.toFixed(2) + "%");

  return (
    <div className="bg-white p-6 py-6">
      <div className="flex items-baseline mb-1">
        <h3 className="text-2xl font-bold mr-1">{twTotal.toLocaleString()}</h3>
        <h3 className="font-medium">contacts</h3>
      </div>
      <div className="flex">
        <h4 className="text-gray-500 mb-1 mr-1">
          +{growthPercentage.toFixed(2) + "%"}
        </h4>
        <h4 className="text-gray-500">from last week</h4>
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} opacity={0.3} />
            <XAxis dataKey="name" hide={true} />
            <YAxis domain={["auto", "auto"]} hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Line
              type="natural"
              dataKey="thisWeek"
              stroke="url(#trendGradient)"
              strokeWidth={2}
              dot={{
                fill: "url(#trendGradient)",
              }}
              activeDot={{ r: 6 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
              name="Contacts"
            />
            <LabelList position="top" offset={12} fontSize={12} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContactGrowthTrendChart;
