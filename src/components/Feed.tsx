import React from "react";
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { app } from "../firebase";
import Post from "./Post";

interface PostData {
  id: string; // Add the id field here
  image: string;
  name: string;
  profileImg: string;
  text: string;
  timestamp: Timestamp;
  uid: string;
  username: string;
}

const Feed = async () => {
  const db = getFirestore(app);
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  const data: PostData[] = querySnapshot.docs.map(
    (doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id, // Include the document ID
      ...(doc.data() as Omit<PostData, "id">), // Spread the rest of the data
    })
  );
  console.log(data);

  return (
    <div>
      {data.map((post) => (
        <Post key={post.id} post={post} id={post.id} />
      ))}
    </div>
  );
};

export default Feed;
