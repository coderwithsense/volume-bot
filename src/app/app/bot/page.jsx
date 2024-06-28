"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { set } from "react-hook-form";

const Bot = () => {
  const [bot, setBot] = useState();
  const [BotStatus, setBotStatus] = useState(false);
  const onBotStart = async () => {
    setBotStatus(true);
    // Do something here to start the bot
    alert("Bot Started...");
  };
  const onBotStop = async () => {
    setBotStatus(false);
    // Do something here to stop the bot
    alert("Bot Stopped...");
  };
  const setBotData = async () => {
    try {
      (async () => {
        // const response = await fetch('/api/bot', {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });
        // const data = await response.json();
        // console.log('Bot Datdsda: ', data)
        // setBot(data['bot']);
        // console.log('Bot Data: ', bot)
        fetch("/api/bot", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Bot Data: ", data["bot"][0]);
            setBot(data["bot"][0]);
          })
          .catch((e) => {
            console.log("[ERROR_FETCHING_BOT_DATA]: ", e);
          });
      })();
    } catch (e) {
      console.log("[ERROR_FETCHING_BOT_DATA]: ", e);
    }
  };
  useEffect(() => {
    setBotData();
  }, []);
  return (
    <Card className="bg-primary m-5 col-span-3 grid text-center">
      <Card className="px-8 py-5 m-7 shadow-2xl h-fit">
        <h1 className="text-lg font-bold my-3">Bot</h1>
        {bot ? (
          <>
            <div className="flex gap-3 my-2">
              <h1 className="font-semibold">Wallets:</h1>
              <p className="text-gray-500">{bot.WalletsAmount}</p>
            </div>
            <div className="flex gap-3 my-2">
              <h1 className="font-semibold">Token Address:</h1>
              <p className="text-gray-500">
                {bot.TokenAddress ? bot.TokenAddress : "No Token Address"}
              </p>
            </div>
            <div>
              <h1 className="font-semibold">
                Bot Status: {BotStatus ? "Running" : "Stopped"}
              </h1>
            </div>
            <Button variant="secondary" onClick={onBotStart}>
              Start Bot
            </Button>
            <Button variant="destructive" onClick={onBotStop}>
              Stop Bot
            </Button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Card>
    </Card>
  );
};

export default Bot;
