import User from '../models/User'

export default async function requireAuth(user) {

  try {
    printError('first of require auth')
  
    if (!user || !user._id) throw new Error('Unathorized')
    printError('first of require auth', user)
    
    const me = await User.findById(user._id)
    printError('first of require auth', me)
  
    if (!me || !me._id) throw new Error('Unauthorized')
    
    return me
  } catch (error) {
    printError(error)
    throw new Error('Unauthorized')
  }
}