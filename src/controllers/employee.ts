import { Response } from 'express';
import { EmployeeService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

function getServiceContext(req: AuthenticatedRequest): ServiceContext {
  const user = req.user!;
  return {
    userId: user.userId,
    userRole: user.role,
    userEmail: user.email,
    userName: user.full_name || user.email,
    organizationId: user.organizationId,
    employeeId: user.employeeId,
    crmRole: user.crmRole,
    isSuperior: user.isSuperior,
  };
}

export const createEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new EmployeeService(getServiceContext(req));
  const employee = await service.create(req.body);
  res.status(201).json({ success: true, data: employee });
});

export const getEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new EmployeeService(getServiceContext(req));
  const employee = await service.findById(req.params.id);
  if (!employee) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } });
  res.json({ success: true, data: employee });
});

export const listEmployees = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new EmployeeService(getServiceContext(req));
  const { page, limit, department, search } = req.query;
  const where: any = {};
  if (department && department !== 'all') where.department = department;
  if (search) {
    where.OR = [
      { full_name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
      { employee_id: { contains: search as string, mode: 'insensitive' } },
      { designation: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 },
  });
  res.json({ success: true, ...result });
});

export const updateEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new EmployeeService(getServiceContext(req));
  const employee = await service.update(req.params.id, req.body);
  res.json({ success: true, data: employee });
});

export const deleteEmployee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new EmployeeService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Employee deleted' });
});

export const searchEmployees = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new EmployeeService(getServiceContext(req));
  const { q, page, limit } = req.query;
  if (!q) return res.json({ success: true, data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } });
  const result = await service.search(q as string, { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 });
  res.json({ success: true, ...result });
});