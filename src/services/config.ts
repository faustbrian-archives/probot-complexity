import { getConfig } from "@botamic/toolkit";
import Joi from "@hapi/joi";
import { Context } from "probot";

export const loadConfig = async (context: Context): Promise<Record<string, any>> =>
	(await getConfig(
		context,
		"botamic.yml",
		Joi.object({
			complexity: Joi.object({
				low: Joi.object({
					threshold: Joi.array()
						.items(Joi.number())
						.default([1, 64]),
					label: Joi.string().default("Complexity: Low"),
				}).default(),
				medium: Joi.object({
					threshold: Joi.array()
						.items(Joi.number())
						.default([64, 256]),
					label: Joi.string().default("Complexity: Medium"),
				}).default(),
				high: Joi.object({
					threshold: Joi.array()
						.items(Joi.number())
						.default([256, 1024]),
					label: Joi.string().default("Complexity: High"),
				}).default(),
				undetermined: Joi.object({
					threshold: Joi.array()
						.items(Joi.number())
						.default([1024]),
					label: Joi.string().default("Complexity: Undetermined"),
				}).default(),
			}).default(),
		})
			.unknown(true)
			.default(),
	)).complexity;
