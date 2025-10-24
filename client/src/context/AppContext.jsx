import { createContext, useEffect, useState } from "react";  // createContext is like a global var which can be passed to all the components(can be accessed all the components which has access to it)
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';


export const AppContext=createContext() //This context will be used to store and provide shared data (like global state or settings) to components that need it.

export const AppContextProvider=(props)=>{ //This is like a wrapper around parts of your app that need access to the shared context.

    const currency=import.meta.env.VITE_CURRENCY//to be sent to all the child through value

    const [allCourses,setAllCourses]=useState([])
    const [isEducator,setIsEducator]=useState(true)
    const [enrolledCourses,setEnrolledCourses]=useState([])
    

    const navigate=useNavigate()


    //fetch all courses
    const fetchAllCourses=async()=>{
        setAllCourses(dummyCourses)
    } 

    //funcyion to calculate average rating of course
    const calculateRating=(course)=>{
        if(course.courseRatings.length===0){
            return 0;
        }
        let totalRating=0
        course.courseRatings.forEach(rating=>{
            totalRating+=rating.rating
        })
        return totalRating/course.courseRatings.length
    }

    //Funtion to calculate course chapter time(total chapter time)
    const calculateChapterTime=(chapter) =>{
        let time=0
        chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
        return humanizeDuration(time*60*1000,{units:["h","m"]})//this will forst convert to ms then it will return in hrs and mins
    }

    //Funtion to calculate course Duration
    const calculateCourseDuration=(course)=>{
        let time =0 
        course.courseContent.map((chapter)=>chapter.chapterContent.map(
            (lecture)=>time+=lecture.lectureDuration
        ))
        return humanizeDuration(time*60*1000,{units:["h","m"]})
    }

    //Funtion calculate No of lecture in the course
    const calculateNoOfLectures=(course)=>{
        let totalLectures=0
        course.courseContent.forEach(chapter=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures+=chapter.chapterContent.length
            }
        })
        return totalLectures
    }

    //Fetch User Enrolled course
    const fetchUserEnrolledCourses=async()=>{
        setEnrolledCourses(dummyCourses)
    }

    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])

    const value={
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateCourseDuration,
        calculateChapterTime, 
        calculateNoOfLectures,
        enrolledCourses,
        fetchUserEnrolledCourses
    } //You're creating a value object that will be passed down through the context.
    return(
        //is a provider component that makes the value accessible to all child components that consume this context.
        <AppContext.Provider value={value}>  
            {props.children} {/*You’re rendering whatever components were passed inside */}
        </AppContext.Provider>
    )
}








//props FUNCTIONING
// function Greeting(props) {
//   return <h1>Hello {props.name}!</h1>;
// }

// // Usage
// <Greeting name="Harshit" />
