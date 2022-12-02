import util from 'util'
import { exec as _exec } from 'child_process'

const exec = util.promisify(_exec)

const getProcessIds = async (processNames: string[]) => {
    let pids: string[] = []

    for (const processName of processNames) {
        try {
            const { stdout } = await exec(`pidof ${processName}`);
            const pid = stdout.replace('\n', '')
            const isSinglePid = !stdout.includes(' ')
    
            /**
             * Add the found process id to the list only if there was a
             * single pid found for the process name and if it has not
             * been already added.
             */
            if (isSinglePid && !pids.includes(pid)) {
                pids.push(stdout.replace('\n', ''))
            }
        } catch (error) {
            console.log('[info] This process is not running.')
        }
    }

    return pids
}

const getMemoryUsage = async (pid: string) => {
    const { stdout } = await exec(`ps -p ${pid} -o %mem | grep -o "[0-9].*[0-9]"`)

    return Number(stdout.replace('\n', ''))
}

const getCpuUsage = async (pid: string) => {
    const { stdout } = await exec(`ps -p ${pid} -o %cpu | grep -o "[0-9].*[0-9]"`)

    return Number(stdout.replace('\n', ''))
}

const killAllProcesses = async (processNames: string[]) => {
    let killCommand = ''

    for (const [index, processName] of processNames.entries()) {
        killCommand += `killall ${processName}`

        if ((index + 1) < processNames.length) {
            killCommand += ' && '
        }
    }

    console.log(`[cmd] ${killCommand}`)
    await exec(killCommand)
}

const checkResourceConsumption = async (pid: string, processNames: string[]) => {
    try {
        // CPU and RAM usages in % of total available
        const memoryUsage = await getMemoryUsage(pid)
        const cpuUsage = await getCpuUsage(pid)

        console.log(`[info] Memory: ${memoryUsage}%, CPU: ${cpuUsage}%`)
        
        if (memoryUsage > 0.5 || cpuUsage > 6.0) {
            console.log('[info] Resource limit reached. Killing all processes...')

            await killAllProcesses(processNames)
        }
    } catch (error) {
        console.log('[error] check_resource_consumption failed.')
    }
}

export {
    getProcessIds,
    getMemoryUsage,
    getCpuUsage,
    killAllProcesses,
    checkResourceConsumption
}
