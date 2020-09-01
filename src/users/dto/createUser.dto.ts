import CreateAddressDto from './createAddress.dto';

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  address?: CreateAddressDto;
}

export default CreateUserDto;
