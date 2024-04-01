import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <header className='w-full h-20 border-b-2 border-slate-200 px-4'>
      <div className='lg:max-w-screen-lg mx-auto flex items-center justify-between h-full'>
        <div className='pt-8 pl-4 pb-7 flex items-center gap-x-3'>
          DevCentral
        </div>
      </div>
    </header>
  )
}

export default Header