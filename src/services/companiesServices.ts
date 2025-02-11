import Company from '../models/Company'
import { CompanyTypes } from '../types/companyTypes'
import { CustomError, ErrorsMessage } from '../shared/CustomError'
import { HttpStatus } from '../shared/HttpResponse'
import User from '../models/User'

export const findCompanyById = async (companyId: string) => {
  return await Company.findById(companyId)
}

export const createCompany = async (companyToCreate: CompanyTypes) => {
  console.log(companyToCreate)

  const user = await User.findById(companyToCreate.userId)

  console.log(user)
  if (!user) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  const isCompanyExist = await Company.findOne({
    company: companyToCreate.company,
  })

  if (isCompanyExist) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  const company = new Company(companyToCreate)
  await company.save()

  user.companies = user.companies
    ? user.companies.concat(company.id)
    : [company.id]

  await user.save()
  return company
}
