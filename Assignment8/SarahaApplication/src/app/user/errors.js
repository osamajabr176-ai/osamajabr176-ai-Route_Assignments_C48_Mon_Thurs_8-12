export const userNotExists = () => {throw new Error("User not exists")};
export const userAlreadyExists = () => {throw new Error("User already exists")};
export const userAlreadyVerified = () => {throw new Error("User already verified")};
export const userNotVerified = () => {throw new Error("The user is not verified")};