import { User } from 'src/types/user';

export interface CreateProductDTO {
  owner: User;
  title: string;
  image: string;
  description: string;
  price: number;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
