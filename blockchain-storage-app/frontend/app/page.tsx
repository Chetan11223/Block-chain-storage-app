'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionHistory } from '../components/TransactionHistory'
import { Dashboard } from '../components/Dashboard'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'history'>('dashboard')

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md card-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">
              Blockchain Storage App
            </CardTitle>
            <p className="text-gray-600">
              Optimized storage for Bank + Crypto transactions
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <ConnectButton />
            <div className="mt-6 text-sm text-gray-500">
              <p>Connect your wallet to get started</p>
              <p className="mt-2">Supports MetaMask, WalletConnect, and more</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Blockchain Storage App
            </h1>
            <p className="text-gray-600">
              Hybrid Bank + Crypto Transaction Management
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Badge variant="outline" className="text-green-600 border-green-600">
              Connected to Polygon
            </Badge>
            <ConnectButton />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('dashboard')}
            className="flex-1"
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'transactions' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('transactions')}
            className="flex-1"
          >
            New Transaction
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className="flex-1"
          >
            History
          </Button>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <TransactionForm />}
          {activeTab === 'history' && <TransactionHistory />}
        </div>
      </div>
    </div>
  )
}
