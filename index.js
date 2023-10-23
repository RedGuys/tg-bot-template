const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);
const LocalSession = require('telegraf-session-local');
const Stage = require("telegraf/stage");
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

bot.use(async (ctx, next) => {
    let start = new Date();
    await next();
    let ms = new Date() - start;
    try {
        if (ctx.message && ctx.message.text && ctx.message.text.startsWith("/")) {
            logger.log("Command " + ctx.message.text.split(" ")[0].substring(1) + " processed in " + ms + "ms");
        }
        if (ctx.message && ctx.message.voice) {
            logger.log("Voice " + ctx.message.voice.file_id + " processed in " + ms + "ms");
        }
        if (ctx.message && ctx.message.video_note) {
            logger.log("Video note " + ctx.message.video_note.file_id + " processed in " + ms + "ms");
        }
        if (ctx.callbackQuery && ctx.callbackQuery.data) {
            logger.log("Callback " + ctx.callbackQuery.data + " processed in " + ms + "ms");
        }
        if (ctx.inlineQuery) {
            logger.log("Inline " + ctx.inlineQuery.query + " processed in " + ms + "ms");
        }
    } catch (e) {
        logger.log(e)
    }
});

bot.use((new LocalSession({storage: LocalSession.storageMemory})).middleware());

let stage = new Stage();
stage.register(require("./scenes/example"));
bot.use(stage.middleware());

bot.start(async (ctx) => await ctx.scene.enter('example'));

bot.startPolling();
logger.log("Bot started!");