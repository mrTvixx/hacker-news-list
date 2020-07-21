import React,
{
  memo,
  useState,
  useEffect,
  useCallback,
} from "react";

import StoryPreview from '../../components/StoryPreview';
import { topStoriesRequest, twentyStoryRequest } from "../../utils";

import "./index.scss";

const INTERSECTION_OPTIONS = {
  threshold: 0,
};


const MainPage = () => {
  const [storiesIdList, setStoriesIdList] = useState([]);
  const [storiesList, setStoriesList] = useState([]);
  const [isFetch, setIsFetch] = useState(false);
  // news range of the current scroll level
  const [pageMinId, setPageMinId] = useState(0);
  const [pageMaxId, setPageMaxId] = useState(0);

  const setObserver = useCallback(
    () => {
      const lastStory = document.getElementById('stories-list').lastElementChild;
      if (!lastStory) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPageMaxId((val) => val + 20);
            setPageMinId((val) => val + 20);
            observer.disconnect();
          }
        });
      }, INTERSECTION_OPTIONS);
      observer.observe(lastStory);
    },
    [],
  );

  const getStories = useCallback(
    async () => {
      const idsList = storiesIdList.slice(pageMinId, pageMaxId);
      if (
        !idsList.length
        || (!pageMaxId && !pageMinId)
        || ((pageMaxId - pageMinId) !== 20)
      ) {
        setIsFetch(false);
        return;
      }
      setIsFetch(true);
      const response = await twentyStoryRequest(idsList);
      setStoriesList((data) => ([...data, ...response]));
      setObserver();
    },
    [
      pageMaxId,
      pageMinId,
      storiesIdList,
      setObserver,
    ]
  );

  useEffect(() => {
    const getData = async () => {
      setIsFetch(true);
      const response = await topStoriesRequest();
      setStoriesIdList(response);
      setPageMaxId(20);
      setPageMinId(0);
    };
    
    getData()
  },
    []
  );

  useEffect(
    () => {
      getStories()
    },
    [
      getStories,
      pageMaxId,
      pageMinId,
    ],
  );

  return (
    <div className="stories">
      <div id="stories-list" className="stories-list">
        {
          storiesList.map((item) => (
            <StoryPreview
              key={item.id}
              title={item.title}
              url={item.url}
              kids={item.kids}
              id={item.id}
            />
          ))
        }
      </div>
      {
        isFetch && (
          <div className="stories__fetch-msg">Loading...</div>
        )
      }
    </div>
  );
};

export default memo(MainPage);
