export class CreateAdminDto {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  is_creator?: boolean
}
