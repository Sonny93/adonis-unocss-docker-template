import type { Job, JobResult, JobStatus } from './types.js';

export class JobQueue {
	private queue: Job[] = [];
	private currentJob: Job | null = null;
	private isProcessing = false;
	private abortController: AbortController | null = null;
	private onJobUpdate?: (job: Job) => void;

	constructor(onJobUpdate?: (job: Job) => void) {
		this.onJobUpdate = onJobUpdate;
	}

	add(job: Job): void {
		this.queue.push(job);
		this.queue.sort((a, b) => b.priority - a.priority);
		this.notifyUpdate(job);
	}

	getCurrentJob(): Job | null {
		return this.currentJob;
	}

	getQueue(): Job[] {
		return [...this.queue];
	}

	cancel(): void {
		if (this.currentJob) {
			this.abortController?.abort();
			this.updateJobStatus(this.currentJob, 'cancelled');
			this.currentJob = null;
		}
		this.isProcessing = false;
	}

	cancelAll(): void {
		this.cancel();
		this.queue.forEach((job) => this.updateJobStatus(job, 'cancelled'));
		this.queue = [];
	}

	async process(
		executor: (job: Job, signal: AbortSignal) => Promise<JobResult>
	): Promise<void> {
		if (this.isProcessing || this.queue.length === 0) return;

		this.isProcessing = true;

		while (this.queue.length > 0 && this.isProcessing) {
			const job = this.queue.shift();
			if (!job) break;

			this.currentJob = job;
			this.abortController = new AbortController();

			this.updateJobStatus(job, 'running');
			job.startedAt = Date.now();

			try {
				const result = await executor(job, this.abortController.signal);
				if (result.success) {
					this.updateJobStatus(job, 'completed');
				} else {
					job.error = result.message;
					this.updateJobStatus(job, 'failed');
				}
			} catch (err) {
				if (err instanceof Error && err.name === 'AbortError') {
					this.updateJobStatus(job, 'cancelled');
				} else {
					job.error = err instanceof Error ? err.message : 'Unknown error';
					this.updateJobStatus(job, 'failed');
				}
			}

			job.completedAt = Date.now();
			this.notifyUpdate(job);
			this.currentJob = null;
			this.abortController = null;
		}

		this.isProcessing = false;
	}

	private updateJobStatus(job: Job, status: JobStatus): void {
		job.status = status;
		this.notifyUpdate(job);
	}

	private notifyUpdate(job: Job): void {
		this.onJobUpdate?.(job);
	}
}
