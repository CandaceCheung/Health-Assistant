import { Knex } from "knex";

export class InfoService {
	constructor(private knex: Knex) {}

	async get(cookieID: string): Promise<{ id: number }> {
		const userID = (
			await this.knex.select("id").from("users").where("session_id", cookieID)
		)[0];
        console.log(userID)
		return userID;
	}
}
