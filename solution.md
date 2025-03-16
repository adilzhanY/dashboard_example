# This assignment was done by Adilzhan Yerzhan

## Approach to solving the assignment

I started by carefully reading the README.md instructions and analyzing the existing code. My task was to implement the dashboard page, ensuring it effectively displayed the required values.

To plan the design, I sketched an initial layout on paper. Since I had some knowledge of charts from university, I explored React chart libraries. I tested Chart.js but found it unsuitable. ApexCharts.js seemed promising, but I found it challenging to customize. Finally, I chose Recharts due to its flexibility and ease of use.

For the weekly contacts chart, I used an area chart to highlight performance trends, removing grids and dots for a cleaner look. The Shopify revenue chart was designed as a bar chart with red and green bars for easy comparison. The contact sources chart is a pie chart, allowing users to hover over sections to see values. Lastly, the contact growth trend simply displays this week's changes.

Additionally, I optimized data fetching and error handling so that updates automatically trigger a re-render. This ensures the dashboard always displays the latest data.

## Demonstration

![Dashboard Screenshot](public\images\dashboard_screenshot.png)

## Running

You can also run this app on your own device.

Open the terminal and copy the commands:

````bash
npm install

```bash
npm run dev

````
