import prisma from '../prisma';

interface ScoreEntry {
  studentId: string;
  totalScore: number;
}

export class GradingEngine {
  /**
   * Assigns dense rank to a list of scores.
   * Modifies the objects in place or returns a Map of studentId -> rank.
   */
  static calculateDenseRanks(entries: ScoreEntry[]): Map<string, number> {
    // Sort descending
    const sorted = [...entries].sort((a, b) => b.totalScore - a.totalScore);
    const ranks = new Map<string, number>();

    let currentRank = 1;
    let previousScore: number | null = null;

    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      if (previousScore !== null && entry.totalScore < previousScore) {
        currentRank++;
      }
      ranks.set(entry.studentId, currentRank);
      previousScore = entry.totalScore;
    }

    return ranks;
  }

  /**
   * Maps a score to a grade based on the grading scale array.
   */
  static getGrade(score: number, scales: { minScore: number; maxScore: number; grade: string }[]): string {
    const scale = scales.find((s) => score >= s.minScore && score <= s.maxScore);
    return scale ? scale.grade : 'E'; // Default to E if out of bounds or missing
  }

  /**
   * Main engine execution: Process results for a given stream, academic year, and term.
   */
  static async processStreamResults(streamId: string, academicYearId: string, term: number) {
    // 1. Fetch Grading Scales
    const scales = await prisma.gradingScale.findMany();

    // 2. Fetch all students in the stream
    const students = await prisma.student.findMany({
      where: { streamId }
    });

    // 3. Fetch all assessments for this stream, year, and term (we'll assume term is linked to assessments or we just process all for the year for simplicity - usually assessments would have a term field, but our schema didn't have one on Assessment. Let's process by academic year and just store the term in the result)
    const assessments = await prisma.assessment.findMany({
      where: { streamId, academicYearId },
      include: {
        scores: true
      }
    });

    // Group assessments by subject
    const subjectAssessments = new Map<string, typeof assessments>();
    for (const assessment of assessments) {
      if (!subjectAssessments.has(assessment.subjectId)) {
        subjectAssessments.set(assessment.subjectId, []);
      }
      subjectAssessments.get(assessment.subjectId)!.push(assessment);
    }

    // Prepare data structures for ranks
    // Map<subjectId, Map<studentId, { total: number }>>
    const subjectTotals = new Map<string, Map<string, number>>();
    const studentOverallAverages = new Map<string, { totalSum: number, count: number }>();

    // 4. Calculate total scores per subject for each student
    for (const student of students) {
      studentOverallAverages.set(student.id, { totalSum: 0, count: 0 });

      for (const [subjectId, assts] of subjectAssessments.entries()) {
        let subjectTotal = 0;
        let possibleMax = 0;

        for (const assessment of assts) {
          const scoreRecord = assessment.scores.find(s => s.studentId === student.id);
          if (scoreRecord) {
             // Multiply by weight if defined
             subjectTotal += scoreRecord.score * assessment.weight;
          }
          possibleMax += assessment.maxScore * assessment.weight;
        }

        // Normalize to 100% if we want, or just use raw totals. Usually graded over 100
        const percentage = possibleMax > 0 ? (subjectTotal / possibleMax) * 100 : 0;
        
        if (!subjectTotals.has(subjectId)) {
          subjectTotals.set(subjectId, new Map());
        }
        subjectTotals.get(subjectId)!.set(student.id, percentage);

        const overall = studentOverallAverages.get(student.id)!;
        overall.totalSum += percentage;
        overall.count += 1;
      }
    }

    // 5. Calculate Subject Dense Ranks
    const subjectRanks = new Map<string, Map<string, number>>();
    for (const [subjectId, studentScores] of subjectTotals.entries()) {
      const entries: ScoreEntry[] = Array.from(studentScores.entries()).map(([studentId, totalScore]) => ({
        studentId,
        totalScore
      }));
      subjectRanks.set(subjectId, this.calculateDenseRanks(entries));
    }

    // 6. Calculate Overall Class Dense Rank
    const overallEntries: ScoreEntry[] = [];
    for (const student of students) {
      const overall = studentOverallAverages.get(student.id)!;
      const avg = overall.count > 0 ? overall.totalSum / overall.count : 0;
      overallEntries.push({ studentId: student.id, totalScore: avg });
    }
    const overallRanks = this.calculateDenseRanks(overallEntries);

    // 7. Upsert Results to Database
    const resultsData = [];
    for (const student of students) {
      const overallRank = overallRanks.get(student.id) || 1;
      const overall = studentOverallAverages.get(student.id)!;
      const average = overall.count > 0 ? overall.totalSum / overall.count : 0;

      for (const [subjectId, subjectScoreMap] of subjectTotals.entries()) {
        const total = subjectScoreMap.get(student.id) || 0;
        const grade = this.getGrade(total, scales);
        const subjectRank = subjectRanks.get(subjectId)?.get(student.id) || 1;

        resultsData.push({
          studentId: student.id,
          subjectId,
          academicYearId,
          term,
          total,
          average,
          grade,
          subjectPosition: subjectRank,
          overallPosition: overallRank
        });
      }
    }

    // Perform upserts in a transaction
    await prisma.$transaction(
      resultsData.map(data => 
        prisma.studentResult.upsert({
          where: {
            studentId_subjectId_academicYearId_term: {
              studentId: data.studentId,
              subjectId: data.subjectId,
              academicYearId: data.academicYearId,
              term: data.term
            }
          },
          update: {
            total: data.total,
            average: data.average,
            grade: data.grade,
            subjectPosition: data.subjectPosition,
            overallPosition: data.overallPosition
          },
          create: data
        })
      )
    );

    return { processedCount: students.length };
  }
}
