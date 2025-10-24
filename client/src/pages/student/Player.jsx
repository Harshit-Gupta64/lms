import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'


function Player() 
{
    const {enrolledCourses,calculateChapterTime}=useContext(AppContext)
    const {courseId}=useParams()
    const [courseData,setCourseData]=useState(null)
    const [openSections,setOpenSections]=useState({})
    const [playerData,setPlayerData]=useState(null)

    const getCourseData=()=>{
        enrolledCourses.map((course)=>{
            if(course._id===courseId){
                setCourseData(course)
        }
    })
    }
    useEffect(()=>{
        getCourseData()
    },[enrolledCourses])
    const toggleSection=(index)=>{
        setOpenSections((prev)=>(//this prev is the data stored in the openSections
            {...prev,//this is so the remaining value reamins unchanged and we need to change the things need to be changed
            [index]:!prev[index]}
        ))
    }
  return (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        {/* Left column */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>

          <div className='pt-5'>
            {courseData && courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className='border border-gray-300 bg-white mb-2 rounded'
              >
                {/* Chapter header */}
                <div
                  className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                  onClick={() => toggleSection(index)}
                >
                  <div className='flex items-center gap-2'>
                    <img
                      className={`transform transition-transform ${
                        openSections[index] ? 'rotate-180' : ''
                      }`}
                      src={assets.down_arrow_icon}
                      alt='arrow icon'
                    />
                    <p className='font-medium md:text-base text-sm'>
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p>
                    {chapter.chapterContent.length} lectures –{' '}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                {/* Chapter content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className='flex items-start gap-2 py-1'>
                        <img
                          src={false? assets.blue_play_icon:assets.play_icon}
                          alt='play icon'
                          className='w-4 h-4 mt-1'
                        />
                        <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-base'>
                          <p>{lecture.lectureTitle}</p>
                          <div className='flex gap-2'>
                            {lecture.lectureUrl && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    ...lecture, chapter:index+1, lecture:i+1
                                  })
                                }
                                className='text-blue-500 cursor-pointer'
                              >
                                Watch
                              </p>
                            )}
                            <p>
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                units: ['h', 'm'],
                              })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-x1 font-bold'>
                Rate this Course:
            </h1>
            <Rating initialRating={0}/>
          </div>
        </div>

        {/* Right column */}
        <div className='md:mt-10'>
          {/* You can add your video player or course preview section here */}
          {playerData ? (
            <div>
                 <YouTube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName='w-full aspect-video'/>
                 <div className='flex items-center justify-between mt-1'>
                    <p>
                        {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                    </p>
                    <button className='text-blue-600'>
                        {false?'Completed':'Mark as Complete'}
                    </button>
                 </div>
            </div>
          ):<img src={courseData? courseData.courseThumbnail:''} alt="" />}
          
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Player
