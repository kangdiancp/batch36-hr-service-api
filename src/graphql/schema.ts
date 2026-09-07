import { employeeTypeDefs } from '../modules/employees/graphql/employees.typedefs'
import { employeeResolvers } from '../modules/employees/graphql/employees.resolvers'

export const schema = employeeTypeDefs

export const resolvers = employeeResolvers