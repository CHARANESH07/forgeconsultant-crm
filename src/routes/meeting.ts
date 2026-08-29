import { Router } from 'express';
import * as meetingController from '@/controllers/meeting';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { meetingSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(meetingSchemas.create), meetingController.createMeeting);
router.get('/', validateQuery(paginationSchema), meetingController.listMeetings);
router.get('/:id', validateParams(idParamSchema), meetingController.getMeeting);
router.put('/:id', validateParams(idParamSchema), validateBody(meetingSchemas.update), meetingController.updateMeeting);
router.delete('/:id', validateParams(idParamSchema), meetingController.deleteMeeting);

export default router;
