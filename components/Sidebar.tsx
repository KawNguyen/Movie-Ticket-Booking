
import React from 'react'

interface SidebarProps {
  navItems?: any[]
  setActiveTab?: (tabName: string) => void
}

const Sidebar = ({navItems, setActiveTab}: SidebarProps) => {

  return (
    <nav className='h-full w-52 p-4 border-x border-dotted'>
      <span className='text-lg font-semibold p-2'>Dashboard</span>
      <div className='mt-4 flex flex-col gap-2'>
        {navItems?.map((item,index)=>(
          <div
            key={item + index}
            className="w-full p-2 hover:bg-gray-800 rounded-md cursor-pointer"
            onClick={() => setActiveTab?.(item.name)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </nav>
  )
}

export default Sidebar