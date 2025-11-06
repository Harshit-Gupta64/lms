import React from 'react'
import {Route, Routes,useMatch} from 'react-router-dom'
import Home from './pages/student/Home'
import CourseDetails from './pages/student/CourseDetails'
import CoursesList from './pages/student/CoursesList'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Addcourse from './pages/educator/AddCourse'
import Dashboard from './pages/educator/Dashboard'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css"
import { ToastContainer} from 'react-toastify';


function App() {
  const isEducatorRoute=useMatch('/educator/*')//for hiding the navbar when in eduactor link as it is diffrent for the educator
  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer/>
      {!isEducatorRoute && <Navbar/>}
      {/* when it is false (not in the educator path) it will show this navbar */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/course-list' element={<CoursesList/>}/>
        <Route path='/course-list/:input' element={<CoursesList/>}/>
        <Route path='/course/:id' element={<CourseDetails/>}/>
        <Route path='/my-enrollments' element={<MyEnrollments/>}/>
        <Route path='/player/:courseId' element={<Player/>}/>
        <Route path='/loading/:path' element={<Loading/>}/>   
        <Route path='/educator' element={<Educator/>}>{/*Nested Route Starts*/}
          <Route path='/educator' element={<Dashboard/>}/>   
          <Route path='add-course' element={<Addcourse/>}/>
          <Route path='my-courses' element={<MyCourses/>}/>
          <Route path='student-enrolled' element={<StudentsEnrolled/>}/>
        </Route>    
      </Routes>
    </div>
  )
}

export default App
