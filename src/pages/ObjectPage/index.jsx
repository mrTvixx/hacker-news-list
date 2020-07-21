import React,
{
  memo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useParams } from 'react-router-dom';

import { oneObjectRequest, objectsRequest } from '../../utils'

import "./index.scss";


const StoriePage = () => {
  const params = useParams();

  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [kids, setKids] = useState([]);
  // comments range of the current scroll level
  const [pageMinId, setPageMinId] = useState(null);
  const [pageMaxId, setPageMaxId] = useState(null);

  const getComments = useCallback(
    async (min = 0, max = 5, kids) => {
      const res = await objectsRequest(kids.slice(min, max));
      setComments(res);
      setPageMaxId(max);
      setPageMinId(min);
    },
    [],
  );

  useEffect(
    () => {
      const getData = async () => {
        const { id } = params;
        const response = await oneObjectRequest(id);
        
        setKids(response.kids || []);
        setStory(response);
        getComments(0, 5, response.kids || []);
      };

      getData();
    },
    [
      params,
      getComments,
    ],
  );

  const handleCommentsRange = useCallback(
    async (type) => {
      const max = type === 'next' ? pageMaxId + 5 : pageMaxId - 5;
      const min = type === 'next' ? pageMinId + 5 : pageMinId - 5;

      getComments(min, max, kids);
    },
    [
      pageMaxId,
      pageMinId,
      getComments,
      kids,
    ],
  );

  return (
    <div className="story">
      <a href="/" className="story__main-link">{'<< Main'}</a>
      {story ? (
        <>
          <div className="story__title">{story.title}</div>
          {
            story.url && (
              <a
                className="story__url"
                rel="noopener noreferrer"
                target="_blank"
                href={story.url}
              >
                {story.url}
              </a>
            )
          }
          {
            Boolean(kids.length) && (
              <div className="story__comments-count">
                <div className="story__comments-controls">
                  {
                    Boolean(pageMinId) && (
                      <span
                        className="story__comments-btn"
                        onClick={() => handleCommentsRange('prev')}
                      >
                        Prev. comments
                      </span>)
                  }
                  {
                    pageMaxId < kids.length && kids.length > 3 && (
                      <span
                        className="story__comments-btn"
                        onClick={() => handleCommentsRange('next')}
                      >
                        Next comments
                      </span>)
                  }
                </div>
                <span>{`${kids.length < 6 ? kids.length : 5}/${kids.length}`}</span>
              </div>
            )
          }
          <div className="story__comments">
            {
              comments.map((item) => (
                <div key={item.id} className="comments__item">
                  {
                    item.deleted
                      ? ('DELETED')
                      : (
                        <>
                          <div className="comments__author">{item.by}</div>
                          <div
                            // under the condition of trusting the source
                            // we use the unsafe method of rendering the html string.
                            // if necessary, you can make a replay of the
                            // reserved script to avoid xss attacks
                            dangerouslySetInnerHTML={{ __html: item.text }}
                            className="comments__content"
                          />
                        </>
                      )
                  }
                </div>
              ))
            }
          </div>
        </>
      )
      : <span>Loading...</span> 
      }
    </div>
  );
};

export default memo(StoriePage);
