"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, Eye, MousePointerClick, Globe, TrendingUp, Calendar } from "lucide-react"

interface AnalyticsProps {
  isDarkMode?: boolean
}

// Mock GA4-style data
const generateMockData = () => {
  const today = new Date()
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews: Math.floor(Math.random() * 500) + 200,
      users: Math.floor(Math.random() * 300) + 100,
      sessions: Math.floor(Math.random() * 400) + 150,
    }
  })

  const topPages = [
    { page: "/", views: 1245, percentage: 35 },
    { page: "/projects", views: 892, percentage: 25 },
    { page: "/about", views: 534, percentage: 15 },
    { page: "/contact", views: 356, percentage: 10 },
    { page: "/resume", views: 267, percentage: 8 },
    { page: "/other", views: 178, percentage: 5 },
  ]

  const trafficSources = [
    { name: "Direct", value: 45, color: "#3b82f6" },
    { name: "Social", value: 25, color: "#8b5cf6" },
    { name: "Search", value: 20, color: "#10b981" },
    { name: "Referral", value: 10, color: "#f59e0b" },
  ]

  const devices = [
    { name: "Desktop", value: 65, color: "#3b82f6" },
    { name: "Mobile", value: 30, color: "#8b5cf6" },
    { name: "Tablet", value: 5, color: "#10b981" },
  ]

  const topCountries = [
    { country: "United States", users: 1245, flag: "🇺🇸" },
    { country: "United Kingdom", users: 456, flag: "🇬🇧" },
    { country: "Canada", users: 234, flag: "🇨🇦" },
    { country: "Germany", users: 189, flag: "🇩🇪" },
    { country: "Australia", users: 156, flag: "🇦🇺" },
  ]

  return {
    overview: {
      totalUsers: 3456,
      totalPageViews: 12345,
      totalSessions: 8923,
      avgSessionDuration: "2m 34s",
      bounceRate: 42.5,
      newUsers: 2341,
      returningUsers: 1115,
    },
    timeSeries: last30Days,
    topPages,
    trafficSources,
    devices,
    topCountries,
  }
}

