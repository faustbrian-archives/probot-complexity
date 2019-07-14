import { Application, Context } from "probot";
import { loadConfig } from "./services/config";

interface IComplexityLevel {
	threshold: number[];
	label: string;
}

const assignLabel = async (context: Context, levels: IComplexityLevel[], name: string): Promise<void> => {
	const { owner, repo } = context.repo();

	for (const level of levels) {
		try {
			if (level.label === name) {
				continue;
			}

			await context.github.issues.removeLabel({
				owner,
				repo,
				issue_number: context.payload.pull_request.number,
				name: level.label,
			});
		} catch {
			// do nothing...
		}
	}

	try {
		await context.github.issues.addLabels({
			owner,
			repo,
			issue_number: context.payload.pull_request.number,
			labels: [name],
		});
	} catch {
		// do nothing...
	}
};

const assignComplexity = async (context: Context) => {
	const complexity = await loadConfig(context);
	const totalComplexity: number = context.payload.pull_request.additions + context.payload.pull_request.deletions;

	for (const level of Object.values(complexity) as IComplexityLevel[]) {
		if (level.threshold.length === 1) {
			if (totalComplexity >= level.threshold[0]) {
				assignLabel(context, Object.values(complexity), level.label);
			}
		} else if (level.threshold.length === 2) {
			if (totalComplexity >= level.threshold[0] && totalComplexity <= level.threshold[1]) {
				assignLabel(context, Object.values(complexity), level.label);
			}
		}
	}
};

export = (robot: Application) => {
	robot.on(["pull_request.opened", "pull_request.synchronize"], assignComplexity);
};
