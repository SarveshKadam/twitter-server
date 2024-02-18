"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const axios_1 = __importDefault(require("axios"));
const jwt_1 = __importDefault(require("../../services/jwt"));
const db_1 = require("../../clients/db");
const queries = {
    verifyGoogleToken: (parent, { token }) => __awaiter(void 0, void 0, void 0, function* () {
        const googleToken = token;
        const { data } = yield axios_1.default.get('https://oauth2.googleapis.com/tokeninfo', { params: { id_token: googleToken }, responseType: "json" });
        console.log("data", data);
        const checkforUser = yield db_1.prismaClient.user.findUnique({ where: { email: data === null || data === void 0 ? void 0 : data.email } });
        if (!checkforUser) {
            yield db_1.prismaClient.user.create({
                data: {
                    firstName: data === null || data === void 0 ? void 0 : data.given_name,
                    lastName: data === null || data === void 0 ? void 0 : data.family_name,
                    profileImageURL: data === null || data === void 0 ? void 0 : data.picture,
                    email: data === null || data === void 0 ? void 0 : data.email
                }
            });
        }
        const userinDB = yield db_1.prismaClient.user.findUnique({ where: { email: data === null || data === void 0 ? void 0 : data.email } });
        if (!userinDB)
            throw new Error("User not found");
        const generatedtoken = jwt_1.default.generateTokenforUser(userinDB);
        return generatedtoken;
    })
};
exports.resolvers = { queries };
