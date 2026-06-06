import { Users, BookOpen, GraduationCap, FileText } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const metrics = [
    { title: 'Total Students', value: '1,245', icon: <Users className="h-6 w-6 text-cobalt" /> },
    { title: 'Total Streams', value: '24', icon: <BookOpen className="h-6 w-6 text-success" /> },
    { title: 'Subjects', value: '14', icon: <GraduationCap className="h-6 w-6 text-warning" /> },
    { title: 'Assessments', value: '86', icon: <FileText className="h-6 w-6 text-danger" /> },
  ];

  const performanceTrendData = [
    { term: 'Term 1 2023', average: 65 },
    { term: 'Term 2 2023', average: 68 },
    { term: 'Term 3 2023', average: 66 },
    { term: 'Term 1 2024', average: 71 },
    { term: 'Term 2 2024', average: 74 },
  ];

  const gradeDistributionData = [
    { grade: 'A', count: 45 },
    { grade: 'A-', count: 60 },
    { grade: 'B+', count: 80 },
    { grade: 'B', count: 110 },
    { grade: 'B-', count: 130 },
    { grade: 'C+', count: 150 },
    { grade: 'C', count: 140 },
    { grade: 'C-', count: 120 },
    { grade: 'D+', count: 90 },
    { grade: 'D', count: 50 },
    { grade: 'E', count: 20 },
  ];

  const topStudents = [
    { id: 1, name: 'Alice Johnson', stream: 'Form 4A', average: '92.5%', grade: 'A' },
    { id: 2, name: 'Bob Williams', stream: 'Form 4B', average: '91.8%', grade: 'A' },
    { id: 3, name: 'Charlie Davis', stream: 'Form 3A', average: '90.2%', grade: 'A' },
    { id: 4, name: 'Diana Evans', stream: 'Form 2A', average: '89.7%', grade: 'A' },
    { id: 5, name: 'Ethan Foster', stream: 'Form 1C', average: '88.9%', grade: 'A' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-ice-blue rounded-lg">
              {metric.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <h3 className="text-2xl font-bold text-navy">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-navy mb-6">Performance Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="average" stroke="#1D4ED8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-navy mb-6">Grade Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#F0F9FF' }}
                />
                <Bar dataKey="count" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium text-navy mb-4">Top Performing Students</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topStudents.map((student, idx) => (
                <tr key={student.id} className="hover:bg-ice-blue transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">#{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.stream}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-success">{student.average}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
