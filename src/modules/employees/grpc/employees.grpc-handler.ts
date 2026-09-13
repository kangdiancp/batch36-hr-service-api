import type { sendUnaryData, ServerUnaryCall, ServerWritableStream } from '@grpc/grpc-js';
import { status } from '@grpc/grpc-js';
import * as employeeService from '../employees.service';
import { ApiError } from '../../../common/utils/api-error';
import type { EmployeeApiRow } from '../employees.types';

function toGrpcResponse(row: EmployeeApiRow) {
  return {
    employee_id: row.employeeId,
    first_name: row.firstName ?? '',
    last_name: row.lastName,
    email: row.email,
    salary: row.salary,
    job_id: row.jobId,
    department_id: row.departmentId ?? 0,
    employment_status: row.employmentStatus,
    employment_type: row.employmentType,
    hire_date: row.hireDate,
    updated_at: row.updatedAt, 
  };
}

// Mapping ApiError (HTTP-style) -> gRPC status code
function toGrpcError(err: unknown) {
  if (err instanceof ApiError) {
    const code = err.statusCode === 404 ? status.NOT_FOUND : status.INVALID_ARGUMENT;
    return { code, message: err.message };
  }
  return { code: status.INTERNAL, message: 'Internal error' };
}

export async function getEmployee(
  call: ServerUnaryCall<{ employee_id: number }, unknown>,
  callback: sendUnaryData<ReturnType<typeof toGrpcResponse>>,
) {
  try {
    const employee = await employeeService.getEmployeeById(call.request.employee_id);
    callback(null, toGrpcResponse(employee));
  } catch (err) {
    callback(toGrpcError(err) as any, null);
  }
}

export async function getEmployeesForPayroll(
  call: ServerWritableStream<{ department_id: number; employment_status: string }, unknown>,
) {
  try {
    // Streaming -> kita paging manual dari findAll yang sudah ada,
    // kita push per-batch ke stream biar ga sekali tarik 50rb row
    let page = 1;
    const limit = 15;
    const { department_id, employment_status } = call.request;

    while (true) {
      const { items, pagination } = await employeeService.listEmployees({
        page,
        limit,
        departmentId: department_id || undefined,
        employmentStatus: (employment_status || undefined) as any,
      });

      for (const item of items) call.write(toGrpcResponse(item));

      if (page >= pagination.totalPages) break;
      page++;
    }
    call.end();
  } catch (err) {
    call.emit('error', toGrpcError(err));
  }
}