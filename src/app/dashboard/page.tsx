"use client"

import { Button } from '@/components/ui/button'
import React from 'react'
import { createKeypair } from '../../../utils/solana-daddy'
import { Keypair } from '@solana/web3.js'

const page = () => {
  const [addresses, setAddresses] = React.useState<Keypair[]>([])
  const [loading, setLoading] = React.useState(false)

  const onClick = async () => {
    setLoading(true)
    const pairs = await createKeypair(10);
    setAddresses(pairs)
    setLoading(false)
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Volume Booster</h1>
      <div className='flex flex-col items-center'>
        <Button onClick={onClick}>Generate Addresses</Button>
        <input type="number" className="w-full p-2 mt-4 border border-gray-300 rounded-md" />
      </div>
      {loading && <p>Loading...</p>}
      <div>
        {addresses.map((address, index) => (
          <p key={index}>{address.publicKey.toString()}</p>
        ))}
      </div>
    </div>
  )
}

export default page