export default function Analytics({ isDarkMode = true }: AnalyticsProps) {
  const [dateRange, setDateRange] = useState("30d")
  const data = useMemo(() => generateMockData(), [])

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-50"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const gridColor = isDarkMode ? "#374151" : "#e5e7eb"

  return (
    <div className={`h-full ${bgColor} ${textColor} overflow-auto relative`}>
      <div className="p-6 space-y-6">
        {/* Header - Keep this unblurred */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-bold mb-1">Analytics Dashboard</h1>
            <p className="text-sm opacity-70">Portfolio website metrics & user insights</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={`px-3 py-1.5 rounded-lg ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border ${textColor} text-sm`}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Construction Icon Overlay */}
        <div className="relative z-20 flex flex-col items-center justify-center py-16">
          {/* Custom Construction Icon */}
          <div className="mb-6">
            <svg width="300" height="120" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Construction Barrier */}
              <rect x="10" y="40" width="280" height="14" fill="#1f2937" rx="2"/>
              <rect x="10" y="62" width="280" height="14" fill="#1f2937" rx="2"/>
              
              {/* Yellow/Black Stripes - Top Bar */}
              <rect x="10" y="40" width="20" height="14" fill="#fbbf24"/>
              <rect x="30" y="40" width="20" height="14" fill="#1f2937"/>
              <rect x="50" y="40" width="20" height="14" fill="#fbbf24"/>
              <rect x="70" y="40" width="20" height="14" fill="#1f2937"/>
              <rect x="90" y="40" width="20" height="14" fill="#fbbf24"/>
              <rect x="110" y="40" width="20" height="14" fill="#1f2937"/>
              <rect x="130" y="40" width="20" height="14" fill="#fbbf24"/>
              <rect x="150" y="40" width="20" height="14" fill="#1f2937"/>
              <rect x="170" y="40" width="20" height="14" fill="#fbbf24"/>
              <rect x="190" y="40" width="20" height="14" fill="#1f2937"/>
              <rect x="210" y="40" width="20" height="14" fill="#fbbf24"/>
              <rect x="230" y="40" width="20" height="14" fill="#1f2937"/>
              <rect x="250" y="40" width="20" height="14" fill="#fbbf24"/>
              <rect x="270" y="40" width="20" height="14" fill="#1f2937"/>
              
              {/* Yellow/Black Stripes - Bottom Bar */}
              <rect x="10" y="62" width="20" height="14" fill="#fbbf24"/>
              <rect x="30" y="62" width="20" height="14" fill="#1f2937"/>
              <rect x="50" y="62" width="20" height="14" fill="#fbbf24"/>
              <rect x="70" y="62" width="20" height="14" fill="#1f2937"/>
              <rect x="90" y="62" width="20" height="14" fill="#fbbf24"/>
              <rect x="110" y="62" width="20" height="14" fill="#1f2937"/>
              <rect x="130" y="62" width="20" height="14" fill="#fbbf24"/>
              <rect x="150" y="62" width="20" height="14" fill="#1f2937"/>
              <rect x="170" y="62" width="20" height="14" fill="#fbbf24"/>
              <rect x="190" y="62" width="20" height="14" fill="#1f2937"/>
              <rect x="210" y="62" width="20" height="14" fill="#fbbf24"/>
              <rect x="230" y="62" width="20" height="14" fill="#1f2937"/>
              <rect x="250" y="62" width="20" height="14" fill="#fbbf24"/>
              <rect x="270" y="62" width="20" height="14" fill="#1f2937"/>
              
              {/* Support Posts */}
              <rect x="10" y="40" width="8" height="50" fill="#374151" rx="1"/>
              <rect x="282" y="40" width="8" height="50" fill="#374151" rx="1"/>
            </svg>
          </div>
          
          {/* Message */}
          <p className="text-lg font-semibold text-center max-w-md">
            Sorry, Google Analytics integration is under construction right now
          </p>
        </div>

        {/* Blurred Content */}
        <div className="blur-md pointer-events-none opacity-30">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${cardBg} ${borderColor} border rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">Total Users</span>
              <Users className="w-5 h-5 opacity-70" />
            </div>
            <div className="text-2xl font-bold">{data.overview.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-green-500 mt-1">+12.5% from last period</div>
          </div>

          <div className={`${cardBg} ${borderColor} border rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">Page Views</span>
              <Eye className="w-5 h-5 opacity-70" />
            </div>
            <div className="text-2xl font-bold">{data.overview.totalPageViews.toLocaleString()}</div>
            <div className="text-xs text-green-500 mt-1">+8.3% from last period</div>
          </div>

          <div className={`${cardBg} ${borderColor} border rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">Sessions</span>
              <MousePointerClick className="w-5 h-5 opacity-70" />
            </div>
            <div className="text-2xl font-bold">{data.overview.totalSessions.toLocaleString()}</div>
            <div className="text-xs text-green-500 mt-1">+15.2% from last period</div>
          </div>

          <div className={`${cardBg} ${borderColor} border rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-70">Bounce Rate</span>
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <div className="text-2xl font-bold">{data.overview.bounceRate}%</div>
            <div className="text-xs text-red-500 mt-1">-2.1% from last period</div>
          </div>
        </div>

        {/* Time Series Chart */}
        <div className={`${cardBg} ${borderColor} border rounded-lg p-6`}>
          <h2 className="text-lg font-semibold mb-4">Traffic Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="pageViews" stroke="#3b82f6" name="Page Views" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#8b5cf6" name="Users" strokeWidth={2} />
              <Line type="monotone" dataKey="sessions" stroke="#10b981" name="Sessions" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Row - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6`}>
            <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.topPages}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="page" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="views" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Sources */}
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6`}>
            <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Devices */}
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6`}>
            <h2 className="text-lg font-semibold mb-4">Devices</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.devices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Countries */}
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6`}>
            <h2 className="text-lg font-semibold mb-4">Top Countries</h2>
            <div className="space-y-3">
              {data.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="text-sm">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(country.users / data.topCountries[0].users) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{country.users.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Segments */}
        <div className={`${cardBg} ${borderColor} border rounded-lg p-6`}>
          <h2 className="text-lg font-semibold mb-4">User Segments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{data.overview.newUsers.toLocaleString()}</div>
              <div className="text-sm opacity-70 mt-1">New Users</div>
              <div className="text-xs text-green-500 mt-1">67.7% of total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">{data.overview.returningUsers.toLocaleString()}</div>
              <div className="text-sm opacity-70 mt-1">Returning Users</div>
              <div className="text-xs text-green-500 mt-1">32.3% of total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{data.overview.avgSessionDuration}</div>
              <div className="text-sm opacity-70 mt-1">Avg. Session Duration</div>
              <div className="text-xs text-green-500 mt-1">+5.2% from last period</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
