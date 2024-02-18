import JWT from "jsonwebtoken";
const JWT_SECRET = "2ey870jihih9";
class JWTService {
    public static generateTokenforUser(user: any) {
        const payload = {
            id: user?.id,
            email: user?.email
        }
        const token = JWT.sign(payload, JWT_SECRET);
        return token;
    }
}

export default JWTService;