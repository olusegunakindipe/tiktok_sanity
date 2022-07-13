import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client } from '../../utils/client';
import { CommentProps, Video } from '../../utils/types';
import Likes from '../../components/Likes';
import { GiRoyalLove } from 'react-icons/gi';
import useAuthStore from '../../store/auth';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { AiFillDelete } from 'react-icons/ai';
interface IProps {
  post: Video;
}

const Detail = ({ post }: IProps) => {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>({} as HTMLVideoElement);
  const { userProfile }: { userProfile: any } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [play, setPlay] = useState<boolean>(true);
  const [mute, setMute] = useState<boolean>(true);
  const [value, setValue] = useState<string>('');

  const handleLikes = async () => {
    if (post.likes && post.likes.length > 0) {
      setLoading(true);
      post.likes.find((item) => {
        if (item._ref === `${userProfile._id}`) {
          client
            .patch(post._id)
            .unset(['likes[0]', 'likes[_key=="{item._key}"]'])
            .commit()
            .then(() => {
              setLoading(false);
              console.log('!Deleted');
            })
            .catch((err) => {
              console.log('Failed Deletion', err.message);
            });
          router.replace(router.asPath);
        }
      });
    } else {
      setLoading(true);

      client
        .patch(post._id)
        .setIfMissing({ likes: [] })
        .insert('after', 'likes[-1]', [
          { _type: 'reference', _ref: `${userProfile._id}` },
        ])
        .commit({
          autoGenerateArrayKeys: true,
        })
        .then(() => {
          setLoading(false);
          console.log('!Added');
        })

        .catch((err) => {
          console.error('Failed Status', err.message);
        });
      router.replace(router.asPath);
    }
  };

  const handlePlay = async () => {
    videoRef.current.play();
    setPlay(false);
  };

  const handlePause = async () => {
    videoRef.current.pause();
    setPlay(true);
  };

  const handleVolume = async () => {
    setMute(false);
  };

  const handleMute = async () => {
    setMute(true);
  };

  const handleClose = async () => {
    router.push('/');
  };

  const sortData = (a: any, b: any) => {
    const first = Date.parse(a.postedBy._createdAt);
    const second = Date.parse(b.postedBy._createdAt);

    return second - first;
  };

  const handleComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (value) {
      client
        .patch(post._id)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment: `${value}`,
            _type: 'comment',
            postedBy: { _ref: `${userProfile._id}`, _type: 'reference' },
          },
        ])
        .commit({ autoGenerateArrayKeys: true })
        .then((data) => {
          console.log('comment added', data);
        })
        .catch((err) => {
          console.error('Failed to commit', err.message);
        });
    }
    setValue('');
    router.replace(router.asPath);
  };

  const handleDelete = async (data: CommentProps) => {
    if (data) {
      client
        .patch(post._id)
        .unset(['comments[0]', 'comments[_key == "{data._key}"]'])
        .commit()
        .then(() => {
          console.log('Comment Deleted');
        })
        .catch((err) => {
          console.error('Error Occured', err.message);
        });
      router.replace(router.asPath);
    }
  };
  return (
    <div className="post-container">
      <div className="content">
        <div className="cancle-box">
          <AiOutlineCloseCircle
            color="white"
            className="cancel"
            onClick={handleClose}
          />
        </div>
        <div className="video">
          <video
            ref={videoRef}
            src={post?.video?.asset?.url}
            className="video-player"
          ></video>
          {play ? (
            <button onClick={handlePlay} className="play">
              <BsFillPlayFill size={50} color="white" />
            </button>
          ) : (
            <button onClick={handlePause} className="play">
              <BsFillPauseFill size={50} color="white" />
            </button>
          )}

          {mute ? (
            <button onClick={handleVolume} className="volumeUp">
              <HiVolumeUp size={30} color="white" />
            </button>
          ) : (
            <button onClick={handleMute} className="volumeUp">
              <HiVolumeOff size={30} color="white" />
            </button>
          )}
          <button></button>
        </div>
      </div>
      <div className="like-comment">
        <div className="all-likes">
          <Likes
            image={post?.postedBy.image}
            name={post?.postedBy.username}
            caption={post?.caption}
          />
          <div className="button-likes">
            <button className="love" onClick={handleLikes}>
              <GiRoyalLove size={10} />
            </button>
            {loading ? (
              <p>loading...</p>
            ) : (
              post.likes &&
              post.likes.length > 0 && (
                <p className="post-likes">{post?.likes?.length}</p>
              )
            )}
          </div>
        </div>
        {/* {console.log(sortData(post))} */}
        <div className="comme">
          <div className="all-likes comments">
            <div className="first-comment">
              {post.comments &&
                post.comments.sort(sortData).map((comment) => {
                  return (
                    <div key={comment._key} className="commentonly">
                      <Likes
                        image={comment.postedBy.image}
                        name={comment.postedBy.username}
                        comment={comment.comment}
                      />
                      <button
                        type="button"
                        onClick={() => handleDelete(comment)}
                      >
                        <AiFillDelete size={20} color="red" />
                      </button>
                    </div>
                  );
                })}
            </div>
            <div className="box">
              <InputField
                type="text"
                name="comment"
                placeholder="Add Comment"
                onChange={(event) => setValue(event?.target.value)}
                value={value}
                big
              />
              <div className="comment-button">
                <Button
                  variant="primary"
                  height="40px"
                  width="100%"
                  onClick={handleComment}
                  radius="5px"
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug;
  // const {
  //   params: { slug }
  // } = context;
  const query = `*[_type == "post" && slug.current == '${slug}'] | order(comments)[0]{
    ...,
    postedBy->,
    video{
      asset->
    },
    comments[]{
      comment,
      _key,
      postedBy->
    }
  }`;

  const post = await client.fetch(query);

  return {
    props: { post },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"]`;

  const response = await client.fetch(query);
  const paths = response.map((post: Video) => {
    return {
      params: {
        slug: post.slug.current,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};
