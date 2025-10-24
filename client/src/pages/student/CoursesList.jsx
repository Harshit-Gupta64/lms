import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

function CoursesList() {

const {navigate,allCourses}= useContext(AppContext)
const {input}= useParams()//for taking the data from url
const [filteredCourse,setFilteredCourse]=useState([])

useEffect(()=>{
    if(allCourses && allCourses.length>0){
        const tempCourses=allCourses.slice()//if all courses are there then display it only

        input ?
        setFilteredCourse(
            tempCourses.filter(item=> item.courseTitle.toLowerCase().includes(input.toLowerCase()))//if there is somthing in the url based on that we are filreing out
        )
        :setFilteredCourse(tempCourses)//if no input in the url then disply the whole list
    }
},[allCourses,input])

    return (
        <>
            <div className='relative md:px-36 px-8 pt-20 text-left'>
                <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                    <div>
                        <h1 className='text-4xl font-semibold text-gray-800'>
                        Course List
                        </h1>
                        <p className='text-gray-500'><span className='text-blue-600 cursor-pointer' onClick={()=>navigate('/')}>Home</span> / <span>Course List</span>
                        </p>
                    </div>
                    <SearchBar data={input}/>
                    {/* search logic in the search component */}
                </div>
                {
                    //this is to delete the recent search and go back to the original course page
                    input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600'>
                        <p>{input}</p>
                        <img src={assets.cross_icon} alt="cross" className='cursor-pointer' onClick={()=>navigate('/course-list')} />
                    </div>

                }
                <div className='grid grid-cols-l sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
                    {filteredCourse.map((course,index)=><CourseCard key={index} course={course}/>)}
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default CoursesList
