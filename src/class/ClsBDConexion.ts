import { connect } from "../database";

/*
  Description: This class is for DataBase Connection
*/
class ClsBDConexion {
  // for querys
  public conn: any;

  /*
    Description: The porpuse of this method is for to connect to DataBase
  */
  async connectBD() {
    this.conn = await connect();
    console.log("Database connected");
  }

  /*
    Description: The porpuse of this method is to end the connection to DataBase
  */
  async endConnection() {
    if (this.conn) await this.conn.end();
  }
}

export default new ClsBDConexion();
