const userId = crypto.randomUUID().slice(0, 5);

export const userIdentityService = {
    getUserId() {
        return userId;
    },
};