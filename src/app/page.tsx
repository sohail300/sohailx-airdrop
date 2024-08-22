import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CloudDownload } from "lucide-react";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className=" fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-52 h-28 bg-fuchsia-500/80 blur-[120px]"></div>
      <Card className=" w-1/3 bg-transparent text-white border border-white/20">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div>
              <span>Request Airdrop</span>
              <p className="text-sm font-normal text-gray-400 mt-2">
                Maximum of 20000 tokens per wallet address
              </p>
            </div>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="devnet">Devnet</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <Input
            placeholder="Enter your wallet address"
            className="col-span-3"
          />
          <Input placeholder="Amount" className="col-span-1" />
        </CardContent>
        <CardFooter>
          <Button className="bg-white text-black w-full">
            <CloudDownload className="w-4 h-4 mr-2" />
            Request Airdrop
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
