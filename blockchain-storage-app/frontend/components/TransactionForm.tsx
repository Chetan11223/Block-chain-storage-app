'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'

export function TransactionForm() {
  const { address } = useAccount()
  const [transactionType, setTransactionType] = useState<'bank' | 'crypto' | 'hybrid'>('bank')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleBankTransaction = async () => {
    setIsLoading(true)
    // Simulate UPI/Razorpay transaction
    setTimeout(() => {
      alert('Bank transaction simulated! In production, this would integrate with UPI/Razorpay API.')
      setIsLoading(false)
    }, 2000)
  }

  const handleCryptoTransaction = async () => {
    setIsLoading(true)
    // Simulate MetaMask transaction
    setTimeout(() => {
      alert('Crypto transaction simulated! In production, this would use MetaMask wallet.')
      setIsLoading(false)
    }, 2000)
  }

  const handleHybridTransaction = async () => {
    setIsLoading(true)
    // Simulate hybrid transaction
    setTimeout(() => {
      alert('Hybrid transaction simulated! Bank → Crypto conversion.')
      setIsLoading(false)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !recipient) {
      alert('Please fill in all required fields')
      return
    }

    switch (transactionType) {
      case 'bank':
        await handleBankTransaction()
        break
      case 'crypto':
        await handleCryptoTransaction()
        break
      case 'hybrid':
        await handleHybridTransaction()
        break
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-2xl gradient-text">
            Create New Transaction
          </CardTitle>
          <p className="text-gray-600">
            Choose transaction type and fill in the details
          </p>
        </CardHeader>
        <CardContent>
          {/* Transaction Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Transaction Type</label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={transactionType === 'bank' ? 'default' : 'outline'}
                onClick={() => setTransactionType('bank')}
                className="h-auto p-4 flex flex-col items-center"
              >
                <div className="text-lg mb-1">🏦</div>
                <div className="text-sm">Bank</div>
                <Badge variant="outline" className="mt-1 text-xs">UPI/Razorpay</Badge>
              </Button>
              
              <Button
                variant={transactionType === 'crypto' ? 'default' : 'outline'}
                onClick={() => setTransactionType('crypto')}
                className="h-auto p-4 flex flex-col items-center"
              >
                <div className="text-lg mb-1">🪙</div>
                <div className="text-sm">Crypto</div>
                <Badge variant="outline" className="mt-1 text-xs">MetaMask</Badge>
              </Button>
              
              <Button
                variant={transactionType === 'hybrid' ? 'default' : 'outline'}
                onClick={() => setTransactionType('hybrid')}
                className="h-auto p-4 flex flex-col items-center"
              >
                <div className="text-lg mb-1">🔄</div>
                <div className="text-sm">Hybrid</div>
                <Badge variant="outline" className="mt-1 text-xs">Bank↔Crypto</Badge>
              </Button>
            </div>
          </div>

          {/* Transaction Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount ({transactionType === 'crypto' ? 'ETH' : 'INR'})
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount in ${transactionType === 'crypto' ? 'ETH' : 'INR'}`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {transactionType === 'crypto' ? 'Recipient Address' : 'Recipient UPI/Account'}
              </label>
              <Input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={
                  transactionType === 'crypto' 
                    ? '0x...' 
                    : 'user@upi or Account Number'
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Transaction description"
              />
            </div>

            {/* Transaction Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Transaction Details:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Type: <span className="font-medium capitalize">{transactionType}</span></li>
                <li>• Network: <span className="font-medium">Polygon (Layer 2)</span></li>
                <li>• Storage: <span className="font-medium">Optimized (85% gas saved)</span></li>
                <li>• Data: <span className="font-medium">Compressed + Batched</span></li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `Create ${transactionType} Transaction`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
