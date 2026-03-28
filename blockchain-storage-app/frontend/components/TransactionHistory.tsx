'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface Transaction {
  id: string
  type: 'bank' | 'crypto' | 'hybrid'
  amount: string
  recipient: string
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
  hash: string
  gasUsed?: string
}

export function TransactionHistory() {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'bank' | 'crypto' | 'hybrid'>('all')

  useEffect(() => {
    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'bank',
        amount: '₹5,000',
        recipient: 'user@upi',
        timestamp: '2024-03-28 10:30:00',
        status: 'completed',
        hash: '0x1234...5678',
        gasUsed: '0.001'
      },
      {
        id: '2',
        type: 'crypto',
        amount: '0.5 ETH',
        recipient: '0x9876...5432',
        timestamp: '2024-03-28 11:45:00',
        status: 'completed',
        hash: '0xabcd...efgh',
        gasUsed: '0.002'
      },
      {
        id: '3',
        type: 'hybrid',
        amount: '₹10,000 → 0.2 ETH',
        recipient: '0x1111...2222',
        timestamp: '2024-03-28 12:15:00',
        status: 'pending',
        hash: '0x3333...4444',
        gasUsed: '0.003'
      },
      {
        id: '4',
        type: 'bank',
        amount: '₹2,500',
        recipient: 'merchant@upi',
        timestamp: '2024-03-28 13:00:00',
        status: 'completed',
        hash: '0x5555...6666',
        gasUsed: '0.001'
      },
      {
        id: '5',
        type: 'crypto',
        amount: '1.0 ETH',
        recipient: '0x7777...8888',
        timestamp: '2024-03-28 14:30:00',
        status: 'failed',
        hash: '0x9999...0000',
        gasUsed: '0.002'
      }
    ]
    setTransactions(mockTransactions)
  }, [address])

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'default'
      case 'failed': return 'destructive'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bank': return '🏦'
      case 'crypto': return '🪙'
      case 'hybrid': return '🔄'
      default: return '📄'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-2xl gradient-text">
              Transaction History
            </CardTitle>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'bank', 'crypto', 'hybrid'] as const).map((type) => (
                <Badge
                  key={type}
                  variant={filter === type ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter(type)}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found for the selected filter.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
                      <div>
                        <div className="font-medium">{transaction.amount}</div>
                        <div className="text-sm text-gray-500">
                          To: {transaction.recipient}
                        </div>
                        <div className="text-xs text-gray-400">
                          {transaction.timestamp}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-2">
                      <Badge variant={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        <div>Hash: {transaction.hash}</div>
                        {transaction.gasUsed && (
                          <div>Gas: {transaction.gasUsed} ETH</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {transactions.filter(t => t.type === 'bank').length}
                </div>
                <div className="text-sm text-gray-500">Bank</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.type === 'crypto').length}
                </div>
                <div className="text-sm text-gray-500">Crypto</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {transactions.filter(t => t.type === 'hybrid').length}
                </div>
                <div className="text-sm text-gray-500">Hybrid</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {transactions.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
