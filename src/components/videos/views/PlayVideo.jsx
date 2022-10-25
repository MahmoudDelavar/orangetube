import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Comment from "../comment/coment";
import LikeAndDisLike from "../LikeAndDislike/Like&Disike";
import Subscribe from "../subscribe/subscribe";
import SideVideo from "./sideVideo";
import { Link, Outlet } from "react-router-dom";
import { AiOutlineComment, AiFillVideoCamera } from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
//================================================================

const PlayVideo = () => {
  //------------------States And Initional Data--------------------
  const { videoId } = useParams();
  const [video, setVideo] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [showComment, setShowComment] = useState(false);

  //--------------------------Life Sycel--------------------------
  //__Load Selected Video__
  useEffect(() => {
    axios
      .post("http://orangetube.ir/api/videos/getVideo", { videoId })
      .then((res) => {
        setVideo(res.data.data);
      });
  });

  //-----------------------Personal Functions-----------------------
  //__Uptated Comments(last Comment)__
  const updateComments = (newComment) => {
    setCommentList(commentList.concat(newComment));
  };

  //__Load This Video Comments(All Comments)__
  const handleLoadComments = () => {
    axios
      .post("http://orangetube.ir/api/comments/getComments", { videoId })
      .then((res) => {
        setCommentList(res.data.data);
        setShowComment(!showComment);
      });
  };

  //================================================================
  if (video.writer) {
    return (
      <>
        <div className="row mt-4">
          <div className=" col-md-9 col-sm-12 col-xs-12 ">
            {/* ________________Video Player________________ */}
            <div className="row">
              <div className="col-12 ">
                <video
                  controls
                  style={{ width: "100%", height: "500px" }}
                  src={`http://orangetube.ir:4000/${video.filePath}`}
                ></video>
              </div>
            </div>

            {/* ___Video Detailes (sub - Likes - comment)___ */}
            <div className="row">
              <div className="row  justify-content-center">
                <div className="col-5">
                  <LikeAndDisLike video videoId={videoId} />
                </div>
                <div className="col-3  comment-logo">
                  <AiOutlineComment onClick={handleLoadComments} size={43} />
                </div>
                <div className="col-3 ">
                  <Subscribe userId={video.writer && video.writer._id} />
                </div>
              </div>

              {/* ______Video Detailes (title - Writer - Description)______ */}
              <div className="row">
                <h4>{video.title}</h4>
                <div>
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                      marginLeft: "5px",
                      borderRadius: "50%",
                    }}
                    src={`http://orangetube.ir:4000/${
                      video.writer && video.writer.avatarPath
                    }`}
                    alt=""
                  />

                  <span>{video.writer && video.writer.userName}</span>
                </div>
                <p>{video.description}</p>
                <hr />
              </div>
            </div>

            {/* ________Commetns(Write Box And View All Comments)________ */}
            <div className="row">
              <div className="col">
                <Comment
                  postId={video._id}
                  refreshFunction={updateComments}
                  commentList={commentList}
                  showComment={showComment}
                />
              </div>
            </div>
          </div>

          {/* ____Sidebar(More Video To Show)____ */}
          <div className=" col-md-3 col-sm-12 col-xs-12 text-center">
            <SideVideo />
          </div>
        </div>
      </>
    );
  } else {
    return <>Loding</>;
  }
};

export default PlayVideo;
