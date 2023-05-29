import {useLocation, useParams} from "react-router-dom";
import {httpClient} from "@/Services/HttpClient.tsx";
import {useState} from "react";
import {useAuth} from "@/Services/Auth.tsx";
import {ProfileType} from "@/DoggrTypes.ts";

export enum SubmissionStatus {
    NotSubmitted,
    SubmitFailed,
    SubmitSucceeded
}

export const CreateMessage = () => {


    const [message, setMessage] = useState("");
    const auth = useAuth();
    const senderId = auth.userId;

   const locationState = useLocation().state;
   const receiverId = locationState.receiver_id;

    if(senderId != receiverId){
        console.log(senderId, receiverId);
    }else{
        console.log("same user");
    }

    const onSendMessage = (ev) => {
        return httpClient.post("/messages", { sender_id: senderId, receiver_id: receiverId, message: message});
    };

    return (
        <div className="flex flex-col items-center bg-slate-700 w-4/5 mx-auto p-5 rounded-box">


            <div className="flex flex-col w-full mb-5">
                <label htmlFor="message" className="text-blue-300 mb-2">Message</label>
                <input
                    placeholder="Message..."
                    type="text"
                    id="message"
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    name="message"
                    className="input input-bordered"
                />
            </div>
            {
                <div>
                    <button className="btn btn-primary btn-circle" onClick={onSendMessage}>Send</button>
                </div>
            }
        </div>
    );
};
