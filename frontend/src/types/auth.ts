export interface User {
  id: number;
  email: string;
  role: 'student' | 'counsellor' | 'admin';
  has_consented: boolean;
}
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
