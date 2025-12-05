import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Features({img,heading,content}){
    return(
            <div className='mt-5 ml-3 mr-3 p-3 border-black border-2 rounded-[20px] h-[200px] w-[300px]'>
                <div className='border-black border-2 w-[60px] rounded-lg'>
                 <FontAwesomeIcon icon={img} size="3x"/>
                </div>
                <div className='text-2xl p-1 m-1'>{heading}</div>
                <div className='text-[17px]'>{content}</div>
            </div>
    );
}