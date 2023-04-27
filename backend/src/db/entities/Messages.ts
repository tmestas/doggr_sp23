
import { Entity, Property, Unique, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";


@Entity()
export class Messages {
	
	@Property()
	@Unique()
	id!: number;
	
	// The person who performed the match/swiped right
	@ManyToOne()
	sender!: User;
	
	// The account whose profile was swiped-right-on
	@ManyToOne()
	receiver!: User;
	
	@Property()
	created_at = new Date();
	
}
