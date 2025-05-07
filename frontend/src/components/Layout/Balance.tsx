import { useAuth } from '@/contexts/AuthContext'

export default function Balance() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className='flex items-center space-x-2'>
      <span className='text-sm font-medium text-gray-700'>Saldo:</span>
      <span className='text-sm font-bold text-green-600'>R$ 1.234,56</span>
    </div>
  )
}
