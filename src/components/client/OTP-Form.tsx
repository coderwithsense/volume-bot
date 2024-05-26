"use client";

import React from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";



const formSchema = z.object({
  otp: z.string().min(6, {message: "Invalid otp"}),
  oldpassword: z.string().min(6, {message: "Doesnt meet minimum criteria"}).max(12, {message: "Password cant exceed more than 12 characters"}),
  newpassword: z.string().min(6, {message: "Doesnt meet minimum criteria"}).max(12, {message: "Password cant exceed more than 12 characters"})
});

type Props = {};

function onSubmit(values: z.infer<typeof formSchema>) {
  // Do something with the form values.
  // ✅ This will be type-safe and validated.
  console.log(values);
}

const OTPForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp : "",
      newpassword: "",
      oldpassword: ""
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <div className="flex gap-5 ">
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button>Send Otp</Button>
                </div>
              </FormControl>
              <FormMessage />

            </FormItem>
          )}
        />
              <FormField
          control={form.control}
          name="oldpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input type="password" {...field}/>
              </FormControl>
              <FormMessage />

            </FormItem>
          )}
        />
              <FormField
          control={form.control}
          name="newpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field}/>
              </FormControl>
              <FormMessage />
              
            </FormItem>
          )}
        />
        <Button type="submit">Change Password</Button>
      </form>
    </Form>
  );
};

export default OTPForm;
