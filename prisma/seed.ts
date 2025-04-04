import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data in correct order
  await prisma.seat.deleteMany({});
  await prisma.screeningRoom.deleteMany({});
  
  // Create screening rooms sequentially
  const room1 = await prisma.screeningRoom.create({
    data: { 
      name: 'Room 1', 
      capacity: 48 
    }
  });

  const room2 = await prisma.screeningRoom.create({
    data: { 
      name: 'Room 2', 
      capacity: 48 
    }
  });

  const room3 = await prisma.screeningRoom.create({
    data: { 
      name: 'Room 3', 
      capacity: 48 
    }
  });

  const rooms = [room1, room2, room3];

  // Tạo ghế cho mỗi phòng
  for (const room of rooms) {
    console.log(`Creating seats for ${room.name}`);
    
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 8;

    for (const row of rows) {
      for (let number = 1; number <= seatsPerRow; number++) {
        await prisma.seat.create({
          data: {
            row,
            number,
            screeningRoomId: room.id,
          },
        });
      }
    }
  }

  console.log('Seats created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });