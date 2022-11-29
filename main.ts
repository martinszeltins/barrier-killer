import { getProcessIds, checkResourceConsumption } from './util'

const PROCESS_NAMES = ['kdenlive', 'kdenlive']

const main = async () => {
    const pids = await getProcessIds(PROCESS_NAMES)

    for (const pid of pids) {
        await checkResourceConsumption(pid, PROCESS_NAMES)
    }
}

main()
