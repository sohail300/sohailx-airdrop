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
import { AlertCircle, CloudDownload, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/utils/config";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { historySchema, schema } from "@/types/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { getDateandTime } from "@/utils/getDateandTime";
import { Transaction } from "@/types/interfaces";

const History = ({
  seeHistory,
  setSeeHistory,
  error,
  setError,
}: {
  seeHistory: boolean;
  setSeeHistory: (value: boolean) => void;
  error: any;
  setError: (value: any) => void;
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);

  async function getHistory(values: z.infer<typeof historySchema>) {
    try {
      setIsSearching(true);
      setError(null);
      const response = await api.post("/transactions", {
        address: values.address,
      });
      console.log(response.data);
      setHistory(response.data.transactions);
    } catch (error) {
      console.log(error);
      setError({
        title: "History checking failed",
        description: "Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  }

  const form = useForm<z.infer<typeof historySchema>>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      address: "",
    },
  });

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ${
        seeHistory ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-1/3 lg:w-1/4 bg-gray-800 text-white p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          seeHistory ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Button
          className="absolute top-4 right-4 text-white cursor-pointer"
          onClick={() => setSeeHistory(false)}
        >
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold mb-4">History</h2>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(getHistory)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
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
              <Button
                type="submit"
                className="bg-white text-black w-full hover:bg-gray-200"
                disabled={isSearching}
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 py-4">
          {history?.map((item: Transaction) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-indigo-600">
                    {item.amount}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {getDateandTime(item.timeStamp)}
                  </span>
                </div>
                <div className="bg-indigo-100 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
