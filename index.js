require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core-discord");

const prefix = "!";

const meme = require("./utils/randomFile");
const downloader = require("./utils/downloaderImage");
const Queue = require('./utils/queue');

client.login(process.env.TOKEN);

const memberLinks = {
    meuquerido: 'https://www.youtube.com/watch?v=ShWb9wIWp7c',
    '22k': 'https://youtu.be/xpfsUqVEyHM',
    leon: 'https://youtu.be/0BfJvyHBOII',
    urisse: 'https://www.youtube.com/watch?v=H2iAL0Rbq6g',
    makense: 'https://www.youtube.com/watch?v=9wcg57VnkNI',
    josi: 'https://www.youtube.com/watch?v=NFjzhT3qAA0',
    luisa: 'https://www.youtube.com/watch?v=lzzM1k0bt7U',
    gago: 'https://youtu.be/zDDT2JvglSk',
    tuzao: 'https://www.youtube.com/watch?v=yOEa1YK-SDg',
    joni: 'https://www.youtube.com/watch?v=JXqXSfppOTY',
    scopel: 'https://youtu.be/15lba7DIvkQ',
    shacal: 'https://youtu.be/l_pBaFk73rg',
    jm: 'https://youtu.be/4WuU7XXOADM'
}


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});


const members = {
    '233266768095870977': 'tuzao',
    '352169790212669460': '22k',
    '233271179794710530': 'urisse',
    '267081042937118721': 'gago',
    '254789073691082753': 'joni',
    '233795749916180490': 'leon',
    '370694977757380608': 'luisa',
    '204328361164537856': 'josi',
    '233266831098380288': 'makense',
    '505751378145050629': 'scopel',
    '233303134804508672': 'shacal',
    '335991054585167872': 'jm'
}

let queue = new Queue();

client.on('voiceStateUpdate',  async(oldMember, newMember) => {
    const voiceChannel = newMember.voiceChannel;
    const oldMemberChannel = oldMember.voiceChannel;
    if (voiceChannel && !oldMemberChannel ) {
        const memberId = newMember.user.id;
        let member = members[memberId];
        if (member) {
            queue.enqueue({
                link: memberLinks[member],
                voiceChannel
            }
            );
        } else if (!newMember.user.bot) {
            queue.enqueue({ link: memberLinks['meuquerido'], voiceChannel });
        }

        playMemberAudio();
    }
});

let running = false;
async function playMemberAudio() {
    while (!queue.isEmpty()) {
        try{
            if(!running){
                console.log('running');
                const item = queue.dequeue();
                await playAudio(item.link, item.voiceChannel);
                running = true;
            }   
        }catch(e){
            running = false;
            console.error(e);
        }

        // Só pra não flodarem.
        await new Promise(sleep => setTimeout(sleep, 400));
    }
}

async function playAudio(link, voiceChannel, msg = null) {
    try {

        if (!voiceChannel.connection) await voiceChannel.join();
        
        let stream = await ytdl(link);
        voiceChannel.connection.playOpusStream(stream).on('end', () => {
            running = false;
            voiceChannel.leave()
        });
    } catch (e) {
        if (msg) {
            msg.channel.send("Ocorreu um erro ao reproduzir o audio do vídeo");
        }
        console.error("Ocorreu um erro ao reproduzir o audio do vídeo", e);
    }
}

let helpMessage = `
Comandos gerais:
  !meme = Te responde com um meme aleatorio
  !adicionar = Ao enviar uma imagem mais este comando, adiciona uma imagem ao banco de memes.
  !clear = Limpar o chat

Audios de Memes:
  !moises
  !mentira
  !tabom
  !vocair
  !aiai
  !marilene
  !eusoulouco
  !burro
  !irineu
  !numsei
  !pele
  !faliceu
  !demencia
  !querocafe
  !paodebatata
  !senhora
  !muitoforte
  !mula
  !paraocarro

Audios Meu querido:
  !meuquerido
  !22k
  !leon
  !urisse
  !makense
  !josi
  !luisa 
  !gago
  !tuzao
  !joni
  !scopel
  !jm
  !shacal
`;

