const { ConfigurationService } = require('./dist/src/modules/common/config/config.service');
const config = new ConfigurationService();
const db = config.get('database');
module.exports = db;
