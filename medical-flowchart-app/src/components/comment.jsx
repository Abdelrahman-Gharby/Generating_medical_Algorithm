// CommentSection.jsx
import { useState, useEffect } from "react";
import "../styles/SideBar.css";
import {
  getComments,
  addComment,
  likeComment,
  deleteComment,
  editComment,
} from "../api/commentsApis";

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [algorithmId, setAlgorithmId] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("algorithm_id");
    if (id) setAlgorithmId(id);
  }, []);

  useEffect(() => {
    if (algorithmId) fetchAndSort();
  }, [algorithmId]);

  const sortByLikes = (list) =>
    list
      .map((c) => ({ ...c, replies: sortByLikes(c.replies || []) }))
      .sort((a, b) => b.likes - a.likes);

  const fetchAndSort = async () => {
    try {
      const data = await getComments(algorithmId);
      setComments(sortByLikes(data));
    } catch (err) {
      console.error("Fetching comments failed:", err.message);
    }
  };

  const handleAdd = async (text, parentId = null) => {
    try {
      await addComment({ text, parentId, algorithmId });
      fetchAndSort();
    } catch (err) {
      console.error("Add comment failed:", err.message);
    }
  };

  const handleLike = async (commentId) => {
    const comment = findComment(comments, commentId);
    if (!comment) return;
    await likeComment({ commentId, likes: comment.likes + 1 });
    fetchAndSort();
  };

  const handleDelete = async (commentId) => {
    await deleteComment(commentId);
    fetchAndSort();
  };

  const handleEdit = async (commentId, newText) => {
    await editComment({ commentId, newText });
    fetchAndSort();
  };

  const findComment = (list, id) =>
    list.reduce(
      (acc, c) =>
        acc ||
        (c.id === id ? c : c.replies && findComment(c.replies, id)),
      null
    );

  return (
    <div className="comment-section">
      <div className="scrollable">
        <CommentList
          comments={comments}
          addComment={handleAdd}
          likeComment={handleLike}
          deleteComment={handleDelete}
          editComment={handleEdit}
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = e.target.comment.value.trim();
          if (text) handleAdd(text);
          e.target.comment.value = "";
        }}
        className="add-comment"
      >
        <textarea
          name="comment"
          placeholder="Write a comment..."
          className="comment-textarea"
        />
        <button type="submit" className="post-comment-button">
          Post Comment
        </button>
      </form>
    </div>
  );
}

function CommentList({
  comments,
  addComment,
  likeComment,
  deleteComment,
  editComment,
}) {
  return comments.map((c) => (
    <Comment
      key={c.id}
      comment={c}
      addComment={addComment}
      likeComment={likeComment}
      deleteComment={deleteComment}
      editComment={editComment}
    />
  ));
}

function Comment({
  comment,
  addComment,
  likeComment,
  deleteComment,
  editComment,
}) {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="comment-features">
      <p className="user-name">{comment.username}</p>

      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="edit textarea"
        />
      ) : (
        <p>{comment.text}</p>
      )}

      <div className="buttons">
        <button onClick={() => likeComment(comment.id)} className="like button">
          👍 {comment.likes}
        </button>

        <button
          onClick={() => setShowReply(!showReply)}
          className="reply button"
        >
          Reply
        </button>

        <button onClick={() => setShowMenu(!showMenu)} className="more">
          ⋮
        </button>

        {showMenu && (
          <div className="menu">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="edit button"
            >
              Edit
            </button>
            <button
              onClick={() => {
                deleteComment(comment.id);
                setShowMenu(false);
              }}
              className="delete button"
            >
              Delete
            </button>
          </div>
        )}

        {isEditing && (
          <button
            onClick={() => {
              editComment(comment.id, editText);
              setIsEditing(false);
            }}
            className="save button"
          >
            Save
          </button>
        )}
      </div>

      {showReply && (
        <div className="reply">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="reply input field"
          />
          <button
            onClick={() => {
              if (replyText.trim()) {
                addComment(replyText, comment.id);
                setReplyText("");
                setShowReply(false);
              }
            }}
            className="reply button"
          >
            Reply
          </button>
        </div>
      )}

      {!!comment.replies.length && (
        <div className="nested-replies">
          <CommentList
            comments={comment.replies}
            addComment={addComment}
            likeComment={likeComment}
            deleteComment={deleteComment}
            editComment={editComment}
          />
        </div>
      )}
    </div>
  );
}
