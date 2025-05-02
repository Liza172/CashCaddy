"use client"
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { BarChart } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Bar, CartesianGrid, XAxis, YAxis } from 'recharts'


const DATE_RANGES = {
  "7D" : {label : "Last 7 Days", days : 7},
  "1M" : {label : "Last Month", days : 30},
  "3M" : {label : "Last 3 Months", days : 90},
  "6M" : {label : "Last 6 Months", days : 180},
  All : {label : "All Time", days : null},
};

function AccountChart({transactions}) {

  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() =>
  {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days 
    ? startOfDay(subDays(now, range.days))
    : startOfDay(new Date(0));

    //Filter Trabsaction within date range
    const filtered = transactions.filter(
    (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transactions) => {
      const date = format(new Date(transactions.date), "MMM dd")

      if(!acc[date])
      {
        acc[date] = {date, income : 0 , expense : 0}
      }

      if(transactions.type === "INCOME")
      {
        acc[date].income += transactions.amount;
      }
      else
      {
        acc[date].expence += transactions.amount;
      }
      return acc;
    }, {})
  
    //Convert to array and sort by date
    return Object.values(grouped).sort(
      (a,b) => new Date(a.date) - new Date(b.date)
    )
  }, [transactions, dateRange])
  
  console.log(filteredData);
  return (
    <div>
      {/* <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="uv" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % 20]} />
        ))}
      </Bar>
    </BarChart> */}
    </div>
  )
}

export default AccountChart