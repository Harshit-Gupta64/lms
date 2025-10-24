import React, { useEffect, useState } from 'react'

function Rating({initialRating,onRate}) {//this parameter is for the rating given by the user and onRate will be the function to handle the rating
    const [rating,setRating]=useState(initialRating || 0)
    const handleRating=(value)=>{
        setRating(value)
        if(onRate) onRate(value)
    }
    useEffect(()=>{
        if(initialRating){
            setRating(initialRating)
        }
    },[initialRating])
    return (
        <>
            <div>
                {Array.from({length:5},(_,index)=>{
                    const startValue=index+1
                    return (
                        <span key={index} className={`text-xl sm:text-2xl cursor-pointer transition-colors ${startValue<=rating?' text-yellow-500':'text-gray-400 hover:text-yellow-400'}`}
                        onClick={()=>handleRating(startValue)}>
                            &#9733;
                        </span>
                    )
                })}
            </div>
        </>
    )
}

export default Rating
