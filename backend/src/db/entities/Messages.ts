
import {Entity, Property, Unique, ManyToOne, PrimaryKey} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import type {Rel} from "@mikro-orm/core";


@Entity()
export class Messages {
	
	@PrimaryKey()
	id!: number;
	
	// The person who performed the match/swiped right
	@ManyToOne({onDelete: 'cascade'})
	sending_user!: Rel<User>;
	
	// The account whose profile was swiped-right-on
	@ManyToOne({onDelete: 'cascade'})
	receiving_user!: Rel<User>;

	@Property()
	message: string;

	@Property()
	created_at = new Date();
	
}
