import {useParams} from "react-router-dom";

export enum SubmissionStatus {
    NotSubmitted,
    SubmitFailed,
    SubmitSucceeded
}

export const CreateMessage = () => {

    const { senderId, receiverId } = useParams();

    if(senderId != receiverId){
        console.log(senderId, receiverId);
    }else{
        console.log("same user");
    }

    return(
        <h1>Hello</h1>
    );

};
