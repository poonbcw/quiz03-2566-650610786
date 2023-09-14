import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  let count = 0;
  for (let key in DB.rooms) ++count;
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: count,
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { roomName } = body;

  readDB();
  const foundRoom = DB.rooms.find((room) => room.roomName === roomName);
  if (foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  //call writeDB after modifying Database
  DB.rooms.push({
    roomId,
    roomName,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
