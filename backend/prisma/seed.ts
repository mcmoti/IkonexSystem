import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Super Admin
  const adminPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@ikonex.com' },
    update: {},
    create: {
      email: 'admin@ikonex.com',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN'
    }
  });

  // 2. Academic Year
  const academicYear = await prisma.academicYear.create({
    data: { name: '2024', isCurrent: true }
  });

  // 3. Streams
  const streamNames = ['Form 1A', 'Form 1B', 'Form 1C'];
  const streams = [];
  for (const name of streamNames) {
    const stream = await prisma.classStream.create({
      data: { name, capacity: 40, academicYearId: academicYear.id }
    });
    streams.push(stream);
  }

  // 4. Subjects
  const subjectData = [
    { code: 'MATH', name: 'Mathematics' },
    { code: 'ENG', name: 'English' },
    { code: 'SCI', name: 'Science' },
    { code: 'HIST', name: 'History' },
    { code: 'GEO', name: 'Geography' }
  ];
  const subjects = [];
  for (const s of subjectData) {
    const subject = await prisma.subject.create({
      data: { code: s.code, name: s.name, isCompulsory: true }
    });
    subjects.push(subject);
  }

  // Assign subjects to streams
  for (const stream of streams) {
    for (const subject of subjects) {
      await prisma.streamSubject.create({
        data: { streamId: stream.id, subjectId: subject.id }
      });
    }
  }

  // 5. Grading Scales
  const scales = [
    { grade: 'A', minScore: 80, maxScore: 100 },
    { grade: 'A-', minScore: 75, maxScore: 79.99 },
    { grade: 'B+', minScore: 70, maxScore: 74.99 },
    { grade: 'B', minScore: 65, maxScore: 69.99 },
    { grade: 'B-', minScore: 60, maxScore: 64.99 },
    { grade: 'C+', minScore: 55, maxScore: 59.99 },
    { grade: 'C', minScore: 50, maxScore: 54.99 },
    { grade: 'C-', minScore: 45, maxScore: 49.99 },
    { grade: 'D+', minScore: 40, maxScore: 44.99 },
    { grade: 'D', minScore: 35, maxScore: 39.99 },
    { grade: 'E', minScore: 0, maxScore: 34.99 }
  ];
  for (const s of scales) {
    await prisma.gradingScale.create({ data: s });
  }

  // 6. Students (10 per stream = 30)
  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i];
    for (let j = 1; j <= 10; j++) {
      const pad = (i * 10 + j).toString().padStart(3, '0');
      await prisma.student.create({
        data: {
          admissionNumber: `IKX-${pad}`,
          firstName: `StudentFirst${pad}`,
          lastName: `StudentLast${pad}`,
          gender: j % 2 === 0 ? 'F' : 'M',
          dateOfBirth: new Date('2010-01-01'),
          streamId: stream.id
        }
      });
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
