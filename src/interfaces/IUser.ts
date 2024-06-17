import { IUserRole } from "./IUserRole";

export default interface IUser {
  id: number;
  email: string;
  username: string;
  role: IUserRole;
  createdAt: string;
  enrollments: any;
}
