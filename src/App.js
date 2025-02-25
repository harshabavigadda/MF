import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MutualFundComparison = () => {
  const [fundIds, setFundIds] = useState([
    "143874", "152082", "119783", "118759",
    "122639", "118955", "120492", "120843",
    "140228", "119775", "118989", "127042",
    "147666", "120716", "143341", "149870",
    "120828", "125354", "118778", "125497"
  ]);
  const [fundData, setFundData] = useState({});
  const [openSections, setOpenSections] = useState({
    healthcare: false,
    flexicap: false,
    midcap: false,
    index: false,
    smallcap: false
  });

  useEffect(() => {
    fundIds.forEach(fetchFundData);
  }, []);

  const fetchFundData = async (id) => {
    try {
      const response = await fetch(`https://api.mfapi.in/mf/${id}`);
      const data = await response.json();
      if (data && data.meta) {
        const fundHouse = data.meta.fund_house;
        const processedData = data.data
          .map((entry, index, arr) => {
            const prevNav = index < arr.length - 1 ? parseFloat(arr[index + 1].nav) : null;
            const currNav = parseFloat(entry.nav);
            const dailyReturn = prevNav ? ((currNav - prevNav) / prevNav) * 100 : 0;
            return { date: entry.date, dailyReturn: dailyReturn.toFixed(2) };
          })
          .reverse();

        const last30Days = processedData.slice(-30);
        const last6Months = processedData.slice(-180);

        setFundData((prev) => ({
          ...prev,
          [id]: {
            name: fundHouse,
            tableData: last30Days,
            graphData: last6Months,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching fund data:", error);
    }
  };

  const toggleColors = {
    healthcare: "bg-gray-400 text-black",
    flexicap: "bg-blue-400 text-white",
    midcap: "bg-green-400 text-white",
    index: "bg-yellow-200 text-black",
    smallcap: "bg-red-400 text-white"
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderTable = (title, section, ids) => (
    <div className="border p-4 overflow-x-auto rounded-lg shadow-md bg-gray-100">
      <button
        onClick={() => toggleSection(section)}
        className={`font-bold w-full text-left text-lg p-2 rounded-md transition-all duration-300 ${toggleColors[section]}`}
      >
        {title} {openSections[section] ? "▲" : "▼"}
      </button>
      {openSections[section] && (
        <div className="bg-white p-2 rounded-lg mt-2">
          <table className="min-w-full border mt-2 text-center border-black">
            <thead>
              <tr className="bg-gray-300">
                <th className="border px-4 py-2 border-black">Date</th>
                {ids.map((id) => (
                  <th key={id} className="border px-4 py-2 border-black">
                    {fundData[id]?.name || "Loading"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fundData[ids[0]]?.tableData?.map((entry, index) => (
                <tr key={entry.date}>
                  <td className="border bg-gray-300 px-4 py-2 font-semibold border-black">{entry.date}</td>
                  {ids.map((id) => (
                    <td key={id} className="border px-4 py-2 border-black">
                      {fundData[id]?.tableData?.[index]?.dailyReturn || "-"}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {renderTable("Index Fund", "index", fundIds.slice(12, 16))}
      {renderTable("Flexi Cap Fund", "flexicap", fundIds.slice(4, 8))}
      {renderTable("MidCap Fund", "midcap", fundIds.slice(8, 12))}
      {renderTable("Small Fund", "smallcap", fundIds.slice(16, 20))}
      {renderTable("Healthcare Fund", "healthcare", fundIds.slice(0, 4))}
    </div>
  );
};

export default MutualFundComparison;
