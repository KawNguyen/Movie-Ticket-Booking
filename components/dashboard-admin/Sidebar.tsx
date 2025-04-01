import { LayoutDashboard } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SidebarProps {
  navItems: {
    name: string;
    icon: React.ReactNode;
  }[];
}

const Sidebar = ({ navItems }: SidebarProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab')

  const handleTabClick = (name: string) => {
    router.push(`?tab=${name.toLowerCase().replace(/\s+/g, '-')}`)
  }

  return (
    <nav className='min-h-screen w-52 p-4 border-x border-dotted'>
      <div className='flex items-center gap-2 p-2'>
        <LayoutDashboard size={20} />
        <span className='text-lg font-semibold'>Dashboard</span>
      </div>
      <div className='mt-4 flex flex-col gap-2'>
        {navItems?.map((item, index) => (
          <div
            key={item.name + index}
            className={`w-full p-2 hover:bg-gray-800 rounded-md cursor-pointer flex items-center gap-2 transition-colors ${
              currentTab === item.name.toLowerCase().replace(/\s+/g, '-') ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => handleTabClick(item.name)}
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