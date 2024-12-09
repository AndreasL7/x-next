"use client";
import React, { useState, useEffect } from "react";
import { app } from "../firebase";
import {
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  collection,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import Comment from "./Comment";

interface CommentProps {
  id: string;
}

interface CommentData {
  name: string;
  username: string;
  userImg: string;
  text: string;
  comment: string;
  timestamp: Date; // or Firebase `Timestamp` if you're using that
}

const Comments = ({ id }: CommentProps) => {
  const db = getFirestore(app);
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        const commentList: CommentData[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as CommentData), // Cast Firestore data to `CommentData`
          timestamp: doc.data().timestamp.toDate(), // Convert `Timestamp` to `Date` if needed
        }));
        setComments(commentList);
      }
    );

    return () => unsubscribe(); // Clean up the listener
  }, [db, id]);

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.timestamp.toString()}
          comment={comment}
          commentId={id}
          originalPostId={id}
        />
      ))}
      ;
    </div>
  );
};

export default Comments;
