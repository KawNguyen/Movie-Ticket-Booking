
import React from 'react'
import { LayoutDashboard } from 'lucide-react'



const Sidebar = ({navItems, setActiveTab}: SidebarProps) => {
  return (
    <nav className='h-full w-52 p-4 border-x border-dotted'>
      <div className='flex items-center gap-2 p-2'>
        <LayoutDashboard size={20} />
        <span className='text-lg font-semibold'>Dashboard</span>
      </div>
      <div className='mt-4 flex flex-col gap-2'>
        {navItems?.map((item,index)=>(
          <div
            key={item.name + index}
            className="w-full p-2 hover:bg-gray-800 rounded-md cursor-pointer flex items-center gap-2"
            onClick={() => setActiveTab?.(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </nav>
  )
}

export default Sidebar