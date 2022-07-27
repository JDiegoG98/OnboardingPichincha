export interface LoginResponse{
  user: {
    userId: string;
    username: string;
  };
  access_token: string;
  tokenType: string;
}
