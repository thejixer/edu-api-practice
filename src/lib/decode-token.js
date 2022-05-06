import jwt from 'jsonwebtoken'

export default async function decodeToken(token) {
  const arr = token.split(' ');

  try {
    if (arr[0] === 'ut') {
      return jwt.verify(arr[1], 'SECRET');
    }
  
    throw new Error('Please Re-Sign In')
  } catch (error) { 
    throw error
  }
}
