export interface Transaction {
  id: string;
  amount: number;
  timeStamp: string;
}

export interface ErrorState {
  title: string;
  description: string;
}
