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
  ])
  const [fundData, setFundData] = useState({})
  const [openSections, setOpenSections] = useState({
    healthcare: false,
    flexicap: false,
    midcap: false,
    index: false,
    smallcap: false,
  })
  const [odds, setOdds] = useState({ team1: 1.5, team2: 2.2 })
  const [amount, setAmount] = useState({ inr: 1000, usdt: 10 })

  useEffect(() => {
    fundIds.forEach(fetchFundData)
  }, [])

  const fetchFundData = async (id) => {
    try {
      const response = await fetch(`https://api.mfapi.in/mf/${id}`)
      const data = await response.json()
      if (data && data.meta) {
        const fundH = data.meta.scheme_name
        const fundHouse = fundH.slice(0, 28)
        const processedData = data.data
          .map((entry, index, arr) => {
            const prevNav =
              index < arr.length - 1 ? parseFloat(arr[index + 1].nav) : null
            const currNav = parseFloat(entry.nav)
            const dailyReturn = prevNav
              ? ((currNav - prevNav) / prevNav) * 100
              : 0
            return { date: entry.date, dailyReturn: dailyReturn.toFixed(2) }
          })
          .reverse()

        let last30Days = processedData.slice(-30)

        const actdate = (last30Days, time) => {
          function formatDate(date) {
            let dd = date.getDate().toString().padStart(2, "0")
            let mm = (date.getMonth() + 1).toString().padStart(2, "0")
            let yyyy = date.getFullYear()
            return `${dd}-${mm}-${yyyy}`
          }

          let startDate = new Date()
          let endDate = new Date()
          endDate.setDate(startDate.getDate() - time)
          startDate = formatDate(startDate)
          endDate = formatDate(endDate)

          function parseDate(dateStr) {
            const [dd, mm, yyyy] = dateStr.split("-").map(Number)
            return new Date(yyyy, mm - 1, dd)
          }

          const start = parseDate(startDate)
          const end = parseDate(endDate)
          const filteredDates = last30Days.filter((dateStr) => {
            const date = parseDate(dateStr.date)
            return date <= start && date >= end
          })

          return filteredDates
        }

        last30Days = actdate(last30Days, 33)
        let last3Months = actdate(processedData.slice(-90), 93)
        let last6Months = actdate(processedData.slice(-180), 183)
        let last1yr = actdate(processedData.slice(-365), 368)
        let last2yr = actdate(processedData.slice(-720), 723)
        let last3yr = actdate(processedData.slice(-1080), 1083)
        let last4yr = actdate(processedData.slice(-1440), 1443)
        let last5yr = actdate(processedData.slice(-1800), 1803)

        setFundData((prev) => ({
          ...prev,
          [id]: {
            name: fundHouse,
            tableData: last30Days,
            tm: last3Months,
            sm: last6Months,
            oy: last1yr,
            ty: last2yr,
            thy: last3yr,
            fy: last4yr,
            fvy: last5yr,
          },
        }))
      }
    } catch (error) {
      console.error("Error fetching fund data:", error)
    }
  }

  const toggleColors = {
    healthcare: "bg-gray-400 text-black",
    flexicap: "bg-blue-400 text-white",
    midcap: "bg-green-400 text-white",
    index: "bg-yellow-200 text-black",
    smallcap: "bg-red-400 text-white",
  }

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const renderBettingTable = () => {
    const { team1, team2 } = odds
    const { inr, usdt } = amount
    const bet1 = ((team2 * inr) / (team1 + team2)).toFixed(2)
    const bet2 = (inr - bet1).toFixed(2)
    const loss = (inr - Math.min(bet1, bet2)).toFixed(2)

    return (
      <div className="p-4 border bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Betting Allocation</h2>
        <table className="table-auto w-full border border-black text-center">
          <thead className="bg-gray-300">
            <tr>
              <th className="border px-4 py-2">Team</th>
              <th className="border px-4 py-2">Odds</th>
              <th className="border px-4 py-2">Bet Amount (INR)</th>
              <th className="border px-4 py-2">Bet Amount (USDT)</th>
              <th className="border px-4 py-2">USDT × Odds</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Team 1 ({team1})</td>
              <td className="border px-4 py-2">{team1}</td>
              <td className="border px-4 py-2">{bet1}</td>
              <td className="border px-4 py-2">{(bet1 / inr * usdt).toFixed(2)}</td>
              <td className="border px-4 py-2">{((bet1 / inr) * usdt * team1).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Team 2 ({team2})</td>
              <td className="border px-4 py-2">{team2}</td>
              <td className="border px-4 py-2">{bet2}</td>
              <td className="border px-4 py-2">{(bet2 / inr * usdt).toFixed(2)}</td>
              <td className="border px-4 py-2">{((bet2 / inr) * usdt * team2).toFixed(2)}</td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td colSpan="2" className="border px-4 py-2">Rounded Loss</td>
              <td className="border px-4 py-2">₹{loss}</td>
              <td className="border px-4 py-2" colSpan="2">${(loss / inr * usdt).toFixed(2)} USDT</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

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
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {renderBettingTable()}
      {renderTable("Index Fund", "index", fundIds.slice(12, 16))}
      {renderTable("Flexi Cap Fund", "flexicap", fundIds.slice(4, 8))}
      {renderTable("MidCap Fund", "midcap", fundIds.slice(8, 12))}
      {renderTable("Small Fund", "smallcap", fundIds.slice(16, 20))}
      {renderTable("Healthcare Fund", "healthcare", fundIds.slice(0, 4))}
    </div>
  )
}

export default MutualFundComparison
