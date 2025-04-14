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
    "143874", "152082", "102823", "118759",
    "122639", "118955", "120492", "120843",
    "140228", "119775", "118989", "127042",
    "147666", "120716", "152713", "149870",
    "120828", "125354", "118778", "125497",
  ]);

  const [fundData, setFundData] = useState({});
  const [openSections, setOpenSections] = useState({
    healthcare: false,
    flexicap: false,
    midcap: false,
    index: false,
    smallcap: false,
  });

  const [betInputs, setBetInputs] = useState({
    teamA: { odds: "", amount: "" },
    teamB: { odds: "", amount: "" },
  });

  const handleInputChange = (team, field, value) => {
    setBetInputs((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        [field]: value,
      },
    }));
  };

  const calculateBets = () => {
    const { teamA, teamB } = betInputs;
    const oddsA = parseFloat(teamA.odds);
    const oddsB = parseFloat(teamB.odds);
    const amtA = parseFloat(teamA.amount);
    const amtB = parseFloat(teamB.amount);

    const total = amtA + amtB;

    return {
      totalInvestment: total.toFixed(2),
      loss: (Math.abs(amtA - amtB)).toFixed(2),
      profitIfBothWin: ((amtA * oddsA + amtB * oddsB) - total).toFixed(2),
      oddsProductA: (amtA * oddsA).toFixed(2),
      oddsProductB: (amtB * oddsB).toFixed(2),
    };
  };

  const betResults = calculateBets();

  useEffect(() => {
    fundIds.forEach(fetchFundData);
  }, []);

  const fetchFundData = async (id) => {
    try {
      const response = await fetch(`https://api.mfapi.in/mf/${id}`);
      const data = await response.json();
      if (data && data.meta) {
        const fundH = data.meta.scheme_name;
        const fundHouse = fundH.slice(0, 28);
        const processedData = data.data.map((entry, index, arr) => {
          const prevNav =
            index < arr.length - 1 ? parseFloat(arr[index + 1].nav) : null;
          const currNav = parseFloat(entry.nav);
          const dailyReturn = prevNav ? ((currNav - prevNav) / prevNav) * 100 : 0;
          return { date: entry.date, dailyReturn: dailyReturn.toFixed(2) };
        }).reverse();

        const actdate = (lastData, time) => {
          const formatDate = (date) => {
            let dd = date.getDate().toString().padStart(2, "0");
            let mm = (date.getMonth() + 1).toString().padStart(2, "0");
            let yyyy = date.getFullYear();
            return `${dd}-${mm}-${yyyy}`;
          };
          let startDate = new Date();
          let endDate = new Date();
          endDate.setDate(startDate.getDate() - time);
          const parseDate = (str) => {
            const [dd, mm, yyyy] = str.split("-").map(Number);
            return new Date(yyyy, mm - 1, dd);
          };
          return lastData.filter((e) => {
            const d = parseDate(e.date);
            return d <= startDate && d >= endDate;
          });
        };

        setFundData((prev) => ({
          ...prev,
          [id]: {
            name: fundHouse,
            tableData: actdate(processedData.slice(-30), 33),
            tm: actdate(processedData.slice(-90), 93),
            sm: actdate(processedData.slice(-180), 183),
            oy: actdate(processedData.slice(-365), 368),
            ty: actdate(processedData.slice(-720), 723),
            thy: actdate(processedData.slice(-1080), 1083),
            fy: actdate(processedData.slice(-1440), 1443),
            fvy: actdate(processedData.slice(-1800), 1803),
          },
        }));
      }
    } catch (err) {
      console.error("Error fetching fund data:", err);
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
          <table className="min-w-full border text-xs sm:text-sm border-black text-center">
            <thead>
              <tr className="bg-gray-300">
                <th className="border px-2 py-1 border-black">Date</th>
                {ids.map((id) => (
                  <th key={id} className="border px-2 py-1 border-black">
                    {fundData[id]?.name || "Loading"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fundData[ids[0]]?.tableData?.map((entry, index) => (
                <tr key={entry.date}>
                  <td className="border bg-gray-300 px-2 py-1 font-semibold border-black">
                    {entry.date}
                  </td>
                  {ids.map((id) => (
                    <td key={id} className="border px-2 py-1 border-black">
                      {fundData[id]?.tableData?.[index]?.dailyReturn || "-"}%
                    </td>
                  ))}
                </tr>
              ))}
              {["1 Month", "3 Months", "6 Months", "1 Year", "2 Years", "3 Years", "4 Years", "5 Years"].map((label, idx) => {
                const keys = ["tableData", "tm", "sm", "oy", "ty", "thy", "fy", "fvy"];
                return (
                  <tr key={label} className="bg-gray-200 font-bold">
                    <td className="border px-2 py-1 border-black">{label}</td>
                    {ids.map((id) => {
                      const total = fundData[id]?.[keys[idx]]?.reduce((sum, entry) => sum + parseFloat(entry.dailyReturn || 0), 0).toFixed(2);
                      return (
                        <td key={id} className="border px-2 py-1 border-black">{total || "-"}%</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <div className="border p-4 rounded-md bg-white shadow">
        <h2 className="text-lg font-bold mb-2">Bet Odds Calculator</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {["teamA", "teamB"].map((team) => (
            <div key={team} className="space-y-2">
              <label className="block font-semibold capitalize">{team}</label>
              <input
                type="number"
                step="any"
                placeholder="Odds"
                className="w-full p-2 border rounded"
                value={betInputs[team].odds}
                onChange={(e) => handleInputChange(team, "odds", e.target.value)}
              />
              <input
                type="number"
                step="any"
                placeholder="Amount (USDT)"
                className="w-full p-2 border rounded"
                value={betInputs[team].amount}
                onChange={(e) => handleInputChange(team, "amount", e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold">Results:</h3>
          <table className="w-full border mt-2 text-sm text-center border-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Metric</th>
                <th className="border p-2">Value (USDT)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border p-2">Total Investment</td><td className="border p-2">{betResults.totalInvestment}</td></tr>
              <tr><td className="border p-2">Loss</td><td className="border p-2">{betResults.loss}</td></tr>
              <tr><td className="border p-2">Profit if Both Win</td><td className="border p-2">{betResults.profitIfBothWin}</td></tr>
              <tr><td className="border p-2">Team A Odds × Amount</td><td className="border p-2">{betResults.oddsProductA}</td></tr>
              <tr><td className="border p-2">Team B Odds × Amount</td><td className="border p-2">{betResults.oddsProductB}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {renderTable("Index Fund", "index", fundIds.slice(12, 16))}
      {renderTable("Flexi Cap Fund", "flexicap", fundIds.slice(4, 8))}
      {renderTable("MidCap Fund", "midcap", fundIds.slice(8, 12))}
      {renderTable("Small Fund", "smallcap", fundIds.slice(16, 20))}
      {renderTable("Healthcare Fund", "healthcare", fundIds.slice(0, 4))}
    </div>
  );
};

export default MutualFundComparison;
