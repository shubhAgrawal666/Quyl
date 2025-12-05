import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Category({img,heading}){
    return (
        <div className='mt-5 ml-3 mr-3 p-3 border-black border-2 rounded-[20px] h-[150px] w-[150px]'>
            <div className='mb-5'>
                <FontAwesomeIcon icon={img} size="3x" mb-2/>
            </div>
            <div>{heading}</div>
        </div>
    );
}