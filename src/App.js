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

const [oddsA, setOddsA] = useState(2.0);
const [oddsB, setOddsB] = useState(2.0);
const [amountInrA, setAmountInrA] = useState(0);
const [amountInrB, setAmountInrB] = useState(0);
const [amountUsdtA, setAmountUsdtA] = useState(0);
const [amountUsdtB, setAmountUsdtB] = useState(0);

const MutualFundComparison = () => {
  const [fundIds, setFundIds] = useState([
    "143874",
    "152082",
    "102823",
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
    "152713",
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
      const response = await fetch(https://api.mfapi.in/mf/${id});
      const data = await response.json();
      if (data && data.meta) {
        const fundH = data.meta.scheme_name;
        const fundHouse = fundH.slice(0, 28)
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
          return ${dd}-${mm}-${yyyy};
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
        className={font-bold w-full text-left text-lg p-2 rounded-md transition-all duration-300 ${toggleColors[section]}}
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
<div className="border p-4 rounded-lg shadow-md bg-white">
  <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Betting Calculator</h2>
  
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <div>
      <label className="font-semibold">Team A Odds</label>
      <input type="number" step="0.01" value={oddsA} onChange={(e) => setOddsA(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
    </div>
    <div>
      <label className="font-semibold">Team B Odds</label>
      <input type="number" step="0.01" value={oddsB} onChange={(e) => setOddsB(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
    </div>
    <div>
      <label className="font-semibold">Team A Bet (INR)</label>
      <input type="number" value={amountInrA} onChange={(e) => setAmountInrA(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
    </div>
    <div>
      <label className="font-semibold">Team B Bet (INR)</label>
      <input type="number" value={amountInrB} onChange={(e) => setAmountInrB(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
    </div>
    <div>
      <label className="font-semibold">Team A Bet (USDT)</label>
      <input type="number" value={amountUsdtA} onChange={(e) => setAmountUsdtA(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
    </div>
    <div>
      <label className="font-semibold">Team B Bet (USDT)</label>
      <input type="number" value={amountUsdtB} onChange={(e) => setAmountUsdtB(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
    </div>
  </div>

  <table className="min-w-full border text-center rounded-lg border-black">
    <thead className="bg-gray-200 text-black font-semibold">
      <tr>
        <th className="border px-4 py-2">Team</th>
        <th className="border px-4 py-2">Odds</th>
        <th className="border px-4 py-2">INR</th>
        <th className="border px-4 py-2">USDT</th>
        <th className="border px-4 py-2">USDT × Odds</th>
      </tr>
    </thead>
    <tbody>
      <tr className="bg-blue-50">
        <td className="border px-4 py-2 font-bold">Team A</td>
        <td className="border px-4 py-2">{oddsA}</td>
        <td className="border px-4 py-2">{amountInrA}</td>
        <td className="border px-4 py-2">{amountUsdtA}</td>
        <td className="border px-4 py-2">{(amountUsdtA * oddsA).toFixed(2)}</td>
      </tr>
      <tr className="bg-red-50">
        <td className="border px-4 py-2 font-bold">Team B</td>
        <td className="border px-4 py-2">{oddsB}</td>
        <td className="border px-4 py-2">{amountInrB}</td>
        <td className="border px-4 py-2">{amountUsdtB}</td>
        <td className="border px-4 py-2">{(amountUsdtB * oddsB).toFixed(2)}</td>
      </tr>
      <tr className="bg-yellow-100 font-bold">
        <td className="border px-4 py-2">Total Loss</td>
        <td className="border px-4 py-2">-</td>
        <td className="border px-4 py-2 text-red-600">{amountInrA + amountInrB}</td>
        <td className="border px-4 py-2 text-red-600">{(amountUsdtA + amountUsdtB).toFixed(2)}</td>
        <td className="border px-4 py-2">-</td>
      </tr>
      <tr className="bg-green-100 font-bold">
        <td className="border px-4 py-2">Profit if Both Win</td>
        <td className="border px-4 py-2">-</td>
        <td className="border px-4 py-2 text-green-700">
          {((amountInrA * oddsA + amountInrB * oddsB) - (amountInrA + amountInrB)).toFixed(2)}
        </td>
        <td className="border px-4 py-2 text-green-700">
          {((amountUsdtA * oddsA + amountUsdtB * oddsB) - (amountUsdtA + amountUsdtB)).toFixed(2)}
        </td>
        <td className="border px-4 py-2">-</td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
  );
};

export default MutualFundComparison;
