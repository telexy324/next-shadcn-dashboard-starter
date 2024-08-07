"use server";

import * as z from "zod";
import { CheckInSchema, CheckInsSchema, IdSchema } from "@/schemas";
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

export const checkInDelete = async (id: string) => {
  try {
    await db.checkInRecord.delete({
      where: { id },
    });
    return { success: "Check in deleted!" };
  } catch (error) {
    return { error: error as string };
  }
};

export const checkIns = async (values: z.infer<typeof CheckInsSchema>) => {
  const validatedFields = CheckInsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { pagination, checkIn } = validatedFields.data;

  let orderByOption: Record<string, "asc" | "desc"> | undefined = undefined;
  if (pagination.orderBy) {
    orderByOption = {
      [orderBy]: "desc", // 默认降序排列
    };
  }

  await db.checkInRecord.findMany({
    take: size, // 每页显示的记录数量
    skip: (page - 1) * size, // 跳过的记录数量
    orderBy: {
      createdAt: "desc", // 可根据需要调整排序方式
    },
  });

  return { success: "Check in recorded!" };
};
