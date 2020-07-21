import React,
{
  memo,
  useState,
  useEffect,
} from "react";
import PropTypes from 'prop-types';

import { objectsRequest } from '../../utils'

import "./index.scss";


const StoryPreview = ({
  id,
  url,
  title,
  kids,
}) => {
  const [comments, setComments] = useState([]);

  useEffect(
    () => {
      const getComments = async () => {
        const len = kids.length;
        const list = len < 4
          ? kids
          : kids.slice(-2)
        const res = await objectsRequest(list);
        setComments(res);
      };

      getComments();
    },
    [kids],
  );

  return (
    <div id={id} className="story-item">
      <a className="story-item__title" href={`/${id}`}>{title}</a>
      {
        url && (
          <a
            className="story-item__url"
            rel="noopener noreferrer"
            target="_blank"
            href={url}
          >
            {url}
          </a>
        )
      }
      {
        Boolean(kids.length) && (
          <div className="story-item__comments-count">
            {`${kids.length < 4 ? kids.length : 3}/${kids.length}`}
          </div>
        )
      }
      <div className="story-item__comments">
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
    </div>
  );
};

StoryPreview.defaultProps = {
  kids: [],
  url: '',
};

StoryPreview.propTypes = {
  id: PropTypes.number.isRequired,
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  kids: PropTypes.array,
};

export default memo(StoryPreview);
