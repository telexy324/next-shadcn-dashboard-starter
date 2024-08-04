"use server";

import * as z from "zod";
import { CheckInSchema, IdSchema } from "@/schemas";
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

export const checkInDelete = async (values: z.infer<typeof IdSchema>) => {
  const validatedFields = IdSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id } = validatedFields.data;

  await db.checkInRecord.delete({
    where: { id },
  });

  return { success: "Check in recorded!" };
};
