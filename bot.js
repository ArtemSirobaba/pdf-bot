const { Telegraf } = require('telegraf');
const bot = new Telegraf('1247297939:AAG5GFqyWSfR34C9wAx6mLnlm_qIJ4gFuOQ');
const imagesToPdf = require('images-to-pdf');
const download = require('download-file');
const request = require('request-promise');
const { readFileSync } = require('fs');
const { prependListener } = require('process');

bot.on('photo', async (ctx) => {
  try {
    getFile(ctx);
  } catch {
    ctx.reply('Sorry, this video is not available');
  }
});

const getFile = async (ctx) => {
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const token = '1247297939:AAG5GFqyWSfR34C9wAx6mLnlm_qIJ4gFuOQ';
  function fileId() {
    const data = ctx.update.message.photo;
    const first = data[0];
    const second = data[1];
    const third = data[2];
    if (third === undefined) return second;
    if (second === undefined) return first;
    else return third;
  }

  const id = fileId();
  const response = await request({
    method: 'GET',
    uri: `https://api.telegram.org/bot${token}/getFile?file_id=${id.file_id}`,
  });

  const url = `https://api.telegram.org/file/bot${token}/${response
    .split(':')[6]
    .replace(/[""}]/g, '')}`;

  const options = {
    directory: './photos/',
    filename: url.split('/')[6],
  };

  download(url, options, function (err) {
    if (err) throw err;
  });

  const file = url.split('/')[6];

  const arr = [];

  arr.push(file);

  const data = await Promise.all(arr);
  console.log(data);

  // await timeout(2000);

  // await imagesToPdf(
  //   [`./photos/${filename}`],
  //   `./pdf/${filename.split('.')[0]}.pdf`
  // );

  // await timeout(1000);

  // ctx.replyWithDocument({ source: `./pdf/${filename.split('.')[0]}.pdf` });
};

bot.launch();

console.log('Bot starting');
