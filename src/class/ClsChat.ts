import moment from "moment";
import { FieldPacket, RowDataPacket } from "mysql2";
import { IContact } from "../interface/IContact";
import IMessage from "../interface/IMessage";
import ClsBDConexion from "./ClsBDConexion";

class ClsChat {
  constructor() {}

  async getContacts(id: number) {
    const sql = "CALL `SP_GET_CONTACTS`(?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [id]);
    let users: IContact[] = data[0][0] as IContact[];
    users.map((item) => {
      return (item.messages = []);
    });
    for (let i = 0; i < users.length; i++) {
      const dataMessages: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query("CALL `SP_GET_MESSAGES`(?,?)", [id, users[i].id]);
      users[i].messages = dataMessages[0][0] as IMessage[];
      users[i].messages.sort((a, b) => {
        return parseInt(`${a.id}`) - parseInt(`${b.id}`);
      });
    }

    return users;
  }

  async getMessagesByPage(idUser: number, idContact: number, idMessage: number) {
    const sql = "CALL `SP_GET_MESSAGES_BY_PAGE`(?,?,?)";
    const data: [RowDataPacket[][], FieldPacket[]] = await ClsBDConexion.conn.query(sql, [idUser, idContact, idMessage]);
    const messages = data[0][0] as IMessage[];
    messages.sort((a, b) => {
      return parseInt(`${a.id}`) - parseInt(`${b.id}`);
    });
    return data[0][0];
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
  async updateReceived(idUser: number) {
    const sql = `UPDATE Mensaje SET Estado = 2 WHERE Receptor_Id = ${idUser}`;
    await ClsBDConexion.conn.query(sql);
  }
}

export default new ClsChat();
