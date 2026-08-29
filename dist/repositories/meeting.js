"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetingRepository = exports.MeetingRepository = void 0;
const base_1 = require("./base");
class MeetingRepository extends base_1.AbstractRepository {
    modelName = 'meeting';
    async findByHost(hostId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { host_id: hostId }, pagination, orderBy: { start_time: 'desc' } });
    }
    async findByStatus(status, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { status }, pagination, orderBy: { start_time: 'desc' } });
    }
}
exports.MeetingRepository = MeetingRepository;
exports.meetingRepository = new MeetingRepository();
//# sourceMappingURL=meeting.js.map