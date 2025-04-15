import React, { useState } from "react";

// Dummy mutual fund NAV data for comparison
const mutualFundData = [
  { name: "Fund A", nav: [10, 10.5, 11, 10.8] },
  { name: "Fund B", nav: [12, 11.8, 12.2, 12.5] },
  { name: "Fund C", nav: [20, 20.5, 20.7, 21] },
];

const MutualFundComparison = () => {
  const calculateReturns = (navs) => {
    const returns = [];
    for (let i = 1; i < navs.length; i++) {
      const dailyReturn = ((navs[i] - navs[i - 1]) / navs[i - 1]) * 100;
      returns.push(dailyReturn.toFixed(2));
    }
    return returns;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-sm sm:text-base">
      <h2 className="text-xl font-bold mb-4 text-center">Mutual Fund NAV Comparison</h2>
      <table className="w-full table-auto border text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Fund</th>
            {["Day 1", "Day 2", "Day 3", "Day 4"].map((day, idx) => (
              <th key={idx} className="border px-2 py-1">{day}</th>
            ))}
            <th className="border px-2 py-1">Daily Returns (%)</th>
          </tr>
        </thead>
        <tbody>
          {mutualFundData.map((fund, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{fund.name}</td>
              {fund.nav.map((value, i) => (
                <td key={i} className="border px-2 py-1">{value}</td>
              ))}
              <td className="border px-2 py-1">
                {calculateReturns(fund.nav).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BetCalculator = () => {
  const [oddsTeamA, setOddsTeamA] = useState(0);
  const [oddsTeamB, setOddsTeamB] = useState(0);
  const totalUSDT = 23.5; // Fixed total amount in USDT

  const calculateBets = () => {
    if (oddsTeamA <= 0 || oddsTeamB <= 0) return null;

    const amountTeamB = (totalUSDT * oddsTeamA) / (oddsTeamA + oddsTeamB);
    const amountTeamA = totalUSDT - amountTeamB;

    const payoutTeamA = amountTeamA * oddsTeamA;
    const payoutTeamB = amountTeamB * oddsTeamB;
    const loss = Math.abs(payoutTeamA - payoutTeamB);

    return {
      amountTeamA,
      amountTeamB,
      payoutTeamA,
      payoutTeamB,
      loss: loss.toFixed(2),
    };
  };

  const result = calculateBets();

  return (
    <div className="p-4 max-w-md mx-auto text-sm sm:text-base">
      <h2 className="text-xl font-bold mb-4 text-center">Bet Calculator</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Odds for Team A:</label>
          <input
            type="number"
            value={oddsTeamA}
            onChange={(e) => setOddsTeamA(parseFloat(e.target.value))}
            className="w-full border px-2 py-1 rounded"
            placeholder="e.g., 2.1"
          />
        </div>

        <div>
          <label className="block font-medium">Odds for Team B:</label>
          <input
            type="number"
            value={oddsTeamB}
            onChange={(e) => setOddsTeamB(parseFloat(e.target.value))}
            className="w-full border px-2 py-1 rounded"
            placeholder="e.g., 1.9"
          />
        </div>
      </div>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Bet Allocation</h3>
          <table className="w-full table-auto text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Team</th>
                <th className="border px-2 py-1">Odds</th>
                <th className="border px-2 py-1">USDT</th>
                <th className="border px-2 py-1">USDT × Odds</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Team A</td>
                <td className="border px-2 py-1">{oddsTeamA}</td>
                <td className="border px-2 py-1">{result.amountTeamA.toFixed(2)}</td>
                <td className="border px-2 py-1">{(result.amountTeamA * oddsTeamA).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Team B</td>
                <td className="border px-2 py-1">{oddsTeamB}</td>
                <td className="border px-2 py-1">{result.amountTeamB.toFixed(2)}</td>
                <td className="border px-2 py-1">{(result.amountTeamB * oddsTeamB).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <p><strong>Total Investment:</strong> 23.5 USDT (≈ ₹2000)</p>
            <p><strong>Minimum Loss (approx):</strong> {result.loss} USDT</p>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <div className="min-h-screen bg-gray-50 text-gray-800 space-y-8 py-4">
    <MutualFundComparison />
    <hr className="border-gray-300" />
    <BetCalculator />
  </div>
);

export default App;