client.on("message", (msg) => {
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const userCommand = args.shift().toLowerCase();

    const audiosCommands = {
        /** Tocando memes de altissima qualidade. */
        moises: () => playAudio('https://www.youtube.com/watch?v=6GfqT-HKsY8', msg.member.voiceChannel),
        mentira: () => playAudio('https://www.youtube.com/watch?v=ViesudGoHKM', msg.member.voiceChannel),
        tabom: () => playAudio('https://www.youtube.com/watch?v=hs91TFUdqdU', msg.member.voiceChannel),
        vocair: () => playAudio('https://www.youtube.com/watch?v=ihJp_tWnvQc', msg.member.voiceChannel),
        aiai: () => playAudio('https://www.youtube.com/watch?v=yCJV6VrOxBA', msg.member.voiceChannel),
        marilene: () => playAudio('https://www.youtube.com/watch?v=z7-ZYXpJ_EU', msg.member.voiceChannel),
        eusoulouco: () => playAudio('https://www.youtube.com/watch?v=TpAu95MjO0I', msg.member.voiceChannel),
        burro: () => playAudio('https://www.youtube.com/watch?v=lOxSDaTfujU', msg.member.voiceChannel),
        irineu: () => playAudio('https://www.youtube.com/watch?v=Odu55a5QtTE', msg.member.voiceChannel),
        numsei: () => playAudio('https://www.youtube.com/watch?v=IHa5f4MWu1I', msg.member.voiceChannel),
        pele: () => playAudio('https://www.youtube.com/watch?v=-vut5q_Z3Rc', msg.member.voiceChannel),
        faliceu: () => playAudio('https://www.youtube.com/watch?v=8GIdYXBqu1s', msg.member.voiceChannel),
        demencia: () => playAudio('https://www.youtube.com/watch?v=-kDO0rvwyiE', msg.member.voiceChannel),
        querocafe: () => playAudio('https://www.youtube.com/watch?v=VxRpkfcXEpA', msg.member.voiceChannel),
        paodebatata: () => playAudio('https://www.youtube.com/watch?v=sGci6pVA4D8', msg.member.voiceChannel),
        senhora: () => playAudio('https://www.youtube.com/watch?v=sNOw2WVIYow', msg.member.voiceChannel),
        muitoforte: () => playAudio('https://www.youtube.com/watch?v=KfjAQ9glCxE', msg.member.voiceChannel),
        mula: () => playAudio('https://youtu.be/FzAWnKP5hpU', msg.member.voiceChannel),
        paraocarro: () => playAudio('https://youtu.be/buVRBF9HGH8', msg.member.voiceChannel),
    }


    const commands = {
        /** Comandos gerais */
        ajuda: () => msg.reply(helpMessage),
        help: () => msg.reply(helpMessage),
        meme: async () => {
            const file = await meme.randomFile();
            msg.reply("Um meme bolado pra tu consagrado", {
                files: [file],
            });
        },
        sair: () => {
            if (msg.member.voiceChannel) msg.member.voiceChannel.leave();
        },
        adicionar: async () => {
            try {
                let meme = msg.attachments.first();

                if (!meme) {
                    msg.reply("Você precisa anexar uma imagem junto ao comando.");
                    return;
                }

                if (!/\.(gif|jpe?g|tiff|png|webp|bmp)$/i.test(filename)) {
                    msg.reply("É para enviar uma IMAGEM um animal");
                    return;
                }

                await downloader.default(meme.url, meme.filename);
                msg.reply("Memes adicionados com sucesso");
            } catch (e) {
                msg.reply("Ocorreu um erro ao enviar a imagem");
                console.error(e);
            }
        },
        clear: () => {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) {
                msg.channel.fetchMessages().then(
                    function (list) {
                        msg.channel.bulkDelete(list);
                    },
                    function (err) {
                        msg.channel.send("Erro ao limpar ao chat.");
                    }
                );
            }
        },
    };

    try {
        let command = commands[userCommand];
        console.log(userCommand);
        if (!command) {
            command = audiosCommands[userCommand];
        }

        if (!command && Object.values(members).includes(userCommand)) {
            playAudio(memberLinks[userCommand], msg.member.voiceChannel, msg);
        }

        if (command) {
            command();
        }
    } catch (e) {
        msg.channel.sender("Ocorreu algum erro, contate o criador do bot");
        console.error(e);
    }
});
