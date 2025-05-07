import { Link } from 'react-router-dom'
import Logo from '../Logo'
import UserMenu from './UserMenu'

export function Header() {
  return (
    <header className='py-2'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <Link to='/' className='flex items-center space-x-2'>
            <Logo variant='light' className='h-8 w-auto' />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
