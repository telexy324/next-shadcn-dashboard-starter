"use server";

import * as z from "zod";
import { CheckInSchema, CheckInsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { CheckInRecord } from "@prisma/client";

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

export const checkIns = async (
  values: z.infer<typeof CheckInsSchema>,
): Promise<CheckInRecord[]> => {
  try {
    const validatedFields = CheckInsSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { pagination, checkIn } = validatedFields.data;
    const direction = pagination.desc === true ? "desc" : "asc";

    return await db.checkInRecord.findMany({
      orderBy: pagination.orderBy
        ? {
            [pagination.orderBy]: direction,
          }
        : {},
      skip: (pagination.page - 1) * pagination.limit, // 计算要跳过的记录数，实现分页
      take: pagination.limit, // 每页返回的记录数
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // 抛出错误，让调用方处理
  }
};
