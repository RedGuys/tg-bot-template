const log4js = require('log4js');
const logger = log4js.getLogger("Main");

module.exports = (bot) => async (ctx, next) => {
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
};