// src/grpc/server.ts
import path from 'node:path';
import { Server, ServerCredentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { ReflectionService } from '@grpc/reflection';
import * as employeeGrpcHandler from '../modules/employees/grpc/employees.grpc-handler';
import * as departmentGrpcHandler from '../modules/departments/grpc/department.grpc-handler'
/**
* Promise<Server> return promise, ini memastikan port sudah di bind (ikat),
* jangan sampai gRPC server sudah running, tapi port belum dibinding.
* Jika Sukses kita return resolve
* Jika Failed kita return reject
 */
export function startGrpcServer(port = 50051): Promise<Server> {
  return new Promise((resolve, reject) => {
    const protoPath = path.join(__dirname, 'protos/employee.proto');
    const packageDef = loadSync(protoPath, {
      keepCase: true,
      longs: Number,
      enums: String,
      defaults: true,
    });

    const proto = loadPackageDefinition(packageDef) as any;
    const server = new Server();

    server.addService(proto.hr.EmployeeService.service, {
      GetEmployee: employeeGrpcHandler.getEmployee,
      GetEmployeesForPayroll: employeeGrpcHandler.getEmployeesForPayroll,
      ListDepartments: departmentGrpcHandler.listDepartments,
    });

    /**
    * Gunakan reflection agar semua method/interface muncul di tool seperti Postman/Appollo,
    * tanpa refelction kita harus tentukan path file .proto nya.
     */
    const reflection = new ReflectionService(packageDef);
    reflection.addToServer(server);

    //bindAsync, gebukan GRPC_PORT=50051
    server.bindAsync(`0.0.0.0:${port}`, ServerCredentials.createInsecure(), (err, boundPort) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`[grpc] listening on :${boundPort}`);
      resolve(server);
    });
  });
}