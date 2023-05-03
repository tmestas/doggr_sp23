import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { Match } from "./db/entities/Match.js";
import {User} from "./db/entities/User.js";
import {ICreateUsersBody} from "./types.js";
import {Messages} from "./db/entities/Messages.js";
import BadWords from "./badwords.js";
import * as fs from "fs";

async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}
	
	app.get('/hello', async (request: FastifyRequest, reply: FastifyReply) => {
		return 'hello';
	});
	
	app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
		return request.em.find(User, {});
	});
	

	
	// Core method for adding generic SEARCH http method
	// app.route<{Body: { email: string}}>({
	// 	method: "SEARCH",
	// 	url: "/users",
	//
	// 	handler: async(req, reply) => {
	// 		const { email } = req.body;
	//
	// 		try {
	// 			const theUser = await req.em.findOne(User, { email });
	// 			console.log(theUser);
	// 			reply.send(theUser);
	// 		} catch (err) {
	// 			console.error(err);
	// 			reply.status(500).send(err);
	// 		}
	// 	}
	// });
	
	// CRUD
	// C
	app.post<{Body: ICreateUsersBody}>("/users", async (req, reply) => {
		const { name, email, petType} = req.body;
		
		try {
			const newUser = await req.em.create(User, {
				name,
				email,
				petType
			});

			await req.em.flush();
			
			console.log("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({message: err.message});
		}
	});
	
	//READ
	app.search("/users", async (req, reply) => {
		const { email } = req.body;
		
		try {
			const theUser = await req.em.findOne(User, { email });
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
	// UPDATE
	app.put<{Body: ICreateUsersBody}>("/users", async(req, reply) => {
		const { name, email, petType} = req.body;
		
		const userToChange = await req.em.findOne(User, {email});
		userToChange.name = name;
		userToChange.petType = petType;
		
		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
		
	});
	
	// DELETE
	app.delete<{ Body: {email, password}}>("/users", async(req, reply) => {
		const { email, password} = req.body;
		if(password === process.env.ADMIN_PASS) {
			try {
				const theUser = await req.em.findOne(User, {email}, {
					populate: [ // Collection names in User.ts
						"matches",
						"matched_by",
						"sent_messages",
						"recieved_messages"
					]
				});

				await req.em.remove(theUser).flush();
				console.log(theUser);
				reply.send(theUser);
			} catch (err) {
				console.error(err);
				reply.status(500).send(err);
			}
		}else{
			console.error("Invalid admin password");
			reply.status(401).send("Invalid admin password");
		}
	});

	// CREATE MATCH ROUTE
	app.post<{Body: { email: string, matchee_email: string }}>("/match", async (req, reply) => {
		const { email, matchee_email } = req.body;

		try {
			// make sure that the matchee exists & get their user account
			const matchee = await req.em.findOne(User, { email: matchee_email });
			// do the same for the matcher/owner
			const owner = await req.em.findOne(User, { email });

			//create a new match between them
			const newMatch = await req.em.create(Match, {
				owner,
				matchee
			});

			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send(newMatch);
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}

	});

	app.post<{Body: { sender: string, receiver: string, message: string}}>
	("/messages", async (req, reply) => {
		const { sender, receiver, message} = req.body;

		let badWord = false;

		try {
			// make sure that the matchee exists & get their user account
			const receiving_user = await req.em.findOne(User, { email: receiver});
			// do the same for the matcher/owner
			const sending_user= await req.em.findOne(User, { email: sender});

			const data = BadWords.toString();
			const badWords = data.split(/\r?\n/);

			for(let i =0; i < badWords.length; i++){
				if(message.includes(badWords[i])){badWord = true;}
			}

			if(!badWord) {
				//create a new match between them
				const newMessage = await req.em.create(Messages, {
					sending_user,
					receiving_user,
					message
				});

				//persist it to the database
				await req.em.flush();
				// send the match back to the user
				return reply.send(newMessage);
			}else{
				console.error("You tried to send a naughty message");
				return reply.status(500).send("You tried to send a naughty message");
			}
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}

	});

	app.search("/messages/sent", async (req, reply) => {
		const { sender} = req.body;

		const email = sender;

		try {
			const theUser = await req.em.findOne(User, { email});
			const sending_user = theUser.id;
			const theMessages = await req.em.find(Messages, {sending_user});
			reply.send(theMessages);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	app.search("/messages", async (req, reply) => {
		const {receiver} = req.body;

		const email = receiver;

		try {
			const theUser = await req.em.findOne(User, { email});
			const receiving_user = theUser.id;
			const theMessages = await req.em.find(Messages, {receiving_user});
			reply.send(theMessages);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});

	app.put<{Body: { messageId: number, message: string}}>("/messages", async(req, reply) => {
		const { messageId, message} = req.body;

		const id = messageId;
		let badWord = false;

		const data = BadWords.toString();
		const badWords = data.split(/\r?\n/);

		for(let i =0; i < badWords.length; i++){
			if(message.includes(badWords[i])){badWord = true;}
		}

		if(!badWord) {
			const messageToChange = await req.em.findOne(Messages, {id});
			messageToChange.message = message;
			await req.em.flush();
			console.log(messageToChange);
			reply.send(messageToChange);
		}else{
			console.error("You tried to edit an existing message to a naughty message");
			return reply.status(500).send("You tried to edit an existing message to a naughty message");
		}
	});

	app.delete<{ Body: {messageId: number, password: string}}>("/messages", async(req, reply) => {
		const { messageId, password } = req.body;

		if(password === process.env.ADMIN_PASS) {
			const id = messageId;

			try {
				const theMessage = await req.em.findOne(Messages, {id});

				await req.em.remove(theMessage).flush();
				console.log(theMessage);
				reply.send(theMessage);
			} catch (err) {
				console.error(err);
				reply.status(500).send(err);
			}
		}else{
			console.error("Invalid admin password");
			reply.status(401).send("Invalid admin password");
		}
	});

	app.delete<{ Body: {sender: string, password: string}}>("/messages/all", async(req, reply) => {
		const { sender, password } = req.body;

		const email = sender;

		if(password === process.env.ADMIN_PASS) {
			try {
				const theUser = await req.em.findOne(User, {email});
				const sending_user = theUser.id;
				const theMessages = await req.em.find(Messages, {sending_user});
				await req.em.remove(theMessages).flush();
				reply.send(theMessages);
			} catch (err) {
				console.error(err);
				reply.status(500).send(err);
			}
		}else{
			console.error("Invalid admin password");
			reply.status(401).send("Invalid admin password");
		}
	});
}

export default DoggrRoutes;
