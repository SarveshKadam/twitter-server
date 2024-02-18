import axios from "axios";
import JWTService from "../../services/jwt";
import { prismaClient } from "../../clients/db";

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: String }) => {
        const googleToken = token;
        const { data } = await axios.get('https://oauth2.googleapis.com/tokeninfo', { params: { id_token: googleToken }, responseType: "json" });
        console.log("data", data);
        const checkforUser = await prismaClient.user.findUnique({ where: { email: data?.email } });

        if (!checkforUser) {
            await prismaClient.user.create({
                data: {
                    firstName: data?.given_name,
                    lastName: data?.family_name,
                    profileImageURL: data?.picture,
                    email: data?.email
                }
            })
        }
        const userinDB = await prismaClient.user.findUnique({ where: { email: data?.email } })
        if(!userinDB) throw new Error("User not found")
        const generatedtoken = JWTService.generateTokenforUser(userinDB)
        return generatedtoken;
    }
}

export const resolvers = { queries }