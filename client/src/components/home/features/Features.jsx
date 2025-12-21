import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Features({img,heading,content}){
    return(
            <div
  className="
    mt-5 mx-3 p-4
    border-black border-2 rounded-[20px]
    w-full max-w-[300px]
    h-auto sm:h-[200px]
    flex flex-col gap-2
  "
>
  {/* Icon Box */}
  <div
    className="
      border-black border-2 rounded-lg
      w-[50px] h-[50px]
      sm:w-[60px] sm:h-[60px]
      flex items-center justify-center
    "
  >
    <FontAwesomeIcon
      icon={img}
      className="text-2xl sm:text-3xl"
    />
  </div>

  {/* Heading */}
  <div className="text-lg sm:text-2xl font-semibold">
    {heading}
  </div>

  {/* Content */}
  <div className="text-sm sm:text-[17px] text-gray-700">
    {content}
  </div>
</div>

    );
}