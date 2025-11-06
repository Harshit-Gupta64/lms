import React, { useContext } from 'react'
import { assets } from '../../assets/assets' 
import {Link,useLocation} from 'react-router-dom'
import { useClerk,UserButton,useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

function Navbar() {

    const location=useLocation()
    const isCourseListPage=location.pathname.includes('/course-list')//this is done to change the bg color based oon the loaction
    const {navigate,isEducator,backendUrl,setIsEducator,getToken}=useContext(AppContext)

    const {openSignIn} = useClerk()//when we click on open sign-up button this will open the form
    const {user}=useUser()

    const becomeEducator = async () => {
        try {
            if (isEducator) {
            navigate('/educator')
            return;
            }

            const token = await getToken()
            const { data } = await axios.get(
            backendUrl + '/api/educator/update-role',
            { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
            setIsEducator(true)
            toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            // error handling
            toast.error(error.message)
        }
    }


    return (
        
        <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 ${isCourseListPage?'bg-white':'bg-cyan-100/70'}`}> {/* here is this color change based on the path */}

            {/* For big screen */}
            <img src={assets.logo} alt="logo" className='w-28 lg:w-32 cursor-pointer' onClick={()=>navigate('/')} />
            <div className='hidden md:flex items-center gap-5 text-gray-500 py-4 '>
                <div className='flex items-center gap-5'>            {/* For mobile */}
                
                {/* this is for when and when is user logged in then only it will doisply these things not before like it should be. so this checks if user is logged in and it is rendered the render these two things */}
                {    
                    user &&
                    <>
                        <button onClick={becomeEducator}>{isEducator?'Educator Dashboard': 'Become Educator'}</button>
                        <Link to='/my-enrollments'> My Enrollments </Link>
                    </>
                }
                </div>

                {
                    //when user is already signed in(when signed in)
                    user? <UserButton/>//this alone manages the after loging in the stuff(like signout and manage acc)
                    :
                    // Sign-Up button (when not signed up)
                    //this onClick will open an sign-in portal
                    <button  onClick={()=>openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>
                        Create Account
                    </button>
                    // when signed-in,the user-logo will be the google logo of the acc 
                }
            </div>

            {/* For phone screen */}
            <div className='md:hidden flex items-center gap-5 sm:gap-5 text-gray-500'>
                <div className='flex items-center gap-1 sm:gap-2 max-sm:text:xs'>
                    {    
                    user &&
                    <>
                         <button onClick={becomeEducator}>{isEducator?'Educator Dashboard': 'Become Educator'}</button>
                        <Link to='/my-enrollments'> My Enrollments </Link>
                    </>
                    }
                </div>
                {
                    user? <UserButton/> :<button onClick={()=>openSignIn()}><img src={assets.user_icon} alt="user_icon" /></button>//when not logged in show a common logo but when logged in show there own profile pic
                }
                
            </div>
        </div>
    )
}

export default Navbar
