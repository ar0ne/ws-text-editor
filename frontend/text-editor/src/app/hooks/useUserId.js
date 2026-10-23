
import { userIdentityService } from "../services/mock-user-service";

export function useUserId() {
    return userIdentityService.getUserId();
}