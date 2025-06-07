import React, { useEffect, useState } from "react";
import { clientLoader } from "~/routes/dashboard";
import type { ContactSource } from "../../types/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { PieChart, Pie, Label, Cell } from "recharts";

const CustomTooltip = ({ active, payload, chartData, totalContacts }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const color =
    gradientColors.sources[
      chartData.findIndex(
        (item: { source: any }) => item.source === data.source
      ) % gradientColors.sources.length
    ];

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
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-bold">{data.source}</span>
      </div>
      <div className="mt-1 text-sm flex">
        <div className="mr-1 font-bold">{data.count}</div>
        <div className="text-gray-600">contacts</div>
      </div>
      <div className="flex mt-1 text-xs">
        <div className="font-bold">
          {((data.count / totalContacts) * 100).toFixed(1)}
        </div>
        <div className="text-gray-600">% of total</div>
      </div>
    </div>
  );
};

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

  const chartConfig = {
    count: {
      label: "Contacts",
    },
    ...chartData.reduce((acc, source, index) => {
      return {
        ...acc,
        [source.source]: {
          label: source.source,
          color: gradientColors.sources[index % gradientColors.sources.length],
        },
      };
    }, {}),
  } satisfies ChartConfig;

  const totalContacts = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  if (loading) return <div>Loading chart data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chartData.length) return <div>No data available</div>;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <CustomTooltip
              chartData={chartData}
              totalContacts={totalContacts}
            />
          }
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="source"
          innerRadius={60}
          strokeWidth={5}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                gradientColors.sources[index % gradientColors.sources.length]
              }
            />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalContacts.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Contacts
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default ContactSourcesChart;
