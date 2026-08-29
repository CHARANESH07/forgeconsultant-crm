import { JWTPayload } from '../middleware/auth';
export interface LoginResult {
    user: JWTPayload;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
export declare class AuthService {
    login(email: string, password: string): Promise<LoginResult>;
    register(data: {
        email: string;
        password: string;
        fullName: string;
        employeeId: string;
        designation: string;
        department: string;
        crmRole?: string;
        underTeamLead?: string;
        responsibleFor?: string;
        joiningDate: string;
    }): Promise<LoginResult>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string, userId: string, organizationId?: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    private storeRefreshToken;
    private rotateRefreshToken;
    private logFailedLogin;
    private getDepartmentId;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.d.ts.map