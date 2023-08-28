export interface Msg {
    message: string;
    error?: string;
}
export interface Csrf {
    csrfToken: string;
}
export interface Jwt {
    accessToken: string;
}