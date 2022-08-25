import mongoose from 'mongoose'

export const generateId = () => {
  return new mongoose.Types.ObjectId().toHexString()
}
