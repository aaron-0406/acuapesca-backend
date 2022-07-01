import IMessage from "./IMessage";

export interface IContact {
  id?: number;
  fullname: string;
  photo: string;
  messages: IMessage[];
  typing?: boolean;
}
