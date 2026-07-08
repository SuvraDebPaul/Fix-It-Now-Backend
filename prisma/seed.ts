import { Role } from "../generated/prisma/enums";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // 1. Wipe existing data (children first, respecting FK order)
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.service.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // 2. Admin
  const hashedAdminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedAdminPassword,
      role: Role.ADMIN,
      status: "ACTIVE",
    },
  });

  // 3. Categories
  const [plumbing, electrical, cleaning, painting] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Plumbing",
        slug: "plumbing",
        description: "Pipe and water system repairs",
      },
    }),
    prisma.category.create({
      data: {
        name: "Electrical",
        slug: "electrical",
        description: "Wiring and electrical fixes",
      },
    }),
    prisma.category.create({
      data: {
        name: "Cleaning",
        slug: "cleaning",
        description: "Home cleaning services",
      },
    }),
    prisma.category.create({
      data: {
        name: "Painting",
        slug: "painting",
        description: "Interior and exterior painting",
      },
    }),
  ]);

  // 4. Technicians (with profile + services + availability)
  const technicianPassword = await bcrypt.hash("Tech@123456", 12);

  const john = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.technician@gmail.com",
      password: technicianPassword,
      role: Role.TECHNICIAN,
      technicianProfile: {
        create: {
          bio: "Experienced plumber with 8 years in residential repairs",
          experience: 8,
          location: "Dhaka",
          phone: "01700000001",
          hourlyRate: 15,
          isAvailable: true,
          averageRating: 0,
          totalReviews: 0,
        },
      },
    },
    include: { technicianProfile: true },
  });

  const alice = await prisma.user.create({
    data: {
      name: "Alice Smith",
      email: "alice.technician@gmail.com",
      password: technicianPassword,
      role: Role.TECHNICIAN,
      technicianProfile: {
        create: {
          bio: "Licensed electrician specializing in home wiring",
          experience: 5,
          location: "Chittagong",
          phone: "01700000002",
          hourlyRate: 20,
          isAvailable: true,
          averageRating: 0,
          totalReviews: 0,
        },
      },
    },
    include: { technicianProfile: true },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Martin",
      email: "bob.technician@gmail.com",
      password: technicianPassword,
      role: Role.TECHNICIAN,
      technicianProfile: {
        create: {
          bio: "Cleaning and painting specialist",
          experience: 4,
          location: "Dhaka",
          phone: "01700000003",
          hourlyRate: 18,
          isAvailable: true,
          averageRating: 0,
          totalReviews: 0,
        },
      },
    },
    include: { technicianProfile: true },
  });

  const johnProfile = john.technicianProfile!;
  const aliceProfile = alice.technicianProfile!;
  const bobProfile = bob.technicianProfile!;

  const [
    pipeRepair,
    drainCleaning,
    wiringInstall,
    fanRepair,
    deepCleaning,
    wallPainting,
  ] = await Promise.all([
    prisma.service.create({
      data: {
        technicianProfileId: johnProfile.id,
        categoryId: plumbing.id,
        title: "Pipe Leak Repair",
        description: "Fixing leaking pipes and joints",
        price: 40,
      },
    }),
    prisma.service.create({
      data: {
        technicianProfileId: johnProfile.id,
        categoryId: plumbing.id,
        title: "Drain Cleaning",
        description: "Clearing blocked drains",
        price: 30,
      },
    }),
    prisma.service.create({
      data: {
        technicianProfileId: aliceProfile.id,
        categoryId: electrical.id,
        title: "Wiring Installation",
        description: "New wiring setup for rooms",
        price: 60,
      },
    }),
    prisma.service.create({
      data: {
        technicianProfileId: aliceProfile.id,
        categoryId: electrical.id,
        title: "Fan Repair",
        description: "Ceiling and table fan repairs",
        price: 25,
      },
    }),
    prisma.service.create({
      data: {
        technicianProfileId: bobProfile.id,
        categoryId: cleaning.id,
        title: "Home Deep Cleaning",
        description: "Full home deep cleaning service",
        price: 45,
      },
    }),
    prisma.service.create({
      data: {
        technicianProfileId: bobProfile.id,
        categoryId: painting.id,
        title: "Wall Painting",
        description: "Interior wall painting",
        price: 100,
      },
    }),
  ]);

  await prisma.availabilitySlot.createMany({
    data: [
      {
        technicianProfileId: johnProfile.id,
        day: "SATURDAY",
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        technicianProfileId: johnProfile.id,
        day: "SUNDAY",
        startTime: "09:00",
        endTime: "17:00",
      },
      {
        technicianProfileId: aliceProfile.id,
        day: "MONDAY",
        startTime: "10:00",
        endTime: "18:00",
      },
      {
        technicianProfileId: aliceProfile.id,
        day: "TUESDAY",
        startTime: "10:00",
        endTime: "18:00",
      },
      {
        technicianProfileId: bobProfile.id,
        day: "WEDNESDAY",
        startTime: "08:00",
        endTime: "16:00",
      },
      {
        technicianProfileId: bobProfile.id,
        day: "THURSDAY",
        startTime: "08:00",
        endTime: "16:00",
      },
    ],
  });

  // 5. Customers
  const customerPassword = await bcrypt.hash("Customer@123456", 12);

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Khan",
      email: "sarah.customer@gmail.com",
      password: customerPassword,
      role: Role.CUSTOMER,
      customerProfile: {
        create: {
          address: "House 12, Road 5",
          city: "Dhaka",
          area: "Dhanmondi",
          phone: "01800000001",
        },
      },
    },
    include: { customerProfile: true },
  });

  const mike = await prisma.user.create({
    data: {
      name: "Mike Chen",
      email: "mike.customer@gmail.com",
      password: customerPassword,
      role: Role.CUSTOMER,
      customerProfile: {
        create: {
          address: "House 45, Road 2",
          city: "Dhaka",
          area: "Gulshan",
          phone: "01800000002",
        },
      },
    },
    include: { customerProfile: true },
  });

  const emma = await prisma.user.create({
    data: {
      name: "Emma Wilson",
      email: "emma.customer@gmail.com",
      password: customerPassword,
      role: Role.CUSTOMER,
      customerProfile: {
        create: {
          address: "House 78, Road 9",
          city: "Chittagong",
          area: "Agrabad",
          phone: "01800000003",
        },
      },
    },
    include: { customerProfile: true },
  });

  const sarahProfile = sarah.customerProfile!;
  const mikeProfile = mike.customerProfile!;
  const emmaProfile = emma.customerProfile!;

  // 6. Bookings — one for every BookingStatus value
  const completedBooking = await prisma.booking.create({
    data: {
      customerProfileId: sarahProfile.id,
      technicianProfileId: johnProfile.id,
      serviceId: pipeRepair.id,
      scheduleTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      address: sarahProfile.address as string,
      status: "COMPLETED",
      totalAmount: pipeRepair.price,
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  const acceptedBooking = await prisma.booking.create({
    data: {
      customerProfileId: sarahProfile.id,
      technicianProfileId: aliceProfile.id,
      serviceId: fanRepair.id,
      scheduleTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      address: sarahProfile.address as string,
      status: "ACCEPTED",
      totalAmount: fanRepair.price,
    },
  });

  const requestedBooking = await prisma.booking.create({
    data: {
      customerProfileId: mikeProfile.id,
      technicianProfileId: johnProfile.id,
      serviceId: drainCleaning.id,
      scheduleTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      address: mikeProfile.address as string,
      status: "REQUESTED",
      totalAmount: drainCleaning.price,
    },
  });

  const paidBooking = await prisma.booking.create({
    data: {
      customerProfileId: mikeProfile.id,
      technicianProfileId: bobProfile.id,
      serviceId: deepCleaning.id,
      scheduleTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      address: mikeProfile.address as string,
      status: "PAID",
      totalAmount: deepCleaning.price,
    },
  });

  const inProgressBooking = await prisma.booking.create({
    data: {
      customerProfileId: emmaProfile.id,
      technicianProfileId: bobProfile.id,
      serviceId: wallPainting.id,
      scheduleTime: new Date(),
      address: emmaProfile.address as string,
      status: "IN_PROGRESS",
      totalAmount: wallPainting.price,
    },
  });

  await prisma.booking.create({
    data: {
      customerProfileId: emmaProfile.id,
      technicianProfileId: aliceProfile.id,
      serviceId: wiringInstall.id,
      scheduleTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      address: emmaProfile.address as string,
      status: "CANCELLED",
      totalAmount: wiringInstall.price,
      cancelReason: "Change of plans",
    },
  });

  await prisma.booking.create({
    data: {
      customerProfileId: sarahProfile.id,
      technicianProfileId: bobProfile.id,
      serviceId: deepCleaning.id,
      scheduleTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      address: sarahProfile.address as string,
      status: "DECLINED",
      totalAmount: deepCleaning.price,
    },
  });

  // 7. Payments (for bookings that reached PAID/IN_PROGRESS/COMPLETED)
  await prisma.payment.createMany({
    data: [
      {
        bookingId: completedBooking.id,
        transactionId: "seed_txn_completed",
        amount: completedBooking.totalAmount,
        provider: "STRIPE",
        status: "COMPLETED",
        paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        bookingId: paidBooking.id,
        transactionId: "seed_txn_paid",
        amount: paidBooking.totalAmount,
        provider: "STRIPE",
        status: "COMPLETED",
        paidAt: new Date(),
      },
      {
        bookingId: inProgressBooking.id,
        transactionId: "seed_txn_inprogress",
        amount: inProgressBooking.totalAmount,
        provider: "STRIPE",
        status: "COMPLETED",
        paidAt: new Date(),
      },
    ],
  });

  // 8. Review for the completed booking
  await prisma.review.create({
    data: {
      bookingId: completedBooking.id,
      customerProfileId: sarahProfile.id,
      technicianProfileId: johnProfile.id,
      rating: 5,
      comment: "Great service, fixed the leak quickly!",
    },
  });

  await prisma.technicianProfile.update({
    where: { id: johnProfile.id },
    data: { averageRating: 5, totalReviews: 1 },
  });

  console.log("Seed complete:");
  console.log({
    admin: { email: admin.email, password: "Admin@123456" },
    technicians: [
      { email: john.email, password: "Tech@123456" },
      { email: alice.email, password: "Tech@123456" },
      { email: bob.email, password: "Tech@123456" },
    ],
    customers: [
      { email: sarah.email, password: "Customer@123456" },
      { email: mike.email, password: "Customer@123456" },
      { email: emma.email, password: "Customer@123456" },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
