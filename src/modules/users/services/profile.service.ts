import { ObjectId } from 'mongoose'
import User from '../schemas/User'
import { UserType } from '../interfaces/user.interface'
import UserProfile from '../schemas/UserProfile'
import { CustomError, ErrorsMessage } from '../../../shared/CustomError'
import { HttpStatus } from '../../../shared/HttpResponse'

export const getProfileFromUser = async (userId: ObjectId) => {
  const user = (await User.findById(userId)) as UserType

  if (!user.profile) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  const profile = await UserProfile.findById(user.profile)

  if (!profile) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.NOT_EXIST)
  }

  return profile
}

export const postNewProfile = async (newProfile: UserProfile) => {
  const user = await User.findById(newProfile.userId)
  if (!user) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  const isProfileExist = await UserProfile.findOne({
    userId: newProfile.userId,
  })
  if (isProfileExist || user.profile) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  const userProfile = new UserProfile(newProfile)
  await userProfile.save()

  user.profile = userProfile.id
  await user.save()

  return userProfile
}
