import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Volume Booster</h1>
      <Button>Generate Addresses</Button>

    </div>
  )
}

export default page