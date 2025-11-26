import type { Bot } from 'mineflayer';
import type { goals, Movements } from 'mineflayer-pathfinder';
import type { CollectWoodJob, JobResult } from '../types.js';

const LOG_BLOCKS = [
	'oak_log',
	'spruce_log',
	'birch_log',
	'jungle_log',
	'acacia_log',
	'dark_oak_log',
	'mangrove_log',
	'cherry_log',
];

export async function executeCollectWood(
	bot: Bot,
	job: CollectWoodJob,
	signal: AbortSignal,
	pathfinderTools: {
		Movements: typeof Movements;
		GoalBlock: typeof goals.GoalBlock;
	},
	onProgress: (collected: number) => void
): Promise<JobResult> {
	const { amount } = job.params;
	let collected = 0;

	while (collected < amount) {
		if (signal.aborted) {
			return { success: false, message: 'Job cancelled' };
		}

		const logBlock = bot.findBlock({
			matching: (block) => LOG_BLOCKS.includes(block.name),
			maxDistance: 64,
		});

		if (!logBlock) {
			return {
				success: false,
				message: `No wood found nearby. Collected ${collected}/${amount}`,
				data: { collected },
			};
		}

		const movements = new pathfinderTools.Movements(bot);
		movements.canDig = true;
		bot.pathfinder.setMovements(movements);
		bot.pathfinder.setGoal(
			new pathfinderTools.GoalBlock(
				logBlock.position.x,
				logBlock.position.y,
				logBlock.position.z
			)
		);

		await waitForGoalOrTimeout(bot, signal, 30000);

		if (signal.aborted) {
			return { success: false, message: 'Job cancelled' };
		}

		try {
			await bot.dig(logBlock);
			collected++;
			job.params.collected = collected;
			onProgress(collected);
		} catch {
			continue;
		}
	}

	return {
		success: true,
		message: `Collected ${collected} wood`,
		data: { collected },
	};
}

function waitForGoalOrTimeout(
	bot: Bot,
	signal: AbortSignal,
	timeout: number
): Promise<void> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			bot.pathfinder.setGoal(null);
			resolve();
		}, timeout);

		const onGoalReached = () => {
			clearTimeout(timer);
			resolve();
		};

		const onAbort = () => {
			clearTimeout(timer);
			bot.pathfinder.setGoal(null);
			reject(new DOMException('Aborted', 'AbortError'));
		};

		bot.once('goal_reached', onGoalReached);
		signal.addEventListener('abort', onAbort, { once: true });

		bot.once('path_stop', () => {
			clearTimeout(timer);
			resolve();
		});
	});
}
