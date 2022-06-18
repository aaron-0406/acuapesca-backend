import moment from "moment";
import { FieldPacket, RowDataPacket } from "mysql2";
import IMessage from "../interface/IMessage";
import ClsBDConexion from "./ClsBDConexion";

class ClsChat {
  constructor() {}

  async getContacts(id: number) {
    const sql = "CALL `SP_GET_CONTACTS`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id]);
    let users = data[0][0];
    const messages = data[0][1];
    users = users.map((user) => {
      user.messages = [];
      messages.forEach((message) => {
        if ((message.id_emisor === user.id && message.id_receptor === id) || (message.id_receptor === user.id && message.id_emisor === id)) {
          user.messages.push(message);
        }
      });
      return user;
    });
    return users;
  }
  async createMessage(message: IMessage) {
    const { id_emisor, id_receptor, text, status } = message;
    const sql = "CALL `SP_INSERT_MESSAGE`(?,?,?,?,?); SELECT @id AS 'message_id'";
    const fecha = moment(message.date).format("YYYY[-]MM[-]DD HH[:]mm[:]ss");
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [text, id_emisor, id_receptor, fecha, status]);
    message.id = data[0][1][0].message_id;
    return message;
  }
  async updateMessage(message: IMessage, status: number) {
    const { id } = message;
    const sql = "CALL `SP_UPDATE_MESSAGE`(?,?)";
    await ClsBDConexion.conn.query(sql, [id, status]);
    message.status = status;
    return message;
  }
}

export default new ClsChat();
