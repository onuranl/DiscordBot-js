'use strict';
require("dotenv").config();

const PREFIX = "/";

const Discord =require('discord.js')
const client= new Discord.Client();

//MUSİC BOT//
const ytdl=require('ytdl-core')

const servers={

}

let server=undefined;

const play=async(connection,message)=>{
    const server=servers[message.guild.id];
    const stream=ytdl(server.queue[0],{
        filter:"audioonly",
        quality:"highestaudio"
    })
    server.dispatcher = connection.play(stream);
    let song=await (await ytdl.getInfo(server.queue[0])).videoDetails.title;
    server.dispatcher.on("finish",()=>{
        server.queue.shift();
        if(server.queue[0]){
            message.channel.send("Şarkı Çalınıyor: "+song);
            play(connection,message);
        }
        else connection.disconnect();
    })
}

client.on("message",message=>{
    console.log("Gelen Mesaj: "+message.content)

    const parsedMessage=message.content.split(" ") //!oynat URL

    switch (parsedMessage[0]) {
        case "!oynat":
            if(!parsedMessage[1]){
            message.channel.send("Link girmelisiniz!")
            return;
            }

            if(!message.member.voice.channel){
            message.channel.send("Ses kanalı olmalıdır!")
                return;
            }

            if(!servers[message.guild.id])
            servers[message.guild.id]={
                queue:[]
            }

            server=servers[message.guild.id]
            server.queue.push(parsedMessage[1])

            if(server.queue.length<=1)
            try{
                message.member.voice.channel.join().then(connection=>{
                    play(connection,message)
                })
            }catch(e){
                console.log("hata oluştu"+e)
            }
            break;
        case "!geç":
            if(server.dispatcher)server.dispatcher.end();
            break;
        case "!durdur":
            if(message.guild.voice.channel){
                server.dispatcher.end()
                console.log("Kuyruk Durduruldu !")
            }
            if(message.guild.connection)
            message.guild.voice.connection.disconnect();
            break;
        default:
            break;
    }

    //MUSİC BOT FİNİSH//

    //BAN AND KİCK COMMAND//

    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        if(CMD_NAME === "kick"){
            const user = message.mentions.users.first();
            if(user){
                const member = message.guild.member(user);
                if(member){
                    member
                    .kick("reason")
                    .then(() => {
                        message.reply(`Successfully kicked ${user.tag}`);
                    })
                    .catch(err => {
                        message.reply('I was unable to kick the member');
                        console.error(err);
                    });                     
                } else {
                    message.reply("That user isn't in this guild!");
                }
            }
            else {
                message.reply("You didn't mention the user to kick!");
            }
        } else if(CMD_NAME === "ban"){
            const user = member.mentions.users.first();
            if(user){
                const member = message.guild.member(user);
                if(member){
                    kick("reason")
                    .then(() => {
                        message.reply(`Successfully banned ${user.tag}`);
                    })
                    .catch(err => {
                        message.reply('I was unable to ban the member');
                        console.error(err);
                    });           
                } else {
                    message.reply("That user isn't in this guild!");
                }
            } else {
                message.reply("You didn't mention the user to kick!");
            }
        } 
    }
});


client.login(process.env.DISCORJS_BOT_TOKEN);