const { sessionSchema } = require("../database/session");

module.exports = class Database {
  constructor() {}
  /**
   * @param {string} sessionId
   * @returns {Promise<{sessionId: string, session: string}>}
   */

  getSession = async (sessionId) => await this.session.findOne({ sessionId });

  session = sessionSchema;
};
