import OTPForm from "@/components/client/OTP-Form";
import { Card } from "@/components/ui/card";
import React from "react";


type Props = {};

const page = (props: Props) => {
  return (
    <Card className="bg-primary m-5 col-span-3 grid grid-cols-2">
      <Card className="px-8 py-5 m-7 shadow-2xl h-fit">
        <h1 className="text-lg font-bold my-3">Change Passwords</h1>
        <div className="flex w-full max-w-sm items-center space-x-2 box-border">
            <OTPForm/>
        </div>
      </Card>
    </Card>
  );
};

export default page;