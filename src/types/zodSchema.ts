import { z } from "zod";

export const schema = z.object({
  address: z.string().nonempty({ message: "Required" }),
  amount: z.coerce.number().positive({ message: "Must be a positive number" }),
});

export const historySchema = z.object({
  address: z.string().nonempty({ message: "Required" }),
});
