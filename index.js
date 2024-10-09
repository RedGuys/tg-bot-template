const Telegraf = require('regraf');
const bot = new Telegraf(process.env.TOKEN);
const LocalSession = require('@regraf/session-local');
const Stage = require("regraf/stage");
const Database = require("./Database");
const log4js = require('log4js');
const logger = log4js.getLogger("Main");
log4js.configure({
    appenders: {
        out: {
            type: 'stdout'
        },
    }, categories: {default: {appenders: ['out'], level: 'info'}}
});

bot.catch((err) => logger.error(err));
bot.use(require("./handlers/log")(bot));
bot.use((new LocalSession({storage: LocalSession.storageMemory})).middleware());

let stage = new Stage();
stage.register(require("./scenes/example"));
bot.use(stage.middleware());

bot.start(require("./commands/start")(bot));

bot.startPolling();
logger.log("Bot started!");

process.on('uncaughtException', function (err) {
    logger.error(err);
});

process.on('unhandledRejection', function (err) {
    logger.error(err);
});