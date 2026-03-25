export class CreateUserDto {
  email: string;
  password: string;
  passwordHash?: string;
  name: string;
  companyName?: string;
  status?: 'pending' | 'active' | 'suspended';
  emailVerificationToken?: string;
}