/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const { useEffect, useState } = React;

interface UserName {
  first: string;
  last: string;
  title: string;
}

interface UserPicture {
  thumbnail: string;
}

interface UserInfo {
  name: UserName;
  picture: UserPicture;
}

const fetchRandomData = (pageNumber: number) => {
  return axios
    .get('https://randomuser.me/api')
    .then(({ data }) => {
      // console.log(data);
      return data;
    })
    .catch((err) => {
      // console.log(err);
    });
};

const getFullUserName = (userInfo: UserInfo) => {
  const {
    name: { first, last },
  } = userInfo;
  return `${first} ${last}`;
};

export default function App() {
  const [nextPageNumber, setNextPageNumber] = useState(1);
  const [userInfos, setUserInfos] = useState([]);
  const [randomUserDataJSON, setRandomUserDataJSON] = useState('');

  const fetchNextUser = () => {
    fetchRandomData(nextPageNumber).then((randomData) => {
      if (randomData === undefined) return;

      const newUserInfos = [...userInfos, ...randomData.results];
      setUserInfos(newUserInfos);
      setNextPageNumber(randomData.info.page + 1);
    });
  };

  useEffect(() => {
    fetchNextUser();
  }, []);

  return (
    <div className="App">
      <button
        onClick={() => {
          fetchNextUser();
        }}
      >
        Fetch Random Data
      </button>
      {userInfos.map((userInfo: UserName, idx: number) => (
        <div key={idx}>
          <p>{getFullUserName(userInfo)}</p>
          <img src={userInfo.picture.thumbnail} />
        </div>
      ))}
      <pre>{randomUserDataJSON}</pre>
    </div>
  );
}

if (typeof window !== 'undefined') {
  ReactDOM.render(<App />, document.getElementById('root'));
}
