import {z} from "zod";
import {config} from "dotenv";


config();
const schema = z.object({
    PORT: z.string().default('3000'),
    MONGO_DB_URL: z.string(),
    JWT_SECRET: z.string(),
    SMTP_USER: z.string().trim().toLowerCase(),
    SMTP_PASS: z.string(),
    Client_ID: z.string(),
    REDIS_HOST:z.string(),
    REDIS_PORT:z.string().default('6379'),
    REDIS_PASSWORD: z.string(),
    Client_secret: z.string(),
    MAILJET_API_KEY:z.string(),
    MAILJET_API_SECRET_KEY:z.string(),
    MAILJET_FROM_EMAIL:z.string().trim().toLowerCase(),
    MAILJET_FROM_NAME:z.string().trim(),
})

const parsed = schema.parse(process.env);

export const env = {
    port: Number(parsed.PORT),
    db:{
        url: parsed.MONGO_DB_URL,
    },
    redis:{
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD,
    },
    nodemailer:{
        user: parsed.SMTP_USER,
        pass: parsed.SMTP_PASS
    },
    mailjet:{
      apiKey:parsed.MAILJET_API_KEY,
      apiSecret:parsed.MAILJET_API_SECRET_KEY,
      fromEmail:parsed.MAILJET_FROM_EMAIL,
      fromName: parsed.MAILJET_FROM_NAME,
    },
    jwt:{
        secret: parsed.JWT_SECRET,
    },
    google:{
        clientID: parsed.CLIENT_ID,
        clientSecret: parsed.Client_secret,
    }

};