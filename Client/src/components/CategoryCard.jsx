import React from 'react'

const CategoryCard = ({name, image, onClick}) => {
  return (
    <div className='relative w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#32CD32]
    shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow cursor-pointer' 
    onClick={onClick}>
      <img src={image} alt="" className='w-full h-full object-cover transform hover:scale-110
      transition-transform duration-300' />
      <div className='absolute bottom-0 w-full left-0 bg-[#ffffff96] bg-opacity-95 px-3
      py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur'>
        {name}
      </div>
    </div>
  )
}

export default CategoryCard
