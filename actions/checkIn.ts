"use server";

import * as z from "zod";
import { CheckInSchema, CheckInsSchema } from "@/schemas";
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

export const checkIns = async (
  values: z.infer<typeof CheckInsSchema>,
): Promise<db.checkInRecord[]> => {
  const validatedFields = CheckInsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { pagination, checkIn } = validatedFields.data;
  const direction = pagination.desc === true ? "desc" : "asc";

  await db.checkInRecord.findMany({
    orderBy: pagination.orderBy
      ? {
          [pagination.orderBy]: direction,
        }
      : {},
    skip: (pagination.page - 1) * pagination.limit, // 计算要跳过的记录数，实现分页
    take: pagination.limit, // 每页返回的记录数
  });

  return { success: "Check in recorded!" };
};
