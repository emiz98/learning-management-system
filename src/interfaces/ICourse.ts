import IUser from "./IUser";

export default interface ICourse {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  enrollments: any;
}
