"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { number, z } from "zod";
import { Button } from "@/components/ui/button";

enum Exchange {
  BTC = "BTC",
  JUPTIER = "JPT",
}

const walletsAmount = ["50", "100", "500"] as const;

const ExchangeKeys = Object.keys(Exchange) as [keyof typeof Exchange];

const formSchema = z.object({
  exchange: z.enum(ExchangeKeys, { message: "Invalid Exchange" }),
  address: z.string().min(16, { message: "Invalid token Provied" }),
  walletsAmount: z.enum(walletsAmount, { message: "Invalid Amount of wallet" }),
  capital: z.number({
    required_error: "Capital is required for wallets",
    invalid_type_error: "Must be in number",
  }),
});

type Props = {};
const DetailsForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      walletsAmount: walletsAmount[0],
      exchange: Exchange.BTC,
      capital: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="exchange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exchange Name</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(e) => {
                    // Ensure the value is updated in react-hook-form's state
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {formSchema.shape.exchange.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* <Input placeholder="shadcn" {...field} /> */}
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter Coin Address" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walletsAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Number of Wallets</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(e) => {
                    // Ensure the value is updated in react-hook-form's state
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {formSchema.shape.walletsAmount.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* <Input placeholder="shadcn" {...field} /> */}
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capital"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capital</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Capital for each wallet"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Start Bot</Button>
      </form>
    </Form>
  );
};

export default DetailsForm;
