"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateUser } from "../../../lib/user-data";
import { auth } from "@clerk/nextjs/server";
import { UserRoundIcon } from "lucide-react";
import { getAddressFromPrivateKey } from "$/solana-daddy";

const formSchema = z.object({
    privateKey: z.string().refine(value => value.length === 88, {
        message: "Private key must be 88 characters long",
    }).refine(value => value.slice(0, 44) !== '', {
        message: "Private key must not be empty",
    })
});

type Props = {
    userId: string | null;
};

const PrivateKeyForm = (props: Props) => {
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // const setPrivateKey = await updateUser(props.userId as any, {privateKey: values.privateKey});
            // if(setPrivateKey.success) console.log("Private key set successfully");
            // else console.log("Error setting private key");
            const publicAddress = getAddressFromPrivateKey(values.privateKey    );
            fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId: props.userId, changes: {privateKey: values.privateKey, publicKey: publicAddress}}),
            })
            .then((response) => alert("Private key set successfully"))
        } catch (e) {
            console.log(e);
            console.log("Error setting private key");
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            privateKey: "",
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="privateKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Private Key</FormLabel>
                            <FormControl>
                                <div className="flex gap-5">
                                    <Input type="text" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">SET</Button>
            </form>
        </Form>
    )
}

export default PrivateKeyForm;