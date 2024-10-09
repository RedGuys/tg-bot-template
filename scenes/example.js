const Scene = require('regraf').BaseScene;

let scene = new Scene('example');

scene.enter(async (ctx) => {
    await ctx.reply('Text on scene start', {
        reply_markup: {
            inline_keyboard: [
                [{text:"Close", callback_data: "exit"}]
            ]
        }
    });
});

scene.action('exit', async (ctx) => {
    await ctx.scene.leave();
    await ctx.editMessageText('Scene closed');
    await ctx.answerCbQuery();
});

scene.on('text', async (ctx) => {
    await ctx.reply('Text inputted: '+ctx.message.text, {
        reply_markup: {
            inline_keyboard: [
                [{text:"Close", callback_data: "exit"}]
            ]
        }
    });
});

module.exports = scene;