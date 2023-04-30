
import {Entity, Property, Unique, ManyToOne, PrimaryKey} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import type {Rel} from "@mikro-orm/core";


@Entity()
export class Messages {
	
	@PrimaryKey()
	id!: number;
	
	// The person who performed the match/swiped right
	@ManyToOne()
	sender!: Rel<User>;
	
	// The account whose profile was swiped-right-on
	@ManyToOne()
	receiver!: Rel<User>;
	
	@Property()
	created_at = new Date();
	
}
