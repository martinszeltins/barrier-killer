import util from 'util'
import pidusage from 'pidusage'
import { exec as _exec } from 'child_process'

const PROCESS_NAMES = ['gnome-calculator', 'gnome-calculator']

let PROCESS_IDS: string[] = []

const exec = util.promisify(_exec)

const getProcessIds = async () => {
    let pids: string[] = []

    for (const processName of PROCESS_NAMES) {
        const { stdout } = await exec(`pidof ${processName}`);
        
        pids.push(stdout.replace('\n', ''))
    }

    return pids
}

const main = async () => {
    PROCESS_IDS = await getProcessIds()

    console.log(PROCESS_IDS)

    // pidusage(process.pid, function (_, stats) {
    //     console.log(stats)
    // })
}

main()
