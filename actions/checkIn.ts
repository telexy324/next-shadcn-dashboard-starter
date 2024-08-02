"use server";

import * as z from "zod";
import { CheckInSchema } from "@/schemas";
import { db } from "@/lib/db";

export const checkIn = async (values: z.infer<typeof CheckInSchema>) => {
  const validatedFields = CheckInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, location, checkInTime } = validatedFields.data;

  await db.checkInRecord.create({
    data: {
      name,
      location,
      checkInTime: checkInTime,
    },
  });

  return { success: "Check in recorded!" };
};
