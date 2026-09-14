import type { ServerWritableStream } from '@grpc/grpc-js';
import { status } from '@grpc/grpc-js';
import * as departmentService from '../departments.service';

function toGrpcResponse(row: { departmentId: number; departmentName: string }) {
  return {
    department_id: row.departmentId,
    department_name: row.departmentName,
  };
}

export async function listDepartments(call: ServerWritableStream<Record<string, never>, unknown>) {
  try {
    const { items } = await departmentService.listDepartments({ page: 1, limit: 1000 });
    for (const item of items) call.write(toGrpcResponse(item));
    call.end();
  } catch (err) {
    call.emit('error', { code: status.INTERNAL, message: (err as Error).message });
  }
}