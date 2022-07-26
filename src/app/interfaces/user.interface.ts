import { Category } from "./categories.interface";

export interface User{
  name: string;
  email: string;
  password: string;
  category: Category[];
}
