export class UserDto {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  photo: string | null;
  role: string;
  roleId: number;
  created_at: Date;
}
