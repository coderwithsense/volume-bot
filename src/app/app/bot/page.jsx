"use client"

import { Card } from '@/components/ui/card'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'

const Bot = () => {
    const [bot, setBot] = useState({})
    const [loading, setLoading] = useState(true)
    const setBotData = async () => {
        try {
            (async () => {
                const response = await fetch('/api/bot', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('Bot Datdsda: ', data["bot"][0])
                setBot(data["bot"][0]);
            })();
        } catch (e) {
            console.log('[ERROR_FETCHING_BOT_DATA]: ', e)
        }
    }
    useEffect(() => {
        setBotData();
        console.log('Bot Datssa: ', bot)
    }, [])
  return (
    <Card className='bg-primary m-5 col-span-3 grid'>
        <Card className='px-8 py-5 m-7 shadow-2xl h-fit'>
            <h1 className='text-lg font-bold my-3'>Bot</h1>
            {
                loading ? (
                    <p>Loading...</p>
                ) : (
                    <p>Bot Data: {bot}</p>
                )
            }
        </Card>
    </Card>
  )
}

export default Bot