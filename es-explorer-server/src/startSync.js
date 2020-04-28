const { syncMicroChain } =require('./js/sync-micro-chain')

start()
async function start () {
    while (true) {
        console.log("start sync")
        await syncMicroChain();
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log("one time sync end")
      }
}