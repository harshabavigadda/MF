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
    "143874",
    "152082",
    "119783",
    "118759",
    "122639",
    "118955",
    "120492",
    "120843",
    "140228",
    "119775",
    "118989",
    "127042",
    "147666",
    "120716",
    "143341",
    "149870",
    "120828",
    "125354",
    "118778",
    "125497",
  ]);
  const [fundData, setFundData] = useState({});
  const [openSections, setOpenSections] = useState({
    healthcare: false,
    flexicap: false,
    midcap: false,
    index: false,
    smallcap: false,
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
            const prevNav =
              index < arr.length - 1 ? parseFloat(arr[index + 1].nav) : null;
            const currNav = parseFloat(entry.nav);
            const dailyReturn = prevNav
              ? ((currNav - prevNav) / prevNav) * 100
              : 0;
            return { date: entry.date, dailyReturn: dailyReturn.toFixed(2) };
          })
          .reverse();

        let last30Days = processedData.slice(-30);
        
        const actdate = (last30Days, time) => {
        function formatDate(date) {
          let dd = date.getDate().toString().padStart(2, "0");
          let mm = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
          let yyyy = date.getFullYear();
          return `${dd}-${mm}-${yyyy}`;
        }

        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(startDate.getDate() - time);
        startDate = formatDate(startDate)
        endDate = formatDate(endDate)

        function parseDate(dateStr) {
          const [dd, mm, yyyy] = dateStr.split("-").map(Number);
          return new Date(yyyy, mm - 1, dd); // Months are 0-based in JS
        }

        const start = parseDate(startDate);
        const end = parseDate(endDate);
        const filteredDates = last30Days.filter((dateStr) => {
          const date = parseDate(dateStr.date);
          return date <= start && date >= end;
        });

        return filteredDates;}

        last30Days = actdate(last30Days, 33);

        let last3Months = processedData.slice(-90);
        last3Months = actdate(last3Months, 93);
        
        let last6Months = processedData.slice(-180);
        last6Months = actdate(last6Months, 183);

        let last1yr = processedData.slice(-365);
        last1yr = actdate(last1yr, 368);

        let last2yr = processedData.slice(-720);
        last2yr = actdate(last2yr, 723);

        let last3yr = processedData.slice(-1080);
        last3yr = actdate(last3yr, 1083);

        let last4yr = processedData.slice(-1440);
        last4yr = actdate(last4yr, 1443);

        let last5yr = processedData.slice(-1800);
        last5yr = actdate(last5yr, 1803);

        setFundData((prev) => ({
          ...prev,
          [id]: {
            name: fundHouse,
            tableData: last30Days,
            tm: last3Months,
            sm : last6Months,
            oy: last1yr,
            ty: last2yr,
            thy: last3yr,
            fy: last4yr,
            fvy: last5yr 
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
    smallcap: "bg-red-400 text-white",
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
                  <td className="border bg-gray-300 px-4 py-2 font-semibold border-black">
                    {entry.date}
                  </td>
                  {ids.map((id) => (
                    <td key={id} className="border px-4 py-2 border-black">
                      {fundData[id]?.tableData?.[index]?.dailyReturn || "-"}%
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                <td className="border px-4 py-2 border-black">1 Month</td>
                {ids.map((id) => {
                  const totalReturn = fundData[id]?.tableData
                    ?.reduce(
                      (sum, entry) => sum + parseFloat(entry.dailyReturn || 0),
                      0
                    )
                    .toFixed(2);
                  return (
                    <td key={id} className="border px-4 py-2 border-black">
                      {totalReturn || "-"}%
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gray-200 font-bold">
                <td className="border px-4 py-2 border-black">3 Months</td>
                {ids.map((id) => {
                  const totalReturn = fundData[id]?.tm
                    ?.reduce(
                      (sum, entry) => sum + parseFloat(entry.dailyReturn || 0),
                      0
                    )
                    .toFixed(2);
                  return (
                    <td key={id} className="border px-4 py-2 border-black">
                      {totalReturn || "-"}%
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gray-200 font-bold">
                <td className="border px-4 py-2 border-black">6 Months</td>
                {ids.map((id) => {
                  const totalReturn = fundData[id]?.sm
                    ?.reduce(
                      (sum, entry) => sum + parseFloat(entry.dailyReturn || 0),
                      0
                    )
                    .toFixed(2);
                  return (
                    <td key={id} className="border px-4 py-2 border-black">
                      {totalReturn || "-"}%
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gray-200 font-bold">
                <td className="border px-4 py-2 border-black">1 Year</td>
                {ids.map((id) => {
                  const totalReturn = fundData[id]?.oy
                    ?.reduce(
                      (sum, entry) => sum + parseFloat(entry.dailyReturn || 0),
                      0
                    )
                    .toFixed(2);
                  return (
                    <td key={id} className="border px-4 py-2 border-black">
                      {totalReturn || "-"}%
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gray-200 font-bold">
                <td className="border px-4 py-2 border-black">2 Years</td>
                {ids.map((id) => {
                  const totalReturn = fundData[id]?.ty
                    ?.reduce(
                      (sum, entry) => sum + parseFloat(entry.dailyReturn || 0),
                      0
                    )
                    .toFixed(2);
                  return (
                    <td key={id} className="border px-4 py-2 border-black">
                      {totalReturn || "-"}%
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gray-200 font-bold">
                <td className="border px-4 py-2 border-black">3 Years</td>
                {ids.map((id) => {
                  const totalReturn = fundData[id]?.thy
                    ?.reduce(
                      (sum, entry) => sum + parseFloat(entry.dailyReturn || 0),
                      0
                    )
                    .toFixed(2);
                  return (
                    <td key={id} className="border px-4 py-2 border-black">
                      {totalReturn || "-"}%
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gray-200 font-bold">
                <td className="border px-4 py-2 border-black">4 Years</td>
                {ids.map((id) => {
                  const totalReturn = fundData[id]?.fy
                    ?.reduce(
                      (sum, entry) => sum + parseFloat(entry.dailyReturn || 0),
                      0
                    )
                    .toFixed(2);
                  return (
                    <td key={id} className="border px-4 py-2 border-black">
                      {totalReturn || "-"}%
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gray-200 font-bold">
                <td className="border px-4 py-2 border-black">5 Years</td>
                {ids.map((id) => {
                  const totalReturn = fundData[id]?.fvy
                    ?.reduce(
                      (sum, entry) => sum + parseFloat(entry.dailyReturn || 0),
                      0
                    )
                    .toFixed(2);
                  return (
                    <td key={id} className="border px-4 py-2 border-black">
                      {totalReturn || "-"}%
                    </td>
                  );
                })}
              </tr>
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
