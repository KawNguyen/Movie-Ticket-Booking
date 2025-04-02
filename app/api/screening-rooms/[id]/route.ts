import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.screeningRoom.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({
      message: "Screening room deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error deleting screening room" },
      { status: 500 },
    );
  }
}
