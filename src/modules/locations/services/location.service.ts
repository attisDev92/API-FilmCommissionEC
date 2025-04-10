import Location from '../schemas/Location'
import { CustomError, ErrorsMessage } from '../../../shared/CustomError'
import { HttpStatus } from '../../../shared/HttpResponse'
import { LocationTypes } from '../interfaces/location.interface'
import User from '../../users/schemas/User'

export const findLocationById = async (id: string) => {
  try {
    const location = await Location.findById(id)
    if (!location) {
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
    }
    return location
  } catch (error) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.NOT_EXIST)
  }
}

export const fetchLocations = async () => {
  const locations = await Location.find({})

  if (!locations) {
    throw new CustomError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorsMessage.SERVER_ERROR,
    )
  }

  return locations
}

export const createLocation = async (locationToCreate: LocationTypes) => {
  const user = await User.findById(locationToCreate.userId)

  if (!user) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  const isLocationExist = await Location.findOne({
    name: locationToCreate.name,
  })

  if (isLocationExist) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  const location = new Location(locationToCreate)
  await location.save()

  user.locations = user.locations
    ? user.locations.concat(location.id)
    : [location.id]

  await user.save()
  return location
}

export const updateLoction = async (locationToUpdate: LocationTypes) => {
  const location = await Location.findById(locationToUpdate.id)

  if (!location) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  Object.keys(locationToUpdate).forEach(key => {
    const typedKey = key as keyof LocationTypes
    if (locationToUpdate[typedKey] !== undefined) {
      location[typedKey] = locationToUpdate[typedKey]
    }
  })

  await location.save()
  return location
}

export const destroyLocation = async (locationId: string) => {
  const location = await Location.findById(locationId)

  if (!location) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  await Location.deleteOne({ _id: locationId })
}
