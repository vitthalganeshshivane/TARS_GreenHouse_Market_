import { Link } from 'react-router';
import { cn } from "@/lib/utils"

const NavbarBtn = ({ icon, text, badge, link, className }) => {
  const { status, value } = badge;
  return (
    <Link to={link} className={cn('flex justify-between items-center relative md:w-15 md:m-5', className)}>
      <div className='flex justify-between items-center gap-1'>
        <span>
          {icon}
        </span>
        <span className='hidden md:inline text-gray-500'>{text}</span>
      </div>

      {/* badge */}
      {
        status &&
        <div className='flex justify-center items-center p-1 text-white absolute w-3 h-3 bg-green-500 rounded-full left-3 -top-1'>
          <span className='text-[.6rem]'>
            {value}
          </span>
        </div>
      }
    </Link>
  )
}

export default NavbarBtn
