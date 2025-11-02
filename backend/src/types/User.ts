export interface User {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    hasBusiness: boolean,
    referralCode: string,
    referredByUserID: string|null
}

export interface UpdateProfileData {
    name?: string,
    image?: string,
    email?: string 
}