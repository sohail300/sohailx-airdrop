"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertCircle, CloudDownload } from "lucide-react";
import { useState } from "react";
import { api } from "@/utils/config";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { schema } from "@/types/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import History from "@/components/History";
import { ErrorState } from "@/types/interfaces";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [seeHistory, setSeeHistory] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: "",
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post("/devnet/token", {
        address: values.address,
        amount: values.amount,
      });

      if (response.status === 200) {
        toast({
          title: "Airdropped successfully",
        });
      }
    } catch (error: any) {
      if (error.response.status === 403) {
        setError({
          title: error.response.data.message,
          description: `You can get a maximum of ${error.response.data.diff} tokens more.`,
        });
      } else {
        setError({
          title: "Airdrop request failed",
          description: "Please try again.",
        });
      }

      console.log("Error requesting airdrop", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center flex-col items-center min-h-screen px-4 py-8">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-52 h-28 bg-fuchsia-500/80 blur-[120px]"></div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-16 text-center">
        {/* <span className="neon-outline"></span> */}
        {/* <Cover></Cover>  */}
        <Highlight className="text-white mr-4 px-4">sohailX</Highlight>
        Airdrop
      </h1>
      {seeHistory ? (
        <History
          seeHistory={seeHistory}
          setSeeHistory={setSeeHistory}
          error={error}
          setError={setError}
        />
      ) : (
        <Button
          className="fixed top-4 right-4 sm:top-8 sm:right-8 text-white border rounded-lg border-white-200 shadow-[0_0_1px_#fff,inset_0_0_1px_#fff,0_0_2px_#08f,0_0_5px_#fff,0_0_5px_#fff]"
          onClick={() => setSeeHistory(true)}
        >
          History
        </Button>
      )}

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4 relative overflow-hidden">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                {error.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">{error.description}</p>
            <button
              onClick={() => setError(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md bg-transparent text-white border border-white/20">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div>
              <span>Request Airdrop on Devnet</span>
              <p className="text-sm font-normal text-gray-400 mt-2">
                Maximum of 20000 tokens per wallet address
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-full sm:col-span-2">
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Solana Public Address"
                          {...field}
                          autoComplete="off"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="col-span-full sm:col-span-2">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1000"
                          {...field}
                          className="w-full"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="bg-white text-black w-full hover:bg-gray-200 relative"
                disabled={isLoading}
                onClick={() => console.log("Button clicked")}
              >
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <CloudDownload className="w-4 h-4 mr-2" />
                  {isLoading ? "Requesting..." : "Request Airdrop"}
                </span>
                <span className="opacity-0">
                  {isLoading ? "Requesting..." : "Request Airdrop"}
                </span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
