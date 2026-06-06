import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // We might need to install react-hot-toast or just mock it

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface Assessment {
  id: string;
  name: string;
  maxScore: number;
}


export default function AssessmentConsole({ streamId, subjectId }: { streamId: string; subjectId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({}); // key: `${studentId}-${assessmentId}`
  const [isSaving, setIsSaving] = useState(false);

  // In a real app we'd fetch this using React Query. 
  // We'll mock the fetch logic for this component.
  useEffect(() => {
    // Mock data fetch
    setStudents([
      { id: '1', firstName: 'John', lastName: 'Doe' },
      { id: '2', firstName: 'Jane', lastName: 'Smith' },
    ]);
    setAssessments([
      { id: 'a1', name: 'CAT 1', maxScore: 30 },
      { id: 'a2', name: 'CAT 2', maxScore: 30 },
      { id: 'a3', name: 'End Term', maxScore: 70 },
    ]);
    setScores({
      '1-a1': 25,
      '2-a1': 28,
    });
  }, [streamId, subjectId]);

  const handleScoreChange = (studentId: string, assessmentId: string, value: string, maxScore: number) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    if (numValue < 0) numValue = 0;
    if (numValue > maxScore) numValue = maxScore;

    setScores(prev => ({
      ...prev,
      [`${studentId}-${assessmentId}`]: numValue
    }));
  };

  const handleBulkSave = async () => {
    setIsSaving(true);
    const payload = Object.entries(scores).map(([key, score]) => {
      const [studentId, assessmentId] = key.split('-');
      return { studentId, assessmentId, score };
    });

    try {
      // await axios.post('/api/scores/batch', { scores: payload });
      console.log('Sending payload:', payload);
      toast.success('Scores saved successfully!');
    } catch (error) {
      toast.error('Failed to save scores.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-navy">Assessment Scores</h2>
        <button
          onClick={handleBulkSave}
          disabled={isSaving}
          className="bg-cobalt text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save All Scores'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                Student Name
              </th>
              {assessments.map(asst => (
                <th key={asst.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {asst.name} <span className="text-gray-400 block mt-1">/ {asst.maxScore}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, idx) => (
              <tr key={student.id} className="hover:bg-ice-blue transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-ice-blue">
                  {idx + 1}. {student.lastName}, {student.firstName}
                </td>
                {assessments.map(asst => (
                  <td key={asst.id} className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      min="0"
                      max={asst.maxScore}
                      value={scores[`${student.id}-${asst.id}`] ?? ''}
                      onChange={(e) => handleScoreChange(student.id, asst.id, e.target.value, asst.maxScore)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-cobalt focus:border-cobalt outline-none transition-all"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
