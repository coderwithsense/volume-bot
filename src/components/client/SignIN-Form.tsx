"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { StepForward } from "lucide-react";
import { SignInFirstFactor, EmailCodeFactor } from "@clerk/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [useBackupCode, setUseBackupCode] = React.useState(false);
  const [displayTOTP, setDisplayTOTP] = React.useState(false);
  const router = useRouter();

  const handleFirstStage = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayTOTP(true);
  };

  // Handle the submission of the TOTP of Backup Code submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    // Start the sign-in process
    try {
      await signIn.create({
        identifier: email,
        password,
      });

      // Attempt the TOTP or backup code verification
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: 'totp',
        code: code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });

        router.push('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.log(signInAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(err);
    }
  };

  if (displayTOTP) {
    return (
      <div>
        <h1>Verify your account</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="code">Code</label>
            <input
              onChange={(e) => setCode(e.target.value)}
              id="code"
              name="code"
              type="text"
              value={code}
            />
          </div>
          <div>
            <label htmlFor="backupcode">This code is a backup code</label>
            <input
              onChange={() => setUseBackupCode((prev) => !prev)}
              id="backupcode"
              name="backupcode"
              type="checkbox"
              checked={useBackupCode}
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={(e) => handleFirstStage(e)}>
        <Card className="grid justify-center w-[30rem] p-7 shadow-2xl">
          <Image
            src={"/Logo.png"}
            width={30}
            height={50}
            alt="logo"
            className="m-auto"
          />
          <div className="my-5 text-center">
            <h1 className="font-bold">Sign in to Volume Bot</h1>
            <p className="text-sm font-normal text-gray-500">
              Welcome back! Please sign in to continue
            </p>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-1">
              <Label htmlFor="email" className="text-sm">
                Your email address
              </Label>
              <Input onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="h-[80%] bg-zinc-700 hover:bg-zinc-900"
              type="submit"
            >
              Continue <StepForward className="h-[70%]" />
            </Button>
          </div>
        </Card>
      </form>
      {/* <h1>Sign in</h1>
      <form onSubmit={(e) => handleFirstStage(e)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            type="email"
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            value={password}
          />
        </div>
        <button type="submit">Next</button>
      </form> */}
    </>
  );
}
