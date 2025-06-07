import { useLoaderData } from "react-router";
import { LuMail } from "react-icons/lu";
import ContactSourcesChart from "~/components/dashboard/ContactSourcesChart";
import OurContactsChart from "~/components/dashboard/OurContactsChart";
import ShopifyRevenueChart from "~/components/dashboard/ShopifyRevenueChart";
import ContactGrowthTrendChart from "~/components/dashboard/ContactGrowthTrendChart";

export const clientLoader = async () => {
  return {
    contacts: {
      lastWeek: [398, 412, 425, 430, 445, 460, 430],
      thisWeek: [438, 438, 450, 459, 482, 483, 492],
    },
    support: {
      email: "help@somecompany.com",
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

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Dashboard Header */}
        <div className="col-span-1 md:col-span-12 bg-white shadow-sm rounded-lg p-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Business Dashboard
          </h1>
          <div className="text-gray-600 flex items-center mt-2 md:mt-0">
            Support: <LuMail className="mx-1 text-gray-500" />{" "}
            {data.support.email}
          </div>
        </div>

        {/* Contact Growth Overview */}
        <div className="col-span-1 md:col-span-8 bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Contact Growth</h2>
          <OurContactsChart />
        </div>

        {/* Quick Stats Card */}
        <div className="col-span-1 md:col-span-4 bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Insights</h2>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">This Week's Contacts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data.contacts.thisWeek.reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Shopify Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${data.shopifyRevenue.thisWeek.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Sources */}
        <div className="col-span-1 md:col-span-6 bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Contact Sources</h2>
          <ContactSourcesChart />
        </div>

        {/* Growth Momentum */}
        <div className="col-span-1 md:col-span-6 bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Growth Trend</h2>
          <ContactGrowthTrendChart />
        </div>

        {/* Shopify Revenue Trends */}
        <div className="col-span-1 md:col-span-12 bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            Detailed Revenue Trends
          </h2>
          <ShopifyRevenueChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
