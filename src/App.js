import React, { useState } from "react";

const BetCalculator = () => {
  const [oddsTeamA, setOddsTeamA] = useState(0);
  const [oddsTeamB, setOddsTeamB] = useState(0);
  const totalUSDT = 23.5; // Fixed total amount in USDT

  const calculateBets = () => {
    if (oddsTeamA <= 0 || oddsTeamB <= 0) return null;

    // Solve for x and y such that x + y = totalUSDT and x * oddsA = y * oddsB
    const amountTeamB = (totalUSDT * oddsTeamA) / (oddsTeamA + oddsTeamB);
    const amountTeamA = totalUSDT - amountTeamB;

    const payoutTeamA = amountTeamA * oddsTeamA;
    const payoutTeamB = amountTeamB * oddsTeamB;
    const loss = totalUSDT - (payoutTeamA + payoutTeamB)/2;
    const profit = payoutTeamA + payoutTeamB - totalUSDT;
    //const pinr = profit*85,
    return {
      amountTeamA,
      amountTeamB,
      payoutTeamA,
      payoutTeamB,
      loss: loss.toFixed(2),
      profit: profit.toFixed(3),
     // pinr,
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
            <p><strong>Minimum_Loss (approx):</strong> {result.loss} USDT</p>
            //<p><strong>Max Profit (approx):</strong> { result.profit } USDT ≈ ₹{result.pinr}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetCalculator;
