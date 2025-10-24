import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets, dummyStudentEnrolled } from '../../assets/assets'

function StudentsEnrolled() {
  // state for enrolled students
  const [enrolledStudents, setEnrolledStudents] = useState(null)

  // fetching enrolled students (dummy for now)
  const fetchEnrolledStudents = async () => {
    setEnrolledStudents(dummyStudentEnrolled)
  }

  // run once on mount
  useEffect(() => {
    fetchEnrolledStudents()
  }, [])

  // render UI if data exists, else loading
  return enrolledStudents ? (
    <>
      <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
        <div className='w-full'>
          <h2 className='pb-4 text-lg font-medium'>Students Enrolled</h2>
          <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
            <table className='table-fixed md:table-auto overflow-hidden text-gray-900 border-b border-gray-500/20 text-sm text-left w-full'>
              <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
                <tr>
                  <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                  <th className='px-4 py-3 font-semibold'>Student Name</th>
                  <th className='px-4 py-3 font-semibold'>Course Title</th>
                  <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>
                </tr>
              </thead>
              <tbody className='text-sm text-gray-500'>
                {enrolledStudents.map((item, index) => (
                  <tr key={index} className='border-b border-gray-500/20'>
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                    <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                      <img
                        src={item.student.imageUrl}
                        alt='Student'
                        className='w-10 h-10 rounded-full object-cover'
                      />
                      <span>{item.student.name}</span>
                    </td>
                    <td className='px-4 py-3'>{item.courseTitle}</td>
                    <td className='px-4 py-3 hidden sm:table-cell'>
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  )
}

export default StudentsEnrolled
