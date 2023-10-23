const Scene = require('telegraf').BaseScene;
const Database = require('../Database');

let scene = new Scene('example');

scene.enter(async (ctx) => {
    await ctx.reply('Текст при входе в сцену', {
        reply_markup: {
            inline_keyboard: [
                [{text:"Выход", callback_data: "exit"}]
            ]
        }
    });
});

scene.action('exit', async (ctx) => {
    await ctx.scene.leave();
    await ctx.reply('Редактирование персонажа завершено!');
    await ctx.answerCbQuery();
});

scene.on('text', async (ctx) => {
    await ctx.reply('Текст при вводе текста', {
        reply_markup: {
            inline_keyboard: [
                [{text:"Выход", callback_data: "exit"}]
            ]
        }
    });
});

module.exports = scene;