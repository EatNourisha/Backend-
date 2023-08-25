

export interface SendVerificationEmailDto {
    email: string;
    code: string;
    link: string; 
    name: string;
}

export interface SendWelcomeEmailDto {
    email: string;
    name: string;
}

export interface SendResetPasswordEmailDto {
    email: string;
    name: string;
    link: string;
    token: string;
    sub: string; // subject -> customer's id
}