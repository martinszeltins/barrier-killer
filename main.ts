import { getProcessIds, checkResourceConsumption } from './util'

const PROCESS_NAMES = ['barrier', 'barriers']

const main = () => {
    console.log('[info] Barrier killer started. Watching for resource consumption.')
    
    /**
     * Run forever and check resource consumption every 30 seconds.
     * If a process uses too much of CPU or RAM it will be killed.
     */
    setInterval(async () => {
        console.log('[info] Checking resource consumption')

        const pids = await getProcessIds(PROCESS_NAMES)
    
        for (const pid of pids) {
            await checkResourceConsumption(pid, PROCESS_NAMES)
        }
    }, 30000)
}

main()
