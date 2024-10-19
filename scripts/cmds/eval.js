module.exports = {
    name: "eval",
    prefixRequired: true,
    adminOnly: true,
    async execute(args, event, api){
        const code = async () => {
            args.join(' ')
            try{

            } catch (err) {
                console.log(err.message);
                api.sendMessage(`Error:\n${err.message}`, event.threadID)
            }
        }();
        eval(code);
    }
}