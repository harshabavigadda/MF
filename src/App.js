import React, { useState } from "react";

const BetCalculator = () => {
  const [oddsTeamA, setOddsTeamA] = useState("");
  const [oddsTeamB, setOddsTeamB] = useState("");
  const totalUSDT = 23.5;
  const inrPerUSDT = 85; // Approx conversion

  const calculateBets = () => {
    const oddsA = parseFloat(oddsTeamA);
    const oddsB = parseFloat(oddsTeamB);

    if (oddsA <= 0 || oddsB <= 0 || isNaN(oddsA) || isNaN(oddsB)) return null;

    // Equate payouts: A_amt * A_odds = B_amt * B_odds, A_amt + B_amt = totalUSDT
    const amountB = (totalUSDT * oddsA) / (oddsA + oddsB);
    const amountA = totalUSDT - amountB;

    const payoutA = amountA * oddsA;
    const payoutB = amountB * oddsB;
    const minPayout = Math.min(payoutA, payoutB);
    const loss = (totalUSDT - minPayout);

    return {
      amountA,
      amountB,
      payoutA,
      payoutB,
      loss,
    };
  };

  const result = calculateBets();

  return (
    <div className="p-4 max-w-md mx-auto text-sm sm:text-base">
      <h2 className="text-xl font-bold mb-4 text-center">USDT Bet Calculator</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Odds for Team A:</label>
          <input
            type="number"
            value={oddsTeamA}
            onChange={(e) => setOddsTeamA(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="e.g., 2.1"
          />
        </div>

        <div>
          <label className="block font-medium">Odds for Team B:</label>
          <input
            type="number"
            value={oddsTeamB}
            onChange={(e) => setOddsTeamB(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="e.g., 1.9"
          />
        </div>
      </div>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-center">Bet Allocation</h3>
          <table className="w-full text-sm table-auto border">
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
                <td className="border px-2 py-1">{parseFloat(oddsTeamA)}</td>
                <td className="border px-2 py-1">{result.amountA.toFixed(2)}</td>
                <td className="border px-2 py-1">{result.payoutA.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Team B</td>
                <td className="border px-2 py-1">{parseFloat(oddsTeamB)}</td>
                <td className="border px-2 py-1">{result.amountB.toFixed(2)}</td>
                <td className="border px-2 py-1">{result.payoutB.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 space-y-1 text-sm">
            <p><strong>Total Investment:</strong> 23.5 USDT (≈ ₹{(totalUSDT * inrPerUSDT).toFixed(0)})</p>
            <p><strong>Minimum Loss:</strong> {result.loss.toFixed(2)} USDT (≈ ₹{(result.loss * inrPerUSDT).toFixed(0)})</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetCalculator;
