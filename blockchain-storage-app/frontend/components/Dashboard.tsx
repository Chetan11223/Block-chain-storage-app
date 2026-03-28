'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

export function Dashboard() {
  const { address } = useAccount()
  const [stats, setStats] = useState({
    totalTransactions: 0,
    bankTransactions: 0,
    cryptoTransactions: 0,
    hybridTransactions: 0,
    gasSaved: 0
  })

  useEffect(() => {
    // Mock data for demo
    setStats({
      totalTransactions: 156,
      bankTransactions: 45,
      cryptoTransactions: 78,
      hybridTransactions: 33,
      gasSaved: 85.6
    })
  }, [address])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <Badge variant="outline" className="text-blue-600">All Time</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bank Transactions</CardTitle>
          <Badge variant="success">UPI/Razorpay</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.bankTransactions}</div>
          <p className="text-xs text-muted-foreground">
            +8% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Crypto Transactions</CardTitle>
          <Badge variant="outline">MetaMask</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.cryptoTransactions}</div>
          <p className="text-xs text-muted-foreground">
            +15% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hybrid Transactions</CardTitle>
          <Badge variant="default">Bank↔Crypto</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hybridTransactions}</div>
          <p className="text-xs text-muted-foreground">
            +25% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gas Saved</CardTitle>
          <Badge variant="success">Optimized</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.gasSaved}%</div>
          <p className="text-xs text-muted-foreground">
            Via batching & compression
          </p>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network</CardTitle>
          <Badge variant="outline">Layer 2</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Polygon</div>
          <p className="text-xs text-muted-foreground">
            Low cost, fast transactions
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
