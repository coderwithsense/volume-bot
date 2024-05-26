import DetailsForm from "@/components/client/Details-Form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (

      <Card className="bg-primary m-5 col-span-3 grid grid-cols-2">
        <Card className="px-8 py-5 m-7 shadow-2xl h-fit">
            <h1 className="text-lg font-bold my-3">Select Details</h1>
          <DetailsForm />
        </Card>
        <Card className="px-8 py-5 m-7 shadow-2xl h-fit">
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
        
</Card>
      </Card>
  );
};

export default page;
