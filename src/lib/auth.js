
import User from '../models/User'

export default async function requireAuth(user) {

  if (!user || !user._id) throw new Error('Unathorized')
  
  const me = await User.findById(user._id)

  if (!me || !me._id) throw new Error('Unauthorized')
  
  return me
}