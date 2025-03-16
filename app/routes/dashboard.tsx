import { useLoaderData } from "react-router";
import ContactSourcesChart from "~/components/dashboard/ContactSourcesChart";
import OurContactsChart from "~/components/dashboard/OurContactsChart";
import ShopifyRevenueChart from "~/components/dashboard/ShopifyRevenueChart";
import { LuMail } from "react-icons/lu";
import ContactGrowthTrendChart from "~/components/dashboard/ContactGrowthTrendChart";

export const clientLoader = async () => {
  return {
    // The total amount of contacts per day for the last 7 days
    contacts: {
      lastWeek: [398, 412, 425, 430, 445, 460, 430],
      thisWeek: [438, 438, 450, 459, 482, 483, 492],
    },
    support: {
      email: "help@keaz.app",
    },
    shopifyRevenue: {
      lastWeek: 15874,
      thisWeek: 20023,
    },
    contactSources: [
      {
        source: "Shopify Order",
        count: 232,
      },
      {
        source: "Shopify Widget",
        count: 35,
      },
      {
        source: "Chat-In",
        count: 125,
      },
      {
        source: "Instagram Bio Link",
        count: 48,
      },
      {
        source: "Manually Created",
        count: 11,
      },
    ],
  };
};

const Dashboard = () => {
  const data = useLoaderData<typeof clientLoader>();

  console.log(data.support);
  console.table(data.shopifyRevenue);
  console.table(data.contacts);
  console.table(data.contactSources);

  return (
    <div className="flex flex-col gap-6 w-full">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Keaz Analytics Dashboard
        </h1>
        <div className="text-gray-600 flex items-center">
          Support: <LuMail className="mx-1 text-gray-500" />{" "}
          {data.support.email}
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <OurContactsChart />
        <ShopifyRevenueChart />
        <ContactSourcesChart />
        <ContactGrowthTrendChart />
      </div>
    </div>
  );
};

export default Dashboard;
