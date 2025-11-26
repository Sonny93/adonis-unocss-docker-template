export type JobStatus =
	| 'pending'
	| 'running'
	| 'completed'
	| 'failed'
	| 'cancelled';

export interface JobResult {
	success: boolean;
	message?: string;
	data?: Record<string, unknown>;
}

export interface BaseJob {
	id: string;
	type: string;
	status: JobStatus;
	priority: number;
	createdAt: number;
	startedAt?: number;
	completedAt?: number;
	error?: string;
}

export interface CollectWoodJob extends BaseJob {
	type: 'collect_wood';
	params: {
		amount: number;
		collected: number;
	};
}

export type Job = CollectWoodJob;

export type JobType = Job['type'];
