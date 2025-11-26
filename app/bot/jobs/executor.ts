import type { Bot } from 'mineflayer';
import type { Movements, goals } from 'mineflayer-pathfinder';
import { executeCollectWood } from './executors/collect_wood.js';
import type { Job, JobResult } from './types.js';

export class JobExecutor {
	constructor(
		private bot: Bot,
		private pathfinderTools: {
			Movements: typeof Movements;
			GoalBlock: typeof goals.GoalBlock;
		},
		private onJobProgress?: (job: Job) => void
	) {}

	async execute(job: Job, signal: AbortSignal): Promise<JobResult> {
		switch (job.type) {
			case 'collect_wood':
				return executeCollectWood(
					this.bot,
					job,
					signal,
					this.pathfinderTools,
					(collected) => {
						job.params.collected = collected;
						this.onJobProgress?.(job);
					}
				);
			default:
				return {
					success: false,
					message: `Unknown job type: ${(job as Job).type}`,
				};
		}
	}
}
