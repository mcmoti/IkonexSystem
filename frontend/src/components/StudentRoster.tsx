import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Upload, X, FileText, TrendingUp, Award } from 'lucide-react';

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  stream: string;
  gender: string;
}

export default function StudentRoster() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mock data
  const students: Student[] = [
    { id: '1', admissionNumber: 'IKX-001', firstName: 'John', lastName: 'Doe', stream: 'Form 1A', gender: 'M' },
    { id: '2', admissionNumber: 'IKX-002', firstName: 'Jane', lastName: 'Smith', stream: 'Form 1A', gender: 'F' },
    { id: '3', admissionNumber: 'IKX-003', firstName: 'Alice', lastName: 'Johnson', stream: 'Form 1B', gender: 'F' },
    { id: '4', admissionNumber: 'IKX-004', firstName: 'Bob', lastName: 'Williams', stream: 'Form 2A', gender: 'M' },
  ];

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium text-navy">Student Roster</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-cobalt focus:border-cobalt outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Bulk CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adm No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stream</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr 
                key={student.id} 
                onClick={() => setSelectedStudent(student)}
                className="hover:bg-ice-blue cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.admissionNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.lastName}, {student.firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.stream}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-medium text-navy">Student Profile</h3>
                <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-16 w-16 bg-cobalt rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                    <p className="text-gray-500">{selectedStudent.admissionNumber} • {selectedStudent.stream}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Academic Summary */}
                  <div className="bg-ice-blue p-4 rounded-lg border border-blue-100">
                    <h4 className="flex items-center gap-2 font-medium text-navy mb-3"><Award className="h-5 w-5 text-cobalt" /> Current Term Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Average Grade</p>
                        <p className="text-xl font-bold text-success">A-</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Class Position</p>
                        <p className="text-xl font-bold text-navy">3<span className="text-sm font-normal">/45</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Performance Trend */}
                  <div>
                    <h4 className="flex items-center gap-2 font-medium text-navy mb-3"><TrendingUp className="h-5 w-5 text-cobalt" /> Position History</h4>
                    <div className="h-32 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-gray-400">
                      [Recharts Trend Line Placeholder]
                    </div>
                  </div>

                  {/* Report Cards */}
                  <div>
                    <h4 className="flex items-center gap-2 font-medium text-navy mb-3"><FileText className="h-5 w-5 text-cobalt" /> Report Cards</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded hover:border-cobalt hover:bg-ice-blue transition-colors group">
                        <span className="text-gray-700 group-hover:text-cobalt">Term 1, 2024</span>
                        <FileText className="h-4 w-4 text-gray-400 group-hover:text-cobalt" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded hover:border-cobalt hover:bg-ice-blue transition-colors group">
                        <span className="text-gray-700 group-hover:text-cobalt">Term 3, 2023</span>
                        <FileText className="h-4 w-4 text-gray-400 group-hover:text-cobalt" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
