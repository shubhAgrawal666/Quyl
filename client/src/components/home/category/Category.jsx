import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Category({img,heading}){
    return (
        <div className="
  mt-5 mx-3 
  p-3 
  border-black border-2 
  rounded-[20px]
  h-[120px] w-[120px]
  sm:h-[140px] sm:w-[140px]
  md:h-[150px] md:w-[150px]
  flex flex-col items-center justify-center
">
  <div className="mb-3 sm:mb-4">
    <FontAwesomeIcon
      icon={img}
      className="text-3xl sm:text-4xl"
    />
  </div>

  <div className="text-sm sm:text-base font-medium text-center">
    {heading}
  </div>
</div>

    );
}