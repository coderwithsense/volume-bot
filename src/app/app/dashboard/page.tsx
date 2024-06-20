"use client";

import DetailsForm from "@/components/client/Details-Form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getSolBalance } from "$/solana-daddy";
import { set } from "react-hook-form";
import { auth } from "@clerk/nextjs/server";

type Props = {};

const page = (props: Props) => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.user.privateKey == null) {
        return setError("Invalid Private Key, change in settings");
      }
      const solBalance = await getSolBalance(data.user.privateKey);
      // console.log("solana balance: ", solBalance);
      if (solBalance == null) {
        return setError("Invalid Private Key, change in settings");
      }
      setBalance(solBalance.balance);
      setAddress(solBalance.address);
    })();
  }, []);
  return (
    <Card className="bg-primary m-5 col-span-3 grid grid-cols-2">
      <Card className="px-8 py-5 m-7 shadow-2xl h-fit">
        <h1 className="text-lg font-bold my-3">Select Details</h1>
        <DetailsForm />
      </Card>
      <Card className="px-8 py-5 m-7 shadow-2xl h-fit">
        <h1 className="text-lg font-bold my-3">Account Details (Devnet)</h1>
        {balance ? (
          <div className="flex gap-3 my-2">
            <h1 className="font-semibold">Balance :</h1>
            <p className="text-gray-500">{balance} SOL</p>
          </div>
        ) : (
          <div className="flex gap-3 my-2">
            <h1 className="font-semibold">Balance :</h1>
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
        {address ? (
          <div className="my-2">
            <h1 className="font-semibold">Address :</h1>
            <p className="text-gray-500 truncate">{address}</p>
          </div>
        ) : (
          <div className="my-2">
            <h1 className="font-semibold">Address :</h1>
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
        {error ? (
          <div className="my-2">
            <h1 className="font-semibold text-red-500">{error}</h1>
          </div>
        ) : (
          <div></div>
        )}
      </Card>
      {/* <Card className="px-8 py-5 m-7 shadow-2xl h-fit">
                <h1 className="text-lg font-bold my-3">Running Bots</h1>
                <div className="flex gap-3 my-2">
                    <h1 className="font-semibold">Exchange :</h1>
                    <p className="text-gray-500">Jupiter</p>
                </div>
                <div className="my-2">
                    <h1 className="font-semibold">Token Address :</h1>
                    <p className="text-gray-500 truncate">0x4B1E80cAC91e2216EEb63e29B957eB91Ae9C2Be8</p>
                </div>
                <div className="flex gap-3 my-2">
                    <h1 className="font-semibold">Number of Wallets :</h1>
                    <p className="text-gray-500">10</p>
                </div>
                <div className="flex gap-3 my-2">
                    <h1 className="font-semibold">Running Time :</h1>
                    <p className="text-gray-500">10min</p>
                </div>
                <Button type="submit">Stop Bot</Button>
            </Card> */}
    </Card>
  );
};

export default page;
