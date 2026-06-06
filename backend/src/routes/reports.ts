import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { authenticate } from '../middleware/auth';
import prisma from '../prisma';

const router = Router();

router.get('/student/:id/report-card', authenticate, async (req, res) => {
  try {
    const studentId = req.params.id as string;
    const academicYearId = req.query.academicYearId as string;
    const term = req.query.term as string;

    if (!academicYearId || !term) {
      return res.status(400).json({ message: 'Missing academicYearId or term' });
    }

    const student = (await prisma.student.findUnique({
      where: { id: studentId },
      include: { stream: true }
    })) as any;

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const results = (await prisma.studentResult.findMany({
      where: {
        studentId,
        academicYearId: academicYearId as string,
        term: parseInt(term as string)
      },
      include: { subject: true }
    })) as any[];

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Stream the PDF to the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ReportCard_${student.admissionNumber}.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('IKONEX ACADEMY', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Excellence in Education', { align: 'center' });
    doc.moveDown(2);

    // Student Details
    doc.fontSize(14).font('Helvetica-Bold').text('OFFICIAL REPORT CARD');
    doc.moveDown();
    doc.fontSize(12).font('Helvetica');
    doc.text(`Name: ${student.firstName} ${student.lastName}`);
    doc.text(`Admission Number: ${student.admissionNumber}`);
    doc.text(`Stream: ${student.stream.name}`);
    doc.text(`Term: ${term} | Academic Year: 2024`);
    doc.moveDown(2);

    // Table Header
    const tableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Subject', 50, tableTop);
    doc.text('Total', 250, tableTop);
    doc.text('Grade', 350, tableTop);
    doc.text('Position', 450, tableTop);

    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown(1);

    // Table Content
    let y = doc.y;
    doc.font('Helvetica');
    for (const result of results) {
      doc.text(result.subject.name, 50, y);
      doc.text(result.total.toFixed(1), 250, y);
      doc.text(result.grade, 350, y);
      doc.text(result.subjectPosition.toString(), 450, y);
      y += 20;
    }

    doc.moveDown(2);
    doc.y = y + 20;

    // Averages and Ranks
    if (results.length > 0) {
      const overall = results[0];
      doc.font('Helvetica-Bold');
      doc.text(`Overall Average: ${overall.average.toFixed(2)}%`, 50, doc.y);
      doc.text(`Overall Position: ${overall.overallPosition}`, 250, doc.y);
      doc.moveDown(2);
    }

    // Signatures
    doc.font('Helvetica');
    doc.text('Class Teacher Remarks: __________________________________________________', 50, doc.y);
    doc.moveDown(3);
    doc.text('Principal Signature: _______________________', 50, doc.y);
    
    // QR Code mock
    doc.text('[ QR CODE PLACEHOLDER ]', 400, doc.y - 15);

    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate report' });
    }
  }
});

export default router;
